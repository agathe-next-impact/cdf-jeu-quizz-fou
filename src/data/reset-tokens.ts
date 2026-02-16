import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

interface ResetToken {
  email: string;
  expiresAt: number;
}

const TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour
const TOKENS_FILE = path.join(process.cwd(), "data", "reset-tokens.json");

/* ------------------------------------------------------------------ */
/*  File-based persistence (survives server restarts & HMR)            */
/* ------------------------------------------------------------------ */

function loadTokens(): Map<string, ResetToken> {
  try {
    const raw = fs.readFileSync(TOKENS_FILE, "utf-8");
    const entries: [string, ResetToken][] = JSON.parse(raw);
    return new Map(entries);
  } catch {
    return new Map();
  }
}

function saveTokens(tokens: Map<string, ResetToken>): void {
  const dir = path.dirname(TOKENS_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(TOKENS_FILE, JSON.stringify([...tokens.entries()]), "utf-8");
}

/* ------------------------------------------------------------------ */
/*  Public API                                                         */
/* ------------------------------------------------------------------ */

/** Generate a reset token for the given email (valid 1h). */
export function createResetToken(email: string): string {
  const tokens = loadTokens();

  // Invalidate any existing token for this email
  for (const [key, value] of tokens) {
    if (value.email === email) tokens.delete(key);
  }

  const token = crypto.randomBytes(32).toString("hex");
  tokens.set(token, { email, expiresAt: Date.now() + TOKEN_TTL_MS });

  cleanup(tokens);
  saveTokens(tokens);

  return token;
}

/** Verify a token without consuming it. Returns the email or null. */
export function verifyResetToken(token: string): string | null {
  const tokens = loadTokens();
  const entry = tokens.get(token);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    tokens.delete(token);
    saveTokens(tokens);
    return null;
  }
  return entry.email;
}

/** Verify and consume a token (one-time use). Returns the email or null. */
export function consumeResetToken(token: string): string | null {
  const tokens = loadTokens();
  const entry = tokens.get(token);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    tokens.delete(token);
    saveTokens(tokens);
    return null;
  }
  tokens.delete(token);
  saveTokens(tokens);
  return entry.email;
}

function cleanup(tokens: Map<string, ResetToken>) {
  const now = Date.now();
  for (const [key, value] of tokens) {
    if (now > value.expiresAt) tokens.delete(key);
  }
}
