import { NextRequest, NextResponse } from "next/server";
import { consumeResetToken } from "@/data/reset-tokens";
import { updatePlayerPasswordByEmail } from "@/data/players";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON invalide" }, { status: 400 });
  }

  const { token, newPassword } = body;

  if (!token || typeof token !== "string") {
    return NextResponse.json(
      { error: "Token de réinitialisation manquant" },
      { status: 400 }
    );
  }

  if (!newPassword || typeof newPassword !== "string" || newPassword.length < 8) {
    return NextResponse.json(
      { error: "Mot de passe requis (8 caractères min)" },
      { status: 400 }
    );
  }
  if (!/[a-zA-Z]/.test(newPassword)) {
    return NextResponse.json(
      { error: "Le mot de passe doit contenir au moins une lettre" },
      { status: 400 }
    );
  }
  if (!/[0-9]/.test(newPassword)) {
    return NextResponse.json(
      { error: "Le mot de passe doit contenir au moins un chiffre" },
      { status: 400 }
    );
  }
  if (!/[^a-zA-Z0-9]/.test(newPassword)) {
    return NextResponse.json(
      { error: "Le mot de passe doit contenir au moins un caractère spécial" },
      { status: 400 }
    );
  }

  const email = await consumeResetToken(token);
  if (!email) {
    return NextResponse.json(
      { error: "Lien invalide ou expiré. Fais une nouvelle demande." },
      { status: 400 }
    );
  }

  try {
    const updated = await updatePlayerPasswordByEmail(email, newPassword);
    if (!updated) {
      return NextResponse.json(
        { error: "Impossible de mettre à jour le mot de passe" },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Reset password error:", err);
    return NextResponse.json(
      { error: "Erreur lors de la réinitialisation" },
      { status: 500 }
    );
  }
}
