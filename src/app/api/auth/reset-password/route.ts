import { NextRequest, NextResponse } from "next/server";
import { updatePlayerPassword } from "@/data/players";
import { consumeResetToken } from "@/lib/reset-tokens";

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

  if (!newPassword || typeof newPassword !== "string" || newPassword.length < 4) {
    return NextResponse.json(
      { error: "Nouveau mot de passe requis (4 caractères min)" },
      { status: 400 }
    );
  }

  const tokenData = consumeResetToken(token);
  if (!tokenData) {
    return NextResponse.json(
      { error: "Lien expiré ou déjà utilisé. Fais une nouvelle demande." },
      { status: 400 }
    );
  }

  try {
    const updated = await updatePlayerPassword(tokenData.pseudo, newPassword);
    if (!updated) {
      return NextResponse.json(
        { error: "Erreur lors de la mise à jour du mot de passe" },
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
