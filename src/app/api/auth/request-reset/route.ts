import { NextRequest, NextResponse } from "next/server";
import { findPlayerByEmail } from "@/data/players";
import { generateResetToken, isRateLimited } from "@/lib/reset-tokens";
import { sendResetEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON invalide" }, { status: 400 });
  }

  const { email } = body;

  if (!email || typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json(
      { error: "Adresse email invalide" },
      { status: 400 }
    );
  }

  const normalizedEmail = email.toLowerCase().trim();

  // Always return success to not reveal if email exists
  const okResponse = NextResponse.json({ ok: true });

  if (isRateLimited(normalizedEmail)) {
    return okResponse;
  }

  try {
    const player = await findPlayerByEmail(normalizedEmail);
    if (!player) {
      return okResponse;
    }

    const token = generateResetToken(player.pseudo, player.email);
    const resetUrl = `${APP_URL}/connexion?reset_token=${token}`;

    await sendResetEmail(player.email, player.pseudo, resetUrl);
  } catch (err) {
    console.error("Request reset error:", err);
    // Still return ok to not leak info
  }

  return okResponse;
}
