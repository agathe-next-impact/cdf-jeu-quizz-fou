import { NextRequest, NextResponse } from "next/server";
import { updatePlayerAvatar, AVATARS } from "@/data/players";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON invalide" }, { status: 400 });
  }

  const { pseudo, avatar } = body;

  if (!pseudo || typeof pseudo !== "string") {
    return NextResponse.json({ error: "Pseudo requis" }, { status: 400 });
  }
  if (!avatar || typeof avatar !== "string" || !(AVATARS as readonly string[]).includes(avatar)) {
    return NextResponse.json({ error: "Avatar invalide" }, { status: 400 });
  }

  try {
    const ok = await updatePlayerAvatar(pseudo.trim(), avatar);
    if (!ok) {
      return NextResponse.json({ error: "Joueur introuvable" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Avatar update error:", err);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour" },
      { status: 500 }
    );
  }
}
