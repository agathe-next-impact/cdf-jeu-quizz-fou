import { NextRequest, NextResponse } from "next/server";
import { findPlayerByPseudo, toPublicPlayer, getPlayerStats, computeNormalizedGlobalScore, type PublicPlayer } from "@/data/players";
import { getBadgeForScore, getNextBadge } from "@/data/badges";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const pseudo = request.nextUrl.searchParams.get("pseudo");

  if (!pseudo) {
    return NextResponse.json({ error: "Pseudo requis" }, { status: 400 });
  }

  try {
    const player = await findPlayerByPseudo(pseudo);

    // Always fetch game stats, even if player record isn't found in WP
    // (scores are stored separately from the player account)
    const games = await getPlayerStats(pseudo);
    const globalScore = computeNormalizedGlobalScore(games);
    const badge = getBadgeForScore(globalScore);
    const nextBadge = getNextBadge(globalScore);

    const publicPlayer: PublicPlayer = player
      ? toPublicPlayer(player)
      : {
          id: "",
          pseudo,
          email: "",
          avatar: "laugh",
          createdAt: new Date().toISOString(),
          madnessSince: "",
          bio: "",
          autodiagnostic: "",
        };

    return NextResponse.json({
      player: publicPlayer,
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
