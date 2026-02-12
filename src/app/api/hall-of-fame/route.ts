import { NextResponse } from "next/server";
import { getAllPlayersGlobalScores } from "@/data/players";
import { getBadgeForScore } from "@/data/badges";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const players = await getAllPlayersGlobalScores();

    const leaderboard = players.slice(0, 10).map((p) => ({
      ...p,
      badge: getBadgeForScore(p.globalScore),
    }));

    return NextResponse.json(leaderboard);
  } catch (err) {
    console.error("Hall of fame error:", err);
    return NextResponse.json(
      { error: "Erreur lors du chargement du classement" },
      { status: 500 }
    );
  }
}
