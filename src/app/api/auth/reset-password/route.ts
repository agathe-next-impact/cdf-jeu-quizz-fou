import { NextRequest, NextResponse } from "next/server";
import { updatePlayerPassword } from "@/data/players";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON invalide" }, { status: 400 });
  }

  const { pseudo, email, newPassword } = body;

  if (!pseudo || typeof pseudo !== "string" || pseudo.trim().length < 2) {
    return NextResponse.json({ error: "Pseudo requis" }, { status: 400 });
  }

  if (!email || typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json({ error: "Email invalide" }, { status: 400 });
  }

  if (!newPassword || typeof newPassword !== "string" || newPassword.length < 4) {
    return NextResponse.json(
      { error: "Nouveau mot de passe requis (4 caractères min)" },
      { status: 400 }
    );
  }

  try {
    const updated = await updatePlayerPassword(pseudo.trim(), email.trim(), newPassword);
    if (!updated) {
      return NextResponse.json(
        { error: "Pseudo et email ne correspondent à aucun compte" },
        { status: 404 }
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
