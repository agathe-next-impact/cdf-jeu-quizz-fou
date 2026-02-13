import crypto from "node:crypto";

interface ResetTokenData {
  pseudo: string;
  email: string;
  expiresAt: number;
}

const TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MS = 2 * 60 * 1000; // 2 minutes between requests per email

const tokens = new Map<string, ResetTokenData>();
const lastRequestByEmail = new Map<string, number>();

/** Remove expired tokens periodically */
function cleanup() {
  const now = Date.now();
  for (const [token, data] of tokens) {
    if (data.expiresAt <= now) tokens.delete(token);
  }
}

setInterval(cleanup, 10 * 60 * 1000); // every 10 min

/**
 * Check if a reset was recently requested for this email.
 * Returns true if rate-limited (too soon).
 */
export function isRateLimited(email: string): boolean {
  const last = lastRequestByEmail.get(email.toLowerCase());
  if (!last) return false;
  return Date.now() - last < RATE_LIMIT_MS;
}

/**
 * Generate a random token and store it with the player info.
 */
export function generateResetToken(pseudo: string, email: string): string {
  const token = crypto.randomBytes(32).toString("hex");
  tokens.set(token, {
    pseudo,
    email: email.toLowerCase(),
    expiresAt: Date.now() + TOKEN_TTL_MS,
  });
  lastRequestByEmail.set(email.toLowerCase(), Date.now());
  return token;
}

/**
 * Verify a token is valid (exists and not expired).
 * Does NOT consume it.
 */
export function verifyResetToken(
  token: string
): { pseudo: string; email: string } | null {
  const data = tokens.get(token);
  if (!data) return null;
  if (data.expiresAt <= Date.now()) {
    tokens.delete(token);
    return null;
  }
  return { pseudo: data.pseudo, email: data.email };
}

/**
 * Verify and consume a token (single use).
 */
export function consumeResetToken(
  token: string
): { pseudo: string; email: string } | null {
  const data = verifyResetToken(token);
  if (!data) return null;
  tokens.delete(token);
  return data;
}
