import crypto from "node:crypto";
import {
  isWordPressConfigured,
  wpGetScores,
  wpDeleteScoresByPseudo,
} from "@/lib/wordpress";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
export const AVATARS = [
  "🤪", "😎", "🧠", "👻", "🦊", "🐱", "🐸", "🎃",
  "🤖", "👽", "🦄", "🐧", "🎭", "🔥", "💀", "🫠",
] as const;

export type AvatarEmoji = (typeof AVATARS)[number];

export interface Player {
  id: string;
  pseudo: string;
  email: string;
  avatar: string;
  passwordHash: string;
  createdAt: string;
  madnessSince: string;
  bio: string;
  autodiagnostic: string;
}

export type PublicPlayer = Omit<Player, "passwordHash">;

export interface PlayerStats {
  player: PublicPlayer;
  games: GameStats[];
}

export interface GameStats {
  game: string;
  slug: string;
  bestScore: number;
  bestTitle: string;
  totalPlays: number;
  lastPlayed: string;
}

/* ------------------------------------------------------------------ */
/*  Password hashing (simple sha256 + salt — no extra deps)            */
/* ------------------------------------------------------------------ */
const SALT = "cdf-quiz-fou-2026";

export function hashPassword(password: string): string {
  return crypto
    .createHash("sha256")
    .update(SALT + password)
    .digest("hex");
}

export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

/* ------------------------------------------------------------------ */
/*  WordPress player storage via custom REST endpoint (plugin v3)      */
/* ------------------------------------------------------------------ */
const WP_URL = process.env.WORDPRESS_URL?.replace(/\/+$/, "") ?? "";
const WP_USER = process.env.WORDPRESS_USER ?? "";
const WP_APP_PASSWORD = process.env.WORDPRESS_APP_PASSWORD ?? "";

function wpAuth(): string {
  return "Basic " + Buffer.from(`${WP_USER}:${WP_APP_PASSWORD}`).toString("base64");
}

interface WPPlayerPost {
  id: number;
  acf: {
    player_pseudo: string;
    player_email: string;
    player_avatar: string;
    player_password_hash: string;
    player_created_at: string;
    player_madness_since?: string;
    player_bio?: string;
    player_autodiagnostic?: string;
  };
}

function wpPostToPlayer(post: WPPlayerPost): Player | null {
  if (!post.acf) return null;
  return {
    id: String(post.id),
    pseudo: post.acf.player_pseudo,
    email: post.acf.player_email,
    avatar: post.acf.player_avatar || "🤪",
    passwordHash: post.acf.player_password_hash,
    createdAt: post.acf.player_created_at,
    madnessSince: post.acf.player_madness_since || "",
    bio: post.acf.player_bio || "",
    autodiagnostic: post.acf.player_autodiagnostic || "",
  };
}

async function wpFindPlayerByPseudo(pseudo: string): Promise<Player | null> {
  // Try slug-based lookup first (exact match, no indexing delay)
  const slugUrl = `${WP_URL}/wp-json/wp/v2/cdf-players?per_page=1&slug=${encodeURIComponent(pseudo.toLowerCase())}&_fields=id,acf`;
  const slugRes = await fetch(slugUrl, {
    headers: { Accept: "application/json", Authorization: wpAuth() },
    next: { revalidate: 0 },
  });
  if (slugRes.ok) {
    const slugPosts: WPPlayerPost[] = await slugRes.json();
    if (slugPosts.length > 0) {
      const player = wpPostToPlayer(slugPosts[0]);
      if (player) return player;
    }
  } else {
    console.error(`wpFindPlayerByPseudo slug lookup failed: ${slugRes.status}`, await slugRes.text().catch(() => ""));
  }

  // Fallback: search-based lookup
  const searchUrl = `${WP_URL}/wp-json/wp/v2/cdf-players?per_page=10&search=${encodeURIComponent(pseudo)}&_fields=id,acf`;
  const res = await fetch(searchUrl, {
    headers: { Accept: "application/json", Authorization: wpAuth() },
    next: { revalidate: 0 },
  });
  if (!res.ok) {
    console.error(`wpFindPlayerByPseudo search failed: ${res.status}`, await res.text().catch(() => ""));
    return null;
  }
  const posts: WPPlayerPost[] = await res.json();
  const match = posts.find((p) => p.acf?.player_pseudo?.toLowerCase() === pseudo.toLowerCase());
  if (!match) return null;
  return wpPostToPlayer(match);
}

