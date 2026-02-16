import { NextRequest, NextResponse } from "next/server";
import {
  findPlayerByPseudo,
  findPlayerByEmail,
  verifyPassword,
  toPublicPlayer,
} from "@/data/players";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON invalide" }, { status: 400 });
  }

  const { pseudo, password } = body;

  if (!pseudo || typeof pseudo !== "string") {
    return NextResponse.json({ error: "Pseudo ou email requis" }, { status: 400 });
  }
  if (!password || typeof password !== "string") {
    return NextResponse.json({ error: "Mot de passe requis" }, { status: 400 });
  }

  try {
    const identifier = pseudo.trim();
    const isEmail = identifier.includes("@");
    const player = isEmail
      ? await findPlayerByEmail(identifier)
      : await findPlayerByPseudo(identifier);

    if (!player) {
      return NextResponse.json(
        { error: "Identifiant ou mot de passe incorrect" },
        { status: 401 }
      );
    }

    if (!verifyPassword(password, player.passwordHash)) {
      return NextResponse.json(
        { error: "Identifiant ou mot de passe incorrect" },
        { status: 401 }
      );
    }

    return NextResponse.json(toPublicPlayer(player));
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json(
      { error: "Erreur lors de la connexion" },
      { status: 500 }
    );
  }
}
