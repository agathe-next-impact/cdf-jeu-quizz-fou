import crypto from "node:crypto";

interface ResetToken {
  email: string;
  expiresAt: number;
}

const TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour
const tokens = new Map<string, ResetToken>();

/** Generate a reset token for the given email (valid 1h). */
export function createResetToken(email: string): string {
  // Invalidate any existing token for this email
  for (const [key, value] of tokens) {
    if (value.email === email) tokens.delete(key);
  }

  const token = crypto.randomBytes(32).toString("hex");
  tokens.set(token, { email, expiresAt: Date.now() + TOKEN_TTL_MS });

  // Lazy cleanup of expired tokens
  cleanup();

  return token;
}

/** Verify a token without consuming it. Returns the email or null. */
export function verifyResetToken(token: string): string | null {
  const entry = tokens.get(token);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    tokens.delete(token);
    return null;
  }
  return entry.email;
}

/** Verify and consume a token (one-time use). Returns the email or null. */
export function consumeResetToken(token: string): string | null {
  const email = verifyResetToken(token);
  if (email) tokens.delete(token);
  return email;
}

function cleanup() {
  const now = Date.now();
  for (const [key, value] of tokens) {
    if (now > value.expiresAt) tokens.delete(key);
  }
}