async function wpFindPlayerByEmail(email: string): Promise<Player | null> {
  const url = `${WP_URL}/wp-json/wp/v2/cdf-players?per_page=100&_fields=id,acf`;
  const res = await fetch(url, {
    headers: { Accept: "application/json", Authorization: wpAuth() },
    next: { revalidate: 0 },
  });
  if (!res.ok) {
    console.error(`wpFindPlayerByEmail failed: ${res.status}`, await res.text().catch(() => ""));
    return null;
  }
  const posts: WPPlayerPost[] = await res.json();
  const match = posts.find((p) => p.acf?.player_email === email);
  if (!match) return null;
  return wpPostToPlayer(match);
}

async function wpCreatePlayer(player: Player): Promise<void> {
  const res = await fetch(`${WP_URL}/wp-json/wp/v2/cdf-players`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: wpAuth(),
    },
    body: JSON.stringify({
      title: player.pseudo,
      status: "publish",
      acf: {
        player_pseudo: player.pseudo,
        player_email: player.email,
        player_avatar: player.avatar,
        player_password_hash: player.passwordHash,
        player_created_at: player.createdAt,
        player_madness_since: player.madnessSince,
        player_bio: player.bio,
        player_autodiagnostic: player.autodiagnostic,
      },
    }),
  });
  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    console.error(`WP create player failed: ${res.status}`, errText);
    throw new Error(`WP create player failed: ${res.status} — ${errText}`);
  }
}

/* ------------------------------------------------------------------ */
/*  In-memory fallback                                                 */
/* ------------------------------------------------------------------ */
const memoryPlayers: Player[] = [];

/* ------------------------------------------------------------------ */
/*  Public API                                                         */
/* ------------------------------------------------------------------ */
export async function findPlayerByPseudo(pseudo: string): Promise<Player | null> {
  if (isWordPressConfigured()) {
    return wpFindPlayerByPseudo(pseudo);
  }
  return memoryPlayers.find((p) => p.pseudo === pseudo) ?? null;
}

export async function findPlayerByEmail(email: string): Promise<Player | null> {
  if (isWordPressConfigured()) {
    return wpFindPlayerByEmail(email);
  }
  return memoryPlayers.find((p) => p.email === email) ?? null;
}

export async function createPlayer(
  pseudo: string,
  email: string,
  password: string,
  avatar: string = "🤪"
): Promise<PublicPlayer> {
  const player: Player = {
    id: crypto.randomUUID(),
    pseudo,
    email: email.toLowerCase().trim(),
    avatar,
    passwordHash: hashPassword(password),
    createdAt: new Date().toISOString(),
    madnessSince: "",
    bio: "",
    autodiagnostic: "",
  };

  if (isWordPressConfigured()) {
    await wpCreatePlayer(player);
  } else {
    memoryPlayers.push(player);
  }

  const { passwordHash: _, ...publicPlayer } = player;
  return publicPlayer;
}

export function toPublicPlayer(player: Player): PublicPlayer {
  const { passwordHash: _, ...publicPlayer } = player;
  return publicPlayer;
}

/* ------------------------------------------------------------------ */
/*  Avatar update                                                      */
/* ------------------------------------------------------------------ */
export async function updatePlayerAvatar(pseudo: string, avatar: string): Promise<boolean> {
  if (isWordPressConfigured()) {
    return wpUpdatePlayerAvatar(pseudo, avatar);
  }
  const player = memoryPlayers.find((p) => p.pseudo === pseudo);
  if (!player) return false;
  player.avatar = avatar;
  return true;
}

