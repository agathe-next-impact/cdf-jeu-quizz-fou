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

  const { pseudo, email, password } = body;

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

  if (!password || typeof password !== "string" || password.length < 4) {
    return NextResponse.json(
      { error: "Mot de passe requis (4 caractères min)" },
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

    const player = await createPlayer(pseudo.trim(), email.trim(), password);
    return NextResponse.json(player, { status: 201 });
  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json(
      { error: "Erreur lors de l'inscription" },
      { status: 500 }
    );
  }
}
