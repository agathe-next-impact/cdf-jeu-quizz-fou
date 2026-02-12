/**
 * WordPress REST API client for the headless quiz app.
 *
 * Required env vars (set in .env.local):
 *   WORDPRESS_URL            – e.g. https://cms.example.com
 *   WORDPRESS_USER           – WordPress username
 *   WORDPRESS_APP_PASSWORD   – Application Password (Users → Profile)
 */

const WP_URL = process.env.WORDPRESS_URL?.replace(/\/+$/, "") ?? "";
const WP_USER = process.env.WORDPRESS_USER ?? "";
const WP_APP_PASSWORD = process.env.WORDPRESS_APP_PASSWORD ?? "";

function authHeader(): string {
  return (
    "Basic " +
    Buffer.from(`${WP_USER}:${WP_APP_PASSWORD}`).toString("base64")
  );
}

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
interface WPScorePost {
  id: number;
  acf: {
    player_pseudo: string;
    player_score: number;
    player_title: string;
    score_date: string;
    player_answers: string;
  };
}

export interface WPPlayerAnswer {
  questionId: number;
  question: string;
  answerIndex: number;
  answerText: string;
  points: number;
}

export interface WPPlayerScore {
  pseudo: string;
  score: number;
  title: string;
  date: string;
  answers: WPPlayerAnswer[];
}

/* ------------------------------------------------------------------ */
/*  Generic helpers — support multiple CPTs (rest bases)               */
/* ------------------------------------------------------------------ */

/**
 * Fetch scores from a given WP REST base (e.g. "quiz-scores", "dsm6-scores").
 */
export async function wpGetScores(
  restBase: string,
  limit = 100
): Promise<WPPlayerScore[]> {
  const url = `${WP_URL}/wp-json/wp/v2/${restBase}?per_page=${limit}&orderby=date&order=desc&_fields=id,acf`;

  const res = await fetch(url, {
    headers: { Accept: "application/json", Authorization: authHeader() },
    next: { revalidate: 0 },
  });

  if (!res.ok) {
    console.error(`WP GET ${restBase} failed:`, res.status, await res.text());
    return [];
  }

  const posts: WPScorePost[] = await res.json();

  return posts
    .filter((p) => p.acf)
    .map((p) => ({
      pseudo: p.acf.player_pseudo ?? "",
      score: Number(p.acf.player_score) || 0,
      title: p.acf.player_title ?? "",
      date: p.acf.score_date ?? "",
      answers: parseAnswers(p.acf.player_answers),
    }))
    .sort((a, b) => b.score - a.score);
}

/**
 * Create a new score entry in a given WP REST base.
 */
export async function wpAddScore(
  restBase: string,
  entry: WPPlayerScore
): Promise<void> {
  const res = await fetch(`${WP_URL}/wp-json/wp/v2/${restBase}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: authHeader(),
    },
    body: JSON.stringify({
      title: `${entry.pseudo} — ${entry.score} pts`,
      status: "publish",
      acf: {
        player_pseudo: entry.pseudo,
        player_score: entry.score,
        player_title: entry.title,
        score_date: entry.date,
        player_answers: JSON.stringify(entry.answers),
      },
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error(`WP POST ${restBase} failed:`, res.status, text);
    throw new Error(`WordPress API error ${res.status}`);
  }
}

/**
 * Check if the WordPress connection is configured.
 */
export function isWordPressConfigured(): boolean {
  return !!(WP_URL && WP_USER && WP_APP_PASSWORD);
}

/**
 * Delete all score posts matching a pseudo in a given REST base.
 * Returns the number of posts deleted.
 */
export async function wpDeleteScoresByPseudo(
  restBase: string,
  pseudo: string
): Promise<number> {
  // Fetch all posts (paginated, up to 100 per page)
  const searchUrl = `${WP_URL}/wp-json/wp/v2/${restBase}?per_page=100&search=${encodeURIComponent(pseudo)}&_fields=id,acf`;
  const res = await fetch(searchUrl, {
    headers: { Accept: "application/json", Authorization: authHeader() },
    next: { revalidate: 0 },
  });
  if (!res.ok) {
    console.error(`WP search ${restBase} for deletion failed:`, res.status);
    return 0;
  }

  const posts: WPScorePost[] = await res.json();
  const matches = posts.filter(
    (p) => p.acf?.player_pseudo?.toLowerCase() === pseudo.toLowerCase()
  );

  let deleted = 0;
  for (const post of matches) {
    const delRes = await fetch(
      `${WP_URL}/wp-json/wp/v2/${restBase}/${post.id}?force=true`,
      { method: "DELETE", headers: { Authorization: authHeader() } }
    );
    if (delRes.ok) deleted++;
    else console.error(`WP DELETE ${restBase}/${post.id} failed:`, delRes.status);
  }

  return deleted;
}

/* ------------------------------------------------------------------ */
/*  Internals                                                          */
/* ------------------------------------------------------------------ */
function parseAnswers(raw: string | undefined): WPPlayerAnswer[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