async function wpUpdatePlayerAvatar(pseudo: string, avatar: string): Promise<boolean> {
  const url = `${WP_URL}/wp-json/wp/v2/cdf-players?per_page=1&search=${encodeURIComponent(pseudo)}&_fields=id,acf`;
  const res = await fetch(url, {
    headers: { Accept: "application/json", Authorization: wpAuth() },
    next: { revalidate: 0 },
  });
  if (!res.ok) return false;
  const posts: WPPlayerPost[] = await res.json();
  const match = posts.find((p) => p.acf.player_pseudo === pseudo);
  if (!match) return false;

  const updateRes = await fetch(`${WP_URL}/wp-json/wp/v2/cdf-players/${match.id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: wpAuth(),
    },
    body: JSON.stringify({
      acf: { player_avatar: avatar },
    }),
  });
  return updateRes.ok;
}

/* ------------------------------------------------------------------ */
/*  Profile fields update (madnessSince, bio, autodiagnostic)          */
/* ------------------------------------------------------------------ */
export async function updatePlayerProfile(
  pseudo: string,
  fields: { madnessSince?: string; bio?: string; autodiagnostic?: string }
): Promise<boolean> {
  if (isWordPressConfigured()) {
    return wpUpdatePlayerProfile(pseudo, fields);
  }
  const player = memoryPlayers.find((p) => p.pseudo === pseudo);
  if (!player) return false;
  if (fields.madnessSince !== undefined) player.madnessSince = fields.madnessSince;
  if (fields.bio !== undefined) player.bio = fields.bio;
  if (fields.autodiagnostic !== undefined) player.autodiagnostic = fields.autodiagnostic;
  return true;
}

async function wpUpdatePlayerProfile(
  pseudo: string,
  fields: { madnessSince?: string; bio?: string; autodiagnostic?: string }
): Promise<boolean> {
  const url = `${WP_URL}/wp-json/wp/v2/cdf-players?per_page=1&search=${encodeURIComponent(pseudo)}&_fields=id,acf`;
  const res = await fetch(url, {
    headers: { Accept: "application/json", Authorization: wpAuth() },
    next: { revalidate: 0 },
  });
  if (!res.ok) return false;
  const posts: WPPlayerPost[] = await res.json();
  const match = posts.find((p) => p.acf.player_pseudo === pseudo);
  if (!match) return false;

  const acf: Record<string, string> = {};
  if (fields.madnessSince !== undefined) acf.player_madness_since = fields.madnessSince;
  if (fields.bio !== undefined) acf.player_bio = fields.bio;
  if (fields.autodiagnostic !== undefined) acf.player_autodiagnostic = fields.autodiagnostic;

  const updateRes = await fetch(`${WP_URL}/wp-json/wp/v2/cdf-players/${match.id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: wpAuth(),
    },
    body: JSON.stringify({ acf }),
  });
  return updateRes.ok;
}

/* ------------------------------------------------------------------ */
/*  Password reset                                                      */
/* ------------------------------------------------------------------ */
export async function updatePlayerPassword(
  pseudo: string,
  email: string,
  newPassword: string
): Promise<boolean> {
  if (isWordPressConfigured()) {
    return wpUpdatePlayerPassword(pseudo, email, newPassword);
  }
  const player = memoryPlayers.find(
    (p) => p.pseudo.toLowerCase() === pseudo.toLowerCase() && p.email === email.toLowerCase().trim()
  );
  if (!player) return false;
  player.passwordHash = hashPassword(newPassword);
  return true;
}

