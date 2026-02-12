import crypto from "node:crypto";
import {
  isWordPressConfigured,
  wpGetScores,
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
  };
}

async function wpFindPlayerByPseudo(pseudo: string): Promise<Player | null> {
  const url = `${WP_URL}/wp-json/wp/v2/cdf-players?per_page=1&search=${encodeURIComponent(pseudo)}&_fields=id,acf`;
  const res = await fetch(url, {
    headers: { Accept: "application/json", Authorization: wpAuth() },
    next: { revalidate: 0 },
  });
  if (!res.ok) return null;
  const posts: WPPlayerPost[] = await res.json();
  const match = posts.find((p) => p.acf.player_pseudo === pseudo);
  if (!match) return null;
  return {
    id: String(match.id),
    pseudo: match.acf.player_pseudo,
    email: match.acf.player_email,
    avatar: match.acf.player_avatar || "🤪",
    passwordHash: match.acf.player_password_hash,
    createdAt: match.acf.player_created_at,
  };
}

async function wpFindPlayerByEmail(email: string): Promise<Player | null> {
  const url = `${WP_URL}/wp-json/wp/v2/cdf-players?per_page=100&_fields=id,acf`;
  const res = await fetch(url, {
    headers: { Accept: "application/json", Authorization: wpAuth() },
    next: { revalidate: 0 },
  });
  if (!res.ok) return null;
  const posts: WPPlayerPost[] = await res.json();
  const match = posts.find((p) => p.acf.player_email === email);
  if (!match) return null;
  return {
    id: String(match.id),
    pseudo: match.acf.player_pseudo,
    email: match.acf.player_email,
    avatar: match.acf.player_avatar || "🤪",
    passwordHash: match.acf.player_password_hash,
    createdAt: match.acf.player_created_at,
  };
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
      },
    }),
  });
  if (!res.ok) {
    throw new Error(`WP create player failed: ${res.status}`);
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
/*  Aggregate stats across games                                       */
/* ------------------------------------------------------------------ */
interface ScoreEntry {
  pseudo: string;
  score: number;
  title: string;
  date: string;
}

export async function getPlayerStats(pseudo: string): Promise<GameStats[]> {
  const games: { name: string; slug: string; restBase: string; apiPath: string }[] = [
    { name: "DSM-6 Version Beta", slug: "/dsm6", restBase: "dsm6-scores", apiPath: "/api/dsm6-scores" },
    { name: "Test de Rorschach", slug: "/rorschach", restBase: "rorschach-scores", apiPath: "/api/rorschach-scores" },
    { name: "Évaluation Émotionnelle", slug: "/evaluation", restBase: "evaluation-scores", apiPath: "/api/evaluation-scores" },
    { name: "Évasion Psychiatrique", slug: "/evasion", restBase: "evasion-scores", apiPath: "/api/evasion-scores" },
    { name: "Test de Motricité Fine", slug: "/motricite", restBase: "motricite-scores", apiPath: "/api/motricite-scores" },
    { name: "Test Cognitif Absurde", slug: "/cognitif", restBase: "cognitif-scores", apiPath: "/api/cognitif-scores" },
  ];

  const stats: GameStats[] = [];

  for (const game of games) {
    let allScores: ScoreEntry[];

    if (isWordPressConfigured()) {
      allScores = await wpGetScores(game.restBase);
    } else {
      // In dev fallback, fetch from own API
      // We import the score modules directly
      allScores = await getScoresForGame(game.restBase);
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
