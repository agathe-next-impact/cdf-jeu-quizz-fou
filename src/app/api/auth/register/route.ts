import { NextRequest, NextResponse } from "next/server";
import {
  findPlayerByPseudo,
  findPlayerByEmail,
  createPlayer,
} from "@/data/players";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON invalide" }, { status: 400 });
  }

  const { pseudo, email, password, avatar } = body;

  if (!pseudo || typeof pseudo !== "string" || pseudo.trim().length < 2) {
    return NextResponse.json(
      { error: "Pseudo requis (2 caractères min)" },
      { status: 400 }
    );
  }
  if (pseudo.trim().length > 20) {
    return NextResponse.json(
      { error: "Pseudo trop long (20 caractères max)" },
      { status: 400 }
    );
  }

  if (!email || typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json(
      { error: "Email invalide" },
      { status: 400 }
    );
  }

  if (!password || typeof password !== "string" || password.length < 8) {
    return NextResponse.json(
      { error: "Mot de passe requis (8 caractères min)" },
      { status: 400 }
    );
  }
  if (!/[a-zA-Z]/.test(password)) {
    return NextResponse.json(
      { error: "Le mot de passe doit contenir au moins une lettre" },
      { status: 400 }
    );
  }
  if (!/[0-9]/.test(password)) {
    return NextResponse.json(
      { error: "Le mot de passe doit contenir au moins un chiffre" },
      { status: 400 }
    );
  }
  if (!/[^a-zA-Z0-9]/.test(password)) {
    return NextResponse.json(
      { error: "Le mot de passe doit contenir au moins un caractère spécial" },
      { status: 400 }
    );
  }

  try {
    const existingPseudo = await findPlayerByPseudo(pseudo.trim());
    if (existingPseudo) {
      return NextResponse.json(
        { error: "Ce pseudo est déjà pris" },
        { status: 409 }
      );
    }

    const existingEmail = await findPlayerByEmail(email.trim());
    if (existingEmail) {
      return NextResponse.json(
        { error: "Cet email est déjà utilisé" },
        { status: 409 }
      );
    }

    const playerAvatar = typeof avatar === "string" && avatar ? avatar : "laugh";
    const player = await createPlayer(pseudo.trim(), email.trim(), password, playerAvatar);
    return NextResponse.json(player, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Register error:", message);
    return NextResponse.json(
      { error: "Erreur lors de l'inscription", detail: message },
      { status: 500 }
    );
  }
}
