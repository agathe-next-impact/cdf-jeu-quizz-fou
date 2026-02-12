import { NextRequest, NextResponse } from "next/server";
import { findPlayerByPseudo, toPublicPlayer, getPlayerStats } from "@/data/players";
import { getBadgeForScore, getNextBadge } from "@/data/badges";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const pseudo = request.nextUrl.searchParams.get("pseudo");

  if (!pseudo) {
    return NextResponse.json({ error: "Pseudo requis" }, { status: 400 });
  }

  try {
    const player = await findPlayerByPseudo(pseudo);
    if (!player) {
      return NextResponse.json({ error: "Joueur introuvable" }, { status: 404 });
    }

    const games = await getPlayerStats(pseudo);
    const globalScore = games.reduce((sum, g) => sum + g.bestScore, 0);
    const badge = getBadgeForScore(globalScore);
    const nextBadge = getNextBadge(globalScore);

    return NextResponse.json({
      player: toPublicPlayer(player),
      games,
      globalScore,
      badge,
      nextBadge,
    });
  } catch (err) {
    console.error("Profile error:", err);
    return NextResponse.json(
      { error: "Erreur lors du chargement du profil" },
      { status: 500 }
    );
  }
}
