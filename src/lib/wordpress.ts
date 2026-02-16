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
 * Paginates through all entries automatically.
 */
export async function wpGetScores(
  restBase: string,
): Promise<WPPlayerScore[]> {
  const allScores: WPPlayerScore[] = [];
  let page = 1;
  const perPage = 100;

  while (true) {
    const url = `${WP_URL}/wp-json/wp/v2/${restBase}?per_page=${perPage}&page=${page}&orderby=date&order=desc&_fields=id,acf`;

    const res = await fetch(url, {
      headers: { Accept: "application/json", Authorization: authHeader() },
      next: { revalidate: 0 },
    });

    if (!res.ok) {
      console.error(`WP GET ${restBase} page ${page} failed:`, res.status, await res.text());
      break;
    }

    const posts: WPScorePost[] = await res.json();
    if (posts.length === 0) break;

    for (const p of posts) {
      if (!p.acf) continue;
      allScores.push({
        pseudo: p.acf.player_pseudo ?? "",
        score: Number(p.acf.player_score) || 0,
        title: p.acf.player_title ?? "",
        date: p.acf.score_date ?? "",
        answers: parseAnswers(p.acf.player_answers),
      });
    }

    if (posts.length < perPage) break;
    page++;
  }

  allScores.sort((a, b) => b.score - a.score);
  return allScores;
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
/*  Email sending via custom WP plugin (cdf/v1/send-email)             */
/* ------------------------------------------------------------------ */

/**
 * Send an email via the WordPress wp_mail() function.
 * Requires the "CDF Send Email" plugin activated on the WP instance.
 */
export async function wpSendEmail(
  to: string,
  subject: string,
  body: string
): Promise<boolean> {
  if (!WP_URL) return false;

  try {
    const res = await fetch(`${WP_URL}/wp-json/cdf/v1/send-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader(),
      },
      body: JSON.stringify({ to, subject, body }),
    });
    if (!res.ok) {
      console.error("wpSendEmail failed:", res.status, await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error("wpSendEmail error:", err);
    return false;
  }
}

/* ------------------------------------------------------------------ */
/*  Reset tokens (CPT: cdf-reset-tokens)                               */
/* ------------------------------------------------------------------ */

interface WPResetTokenPost {
  id: number;
  acf: {
    reset_token: string;
    reset_email: string;
    reset_expires_at: string; // ISO timestamp
  };
}

/**
 * Create a reset token stored as a WP post.
 * Deletes any previous token for the same email first.
 */
export async function wpCreateResetToken(
  email: string,
  ttlMs: number
): Promise<string> {
  // Delete existing tokens for this email
  await wpDeleteResetTokensByEmail(email);

  const token = (await import("node:crypto")).randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + ttlMs).toISOString();

  const res = await fetch(`${WP_URL}/wp-json/wp/v2/cdf-reset-tokens`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: authHeader(),
    },
    body: JSON.stringify({
      title: token,
      status: "publish",
      acf: {
        reset_token: token,
        reset_email: email,
        reset_expires_at: expiresAt,
      },
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("wpCreateResetToken failed:", res.status, text);
    throw new Error(`WP create reset token failed: ${res.status}`);
  }

  return token;
}

/** Verify a token without consuming it. Returns the email or null. */
export async function wpVerifyResetToken(token: string): Promise<string | null> {
  const post = await wpFindResetTokenPost(token);
  if (!post) return null;

  if (new Date(post.acf.reset_expires_at).getTime() < Date.now()) {
    // Expired — clean up
    await wpDeletePost("cdf-reset-tokens", post.id);
    return null;
  }

  return post.acf.reset_email;
}

/** Verify and consume (delete) a token. Returns the email or null. */
export async function wpConsumeResetToken(token: string): Promise<string | null> {
  const post = await wpFindResetTokenPost(token);
  if (!post) return null;

  if (new Date(post.acf.reset_expires_at).getTime() < Date.now()) {
    await wpDeletePost("cdf-reset-tokens", post.id);
    return null;
  }

  const email = post.acf.reset_email;
  await wpDeletePost("cdf-reset-tokens", post.id);
  return email;
}

async function wpFindResetTokenPost(token: string): Promise<WPResetTokenPost | null> {
  // Search by slug (title = token, WP auto-generates slug from title)
  const url = `${WP_URL}/wp-json/wp/v2/cdf-reset-tokens?per_page=1&search=${encodeURIComponent(token)}&_fields=id,acf`;
  const res = await fetch(url, {
    headers: { Accept: "application/json", Authorization: authHeader() },
    next: { revalidate: 0 },
  });
  if (!res.ok) return null;

  const posts: WPResetTokenPost[] = await res.json();
  const match = posts.find((p) => p.acf?.reset_token === token);
  return match ?? null;
}

async function wpDeleteResetTokensByEmail(email: string): Promise<void> {
  const url = `${WP_URL}/wp-json/wp/v2/cdf-reset-tokens?per_page=100&_fields=id,acf`;
  const res = await fetch(url, {
    headers: { Accept: "application/json", Authorization: authHeader() },
    next: { revalidate: 0 },
  });
  if (!res.ok) return;

  const posts: WPResetTokenPost[] = await res.json();
  for (const post of posts) {
    if (post.acf?.reset_email === email) {
      await wpDeletePost("cdf-reset-tokens", post.id);
    }
  }
}

async function wpDeletePost(restBase: string, id: number): Promise<void> {
  await fetch(`${WP_URL}/wp-json/wp/v2/${restBase}/${id}?force=true`, {
    method: "DELETE",
    headers: { Authorization: authHeader() },
  });
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
