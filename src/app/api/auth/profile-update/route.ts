import { NextRequest, NextResponse } from "next/server";
import { updatePlayerProfile } from "@/data/players";

export const dynamic = "force-dynamic";

const BIO_MAX_LENGTH = 160;

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON invalide" }, { status: 400 });
  }

  const { pseudo, madnessSince, bio } = body;

  if (!pseudo || typeof pseudo !== "string") {
    return NextResponse.json({ error: "Pseudo requis" }, { status: 400 });
  }

  const fields: { madnessSince?: string; bio?: string } = {};

  if (madnessSince !== undefined) {
    if (typeof madnessSince !== "string") {
      return NextResponse.json({ error: "Date invalide" }, { status: 400 });
    }
    if (madnessSince && !/^\d{4}-\d{2}-\d{2}$/.test(madnessSince)) {
      return NextResponse.json({ error: "Format de date invalide (YYYY-MM-DD)" }, { status: 400 });
    }
    fields.madnessSince = madnessSince;
  }

  if (bio !== undefined) {
    if (typeof bio !== "string") {
      return NextResponse.json({ error: "Bio invalide" }, { status: 400 });
    }
    if (bio.length > BIO_MAX_LENGTH) {
      return NextResponse.json(
        { error: `Bio trop longue (max ${BIO_MAX_LENGTH} caractères)` },
        { status: 400 }
      );
    }
    fields.bio = bio;
  }

  if (Object.keys(fields).length === 0) {
    return NextResponse.json({ error: "Aucun champ à mettre à jour" }, { status: 400 });
  }

  try {
    const ok = await updatePlayerProfile(pseudo.trim(), fields);
    if (!ok) {
      return NextResponse.json({ error: "Joueur introuvable" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Profile update error:", err);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour" },
      { status: 500 }
    );
  }
}
