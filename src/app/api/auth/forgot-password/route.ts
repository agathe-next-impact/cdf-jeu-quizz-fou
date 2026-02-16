import { NextRequest, NextResponse } from "next/server";
import { findPlayerByEmail } from "@/data/players";
import { createResetToken } from "@/data/reset-tokens";
import { sendEmail } from "@/lib/mail";

export const dynamic = "force-dynamic";

const APP_URL =
  process.env.APP_URL?.replace(/\/+$/, "") ?? "http://localhost:3000";

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON invalide" }, { status: 400 });
  }

  const { email } = body;

  if (!email || typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json({ error: "Email invalide" }, { status: 400 });
  }

  // Always respond with the same message to avoid revealing whether the email exists
  const genericResponse = {
    ok: true,
    message:
      "Si un compte existe avec cet email, un lien de réinitialisation a été envoyé.",
  };

  try {
    const player = await findPlayerByEmail(email.trim());
    if (!player) {
      return NextResponse.json(genericResponse);
    }

    const token = createResetToken(player.email);
    const resetLink = `${APP_URL}/reset-password?token=${token}`;

    if (process.env.SMTP_USER) {
      await sendEmail(
        player.email,
        "Réinitialisation de ton mot de passe — Le Quizz Fou",
        buildEmailHtml(player.pseudo, resetLink)
      );
    } else {
      // Dev mode: log the link to the console
      console.log(`\n[DEV] Password reset link for ${player.email}:\n${resetLink}\n`);
    }

    return NextResponse.json(genericResponse);
  } catch (err) {
    console.error("Forgot password error:", err);
    return NextResponse.json(genericResponse);
  }
}

function buildEmailHtml(pseudo: string, resetLink: string): string {
  return `
    <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px">
      <h2 style="margin-bottom:8px">Salut ${pseudo} !</h2>
      <p>Tu as demandé à réinitialiser ton mot de passe sur <strong>Le Quizz Fou</strong>.</p>
      <p>Clique sur le bouton ci-dessous pour choisir un nouveau mot de passe :</p>
      <p style="text-align:center;margin:32px 0">
        <a href="${resetLink}"
           style="background:#000;color:#fff;padding:14px 28px;border-radius:12px;text-decoration:none;font-weight:bold;display:inline-block">
          Réinitialiser mon mot de passe
        </a>
      </p>
      <p style="font-size:13px;color:#666">
        Ce lien est valable 1 heure. Si tu n'as pas fait cette demande, ignore cet email.
      </p>
    </div>
  `.trim();
}
