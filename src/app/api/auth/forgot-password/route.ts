import { NextRequest, NextResponse } from "next/server";
import { findPlayerByEmail } from "@/data/players";
import { createResetToken } from "@/data/reset-tokens";
import { sendEmail } from "@/lib/mail";

export const dynamic = "force-dynamic";

const APP_URL =
  process.env.APP_URL?.replace(/\/+$/, "") ?? "http://localhost:3000";

/* ── Brand tokens (matching globals.css) ──────────────────────── */
const BRAND = {
  red: "#D93025",
  yellow: "#CCA000",
  blue: "#3366E6",
  black: "#000000",
  white: "#ffffff",
  grey: "#888888",
  greyLight: "#e5e5e5",
  cardBg: "#ffffff",
  font: "'Open Sans', system-ui, sans-serif",
  fontHeading: "'Belanosima', sans-serif",
};

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

    const token = await createResetToken(player.email);
    const resetLink = `${APP_URL}/reset-password?token=${token}`;

    if (process.env.SMTP_USER) {
      await sendEmail(
        player.email,
        "Réinitialisation de ton mot de passe — Comme des Fous",
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
  const logoUrl = `${APP_URL}/logo-cdf.png`;

  return `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /></head>
<body style="margin:0;padding:0;background:${BRAND.black};font-family:${BRAND.font}">

<!-- Outer wrapper -->
<table width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.black};padding:32px 16px">
<tr><td align="center">
<table width="520" cellpadding="0" cellspacing="0" style="max-width:520px;width:100%">

  <!-- ─── Header ─────────────────────────────────────────── -->
  <tr><td style="padding:24px 24px 20px;text-align:center">
    <img src="${logoUrl}" alt="Comme des Fous" width="84" height="84"
         style="display:block;margin:0 auto 12px" />
    <div style="font-family:${BRAND.fontHeading};font-size:26px;font-weight:700;color:${BRAND.white};text-transform:uppercase;letter-spacing:1px">
      Comme des Fous
    </div>
    <div style="font-size:13px;color:${BRAND.grey};margin-top:4px">
      Centre expert en auto-diagnostic de folie furieuse
    </div>
  </td></tr>

  <!-- ─── Card body ──────────────────────────────────────── -->
  <tr><td style="padding:0">
    <!-- Yellow top-left corner bracket -->
    <table width="100%" cellpadding="0" cellspacing="0"><tr>
      <td width="20" height="2" style="background:${BRAND.yellow}"></td>
      <td></td>
    </tr></table>
    <table width="100%" cellpadding="0" cellspacing="0"><tr>
      <td width="2" height="18" style="background:${BRAND.yellow}" valign="top"></td>
      <td></td>
    </tr></table>

    <table width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.cardBg};border-left:1px solid ${BRAND.greyLight};border-right:1px solid ${BRAND.greyLight}">
    <tr><td style="padding:32px 32px 28px">

      <div style="font-family:${BRAND.fontHeading};font-size:22px;font-weight:600;color:${BRAND.black};margin:0 0 16px">
        Salut ${pseudo} !
      </div>

      <p style="font-size:15px;color:#333;line-height:1.6;margin:0 0 12px">
        Tu as demandé à réinitialiser ton mot de passe sur <strong>Comme des Fous</strong>.
      </p>
      <p style="font-size:15px;color:#333;line-height:1.6;margin:0 0 28px">
        Clique sur le bouton ci-dessous pour choisir un nouveau mot de passe&nbsp;:
      </p>

      <!-- CTA Button (btn-primary style) -->
      <table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:0 0 28px">
        <a href="${resetLink}"
           style="background:${BRAND.red};color:${BRAND.white};padding:14px 32px;text-decoration:none;font-weight:700;font-size:15px;text-transform:uppercase;letter-spacing:1px;display:inline-block;font-family:${BRAND.font}">
          Réinitialiser mon mot de passe
        </a>
      </td></tr></table>

      <p style="font-size:13px;color:${BRAND.grey};line-height:1.5;margin:0 0 4px">
        Ce lien est valable <strong style="color:#555">1 heure</strong>.
      </p>
      <p style="font-size:13px;color:${BRAND.grey};line-height:1.5;margin:0">
        Si tu n'as pas fait cette demande, ignore simplement cet email.
      </p>

    </td></tr></table>

    <!-- Red bottom-right corner bracket -->
    <table width="100%" cellpadding="0" cellspacing="0"><tr>
      <td></td>
      <td width="2" height="18" style="background:${BRAND.red}" valign="bottom"></td>
    </tr></table>
    <table width="100%" cellpadding="0" cellspacing="0"><tr>
      <td></td>
      <td width="20" height="2" style="background:${BRAND.red}"></td>
    </tr></table>
  </td></tr>

  <!-- ─── Footer ─────────────────────────────────────────── -->
  <tr><td style="padding:24px;text-align:center">
    <p style="font-size:12px;color:#666;margin:0">
      &copy; Comme des Fous &mdash; commedesfous.fr
    </p>
  </td></tr>

</table>
</td></tr></table>

</body>
</html>
  `.trim();
}