async function wpUpdatePlayerPassword(
  pseudo: string,
  email: string,
  newPassword: string
): Promise<boolean> {
  const player = await wpFindPlayerByPseudo(pseudo);
  if (!player) return false;
  if (player.email.toLowerCase() !== email.toLowerCase().trim()) return false;

  const updateRes = await fetch(`${WP_URL}/wp-json/wp/v2/cdf-players/${player.id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: wpAuth(),
    },
    body: JSON.stringify({
      acf: { player_password_hash: hashPassword(newPassword) },
    }),
  });
  return updateRes.ok;
}

/* ------------------------------------------------------------------ */
/*  Account deletion                                                    */
/* ------------------------------------------------------------------ */
export async function deletePlayer(pseudo: string): Promise<boolean> {
  // Delete scores from all games first, then delete the player profile
  if (isWordPressConfigured()) {
    await wpDeleteAllPlayerScores(pseudo);
    return wpDeletePlayer(pseudo);
  }

  // In-memory fallback: delete scores from each game module
  await deleteMemoryScoresForPlayer(pseudo);

  const idx = memoryPlayers.findIndex((p) => p.pseudo === pseudo);
  if (idx === -1) return false;
  memoryPlayers.splice(idx, 1);
  return true;
}

async function wpDeleteAllPlayerScores(pseudo: string): Promise<void> {
  const deletions = GAME_LIST.map((game) =>
    wpDeleteScoresByPseudo(game.restBase, pseudo).catch((err) => {
      console.error(`Failed to delete ${game.restBase} scores for ${pseudo}:`, err);
      return 0;
    })
  );
  const results = await Promise.all(deletions);
  const total = results.reduce((sum, n) => sum + n, 0);
  console.log(`Deleted ${total} score(s) for player ${pseudo}`);
}

async function deleteMemoryScoresForPlayer(pseudo: string): Promise<void> {
  const lowerPseudo = pseudo.toLowerCase();
  for (const game of GAME_LIST) {
    try {
      const mod = await getScoreModuleForGame(game.restBase);
      if (mod) mod.removeByPseudo(lowerPseudo);
    } catch { /* ignore */ }
  }
}

function getScoreModuleForGame(_restBase: string): Promise<{ removeByPseudo: (p: string) => void } | null> {
  // In-memory score deletion is best-effort; modules don't expose removal yet
  return Promise.resolve(null);
}

async function wpDeletePlayer(pseudo: string): Promise<boolean> {
  const player = await wpFindPlayerByPseudo(pseudo);
  if (!player) return false;

  const res = await fetch(`${WP_URL}/wp-json/wp/v2/cdf-players/${player.id}?force=true`, {
    method: "DELETE",
    headers: { Authorization: wpAuth() },
  });
  return res.ok;
}

/* ------------------------------------------------------------------ */
/*  Aggregate stats across games                                       */
/* ------------------------------------------------------------------ */
interface ScoreEntry {
  pseudo: string;
  score: number;
  title: string;
  date: string;
}

export const GAME_LIST = [
  { name: "DSM-6 Version Beta", slug: "/dsm6", restBase: "dsm6-scores", apiPath: "/api/dsm6-scores" },
  { name: "Test de Rorschach", slug: "/rorschach", restBase: "rorschach-scores", apiPath: "/api/rorschach-scores" },
  { name: "Évaluation Émotionnelle", slug: "/evaluation", restBase: "evaluation-scores", apiPath: "/api/evaluation-scores" },
  { name: "Évasion Psychiatrique", slug: "/evasion", restBase: "evasion-scores", apiPath: "/api/evasion-scores" },
  { name: "Test de Motricité Fine", slug: "/motricite", restBase: "motricite-scores", apiPath: "/api/motricite-scores" },
  { name: "Test Cognitif Absurde", slug: "/cognitif", restBase: "cognitif-scores", apiPath: "/api/cognitif-scores" },
];

/** Maximum possible score per game — used to normalize all games to a 0-100 scale */
export const GAME_MAX_SCORES: Record<string, number> = {
  "dsm6-scores": 450,        // 15 questions × 30 pts
  "rorschach-scores": 300,    // 10 questions × 30 pts
  "evaluation-scores": 150,   // 5 questions × 30 pts
  "evasion-scores": 30,       // 30 jours max
  "motricite-scores": 100,    // pourcentage 0-100
  "cognitif-scores": 160,     // QI max
};

/**
 * Compute a normalized global score (0–100) where each game contributes equally.
 * Each game's best score is converted to a percentage of its max, then averaged.
 */
export function computeNormalizedGlobalScore(games: GameStats[]): number {
  if (games.length === 0) return 0;

  let totalPct = 0;
  for (const game of games) {
    const gameEntry = GAME_LIST.find((g) => g.name === game.game);
    const maxScore = gameEntry ? (GAME_MAX_SCORES[gameEntry.restBase] ?? 100) : 100;
    totalPct += Math.min(100, (game.bestScore / maxScore) * 100);
  }

  return Math.round(totalPct / games.length);
}

export async function getPlayerStats(pseudo: string): Promise<GameStats[]> {
  const stats: GameStats[] = [];

  for (const game of GAME_LIST) {
    let allScores: ScoreEntry[];

    try {
      if (isWordPressConfigured()) {
        allScores = await wpGetScores(game.restBase);
      } else {
        allScores = await getScoresForGame(game.restBase);
      }
    } catch (err) {
      console.error(`getPlayerStats: failed to fetch ${game.restBase}:`, err);
      continue;
    }

    const playerScores = allScores.filter(
      (s) => s.pseudo.toLowerCase() === pseudo.toLowerCase()
    );

    if (playerScores.length > 0) {
      const best = playerScores.reduce((a, b) => (a.score > b.score ? a : b));
      const latest = playerScores.reduce((a, b) =>
        new Date(a.date) > new Date(b.date) ? a : b
      );
      stats.push({
        game: game.name,
        slug: game.slug,
        bestScore: best.score,
        bestTitle: best.title,
        totalPlays: playerScores.length,
        lastPlayed: latest.date,
      });
    }
  }

  return stats;
}

async function getScoresForGame(restBase: string): Promise<ScoreEntry[]> {
  if (restBase === "dsm6-scores") {
    const { getDSM6Scores } = await import("@/data/dsm6-scores");
    return getDSM6Scores();
  }
  if (restBase === "rorschach-scores") {
    const { getRorschachScores } = await import("@/data/rorschach-scores");
    return getRorschachScores();
  }
  if (restBase === "evaluation-scores") {
    const { getEvaluationScores } = await import("@/data/evaluation-scores");
    return getEvaluationScores();
  }
  if (restBase === "evasion-scores") {
    const { getEvasionScores } = await import("@/data/evasion-scores");
    return getEvasionScores();
  }
  if (restBase === "motricite-scores") {
    const { getMotriciteScores } = await import("@/data/motricite-scores");
    return getMotriciteScores();
  }
  if (restBase === "cognitif-scores") {
    const { getCognitifScores } = await import("@/data/cognitif-scores");
    return getCognitifScores();
  }
  return [];
}

/* ------------------------------------------------------------------ */
/*  Global leaderboard across all games                                */
/* ------------------------------------------------------------------ */
export interface GlobalPlayerScore {
  pseudo: string;
  avatar: string;
  globalScore: number;
  gamesPlayed: number;
}

export async function getAllPlayersGlobalScores(): Promise<GlobalPlayerScore[]> {
  // Collect all scores from every game
  const allGameScores: ScoreEntry[][] = await Promise.all(
    GAME_LIST.map((game) =>
      isWordPressConfigured()
        ? wpGetScores(game.restBase)
        : getScoresForGame(game.restBase)
    )
  );

  // Map pseudo -> { bestScorePerGame, gamesPlayed }
  const playerMap = new Map<string, { bestScores: Map<number, number>; totalGames: Set<number> }>();

  for (let gi = 0; gi < allGameScores.length; gi++) {
    for (const entry of allGameScores[gi]) {
      const key = entry.pseudo.toLowerCase();
      if (!playerMap.has(key)) {
        playerMap.set(key, { bestScores: new Map(), totalGames: new Set() });
      }
      const data = playerMap.get(key)!;
      data.totalGames.add(gi);
      const prev = data.bestScores.get(gi) ?? 0;
      if (entry.score > prev) {
        data.bestScores.set(gi, entry.score);
      }
    }
  }

  // Build results with normalized scoring and avatar lookup
  const results: GlobalPlayerScore[] = [];

  for (const [, data] of playerMap) {
    // Normalize each game's best score to 0-100, then average
    let totalPct = 0;
    for (const [gi, score] of data.bestScores.entries()) {
      const restBase = GAME_LIST[gi]?.restBase;
      const maxScore = restBase ? (GAME_MAX_SCORES[restBase] ?? 100) : 100;
      totalPct += Math.min(100, (score / maxScore) * 100);
    }
    const globalScore = data.bestScores.size > 0
      ? Math.round(totalPct / data.bestScores.size)
      : 0;

    results.push({
      pseudo: "",    // filled below
      avatar: "🤪",
      globalScore,
      gamesPlayed: data.totalGames.size,
    });
  }

  // Fill pseudos with original casing from first score encounter
  let idx = 0;
  for (const [key] of playerMap) {
    // Find original casing
    let originalPseudo = key;
    for (const scores of allGameScores) {
      const match = scores.find((s) => s.pseudo.toLowerCase() === key);
      if (match) {
        originalPseudo = match.pseudo;
        break;
      }
    }
    results[idx].pseudo = originalPseudo;

    // Try to get avatar from player record
    const player = await findPlayerByPseudo(originalPseudo);
    if (player) {
      results[idx].avatar = player.avatar || "🤪";
    }
    idx++;
  }

  // Sort by global score descending
  results.sort((a, b) => b.globalScore - a.globalScore);

  return results;
}

/* ------------------------------------------------------------------ */
/*  Per-game leaderboards                                              */
/* ------------------------------------------------------------------ */
export interface GameLeaderboardEntry {
  pseudo: string;
  score: number;
  title: string;
}

export interface GameLeaderboard {
  game: string;
  emoji: string;
  slug: string;
  entries: GameLeaderboardEntry[];
}

const GAME_EMOJIS: Record<string, string> = {
  "DSM-6 Version Beta": "🏥",
  "Test de Rorschach": "🫠",
  "Évaluation Émotionnelle": "🧠",
  "Évasion Psychiatrique": "🏥",
  "Test de Motricité Fine": "🎯",
  "Test Cognitif Absurde": "🧠",
};

export async function getPerGameLeaderboards(limit = 5): Promise<GameLeaderboard[]> {
  const allGameScores: ScoreEntry[][] = await Promise.all(
    GAME_LIST.map((game) =>
      isWordPressConfigured()
        ? wpGetScores(game.restBase)
        : getScoresForGame(game.restBase)
    )
  );

  return GAME_LIST.map((game, gi) => {
    const scores = allGameScores[gi];

    // Keep only the best score per pseudo
    const bestByPseudo = new Map<string, ScoreEntry>();
    for (const entry of scores) {
      const key = entry.pseudo.toLowerCase();
      const prev = bestByPseudo.get(key);
      if (!prev || entry.score > prev.score) {
        bestByPseudo.set(key, entry);
      }
    }

    const entries = [...bestByPseudo.values()]
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((e) => ({ pseudo: e.pseudo, score: e.score, title: e.title }));

    return {
      game: game.name,
      emoji: GAME_EMOJIS[game.name] ?? "🎮",
      slug: game.slug,
      entries,
    };
  });
}
