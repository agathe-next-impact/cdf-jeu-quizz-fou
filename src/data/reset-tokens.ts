import crypto from "node:crypto";
import { isWordPressConfigured } from "@/lib/wordpress";
import {
  wpCreateResetToken,
  wpConsumeResetToken,
  wpVerifyResetToken,
} from "@/lib/wordpress";

const TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

/* ------------------------------------------------------------------ */
/*  In-memory fallback (dev mode without WordPress)                    */
/* ------------------------------------------------------------------ */

interface ResetToken {
  email: string;
  expiresAt: number;
}

const memoryTokens = new Map<string, ResetToken>();

/* ------------------------------------------------------------------ */
/*  Public API                                                         */
/* ------------------------------------------------------------------ */

/** Generate a reset token for the given email (valid 1h). */
export async function createResetToken(email: string): Promise<string> {
  if (isWordPressConfigured()) {
    return wpCreateResetToken(email, TOKEN_TTL_MS);
  }

  // In-memory fallback
  for (const [key, value] of memoryTokens) {
    if (value.email === email) memoryTokens.delete(key);
  }
  const token = crypto.randomBytes(32).toString("hex");
  memoryTokens.set(token, { email, expiresAt: Date.now() + TOKEN_TTL_MS });
  cleanup();
  return token;
}

/** Verify a token without consuming it. Returns the email or null. */
export async function verifyResetToken(token: string): Promise<string | null> {
  if (isWordPressConfigured()) {
    return wpVerifyResetToken(token);
  }

  const entry = memoryTokens.get(token);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    memoryTokens.delete(token);
    return null;
  }
  return entry.email;
}

/** Verify and consume a token (one-time use). Returns the email or null. */
export async function consumeResetToken(token: string): Promise<string | null> {
  if (isWordPressConfigured()) {
    return wpConsumeResetToken(token);
  }

  const entry = memoryTokens.get(token);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    memoryTokens.delete(token);
    return null;
  }
  memoryTokens.delete(token);
  return entry.email;
}

function cleanup() {
  const now = Date.now();
  for (const [key, value] of memoryTokens) {
    if (now > value.expiresAt) memoryTokens.delete(key);
  }
}
