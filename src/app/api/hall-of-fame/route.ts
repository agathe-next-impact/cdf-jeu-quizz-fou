import { NextResponse } from "next/server";
import { getAllPlayersGlobalScores, getPerGameLeaderboards } from "@/data/players";
import { getBadgeForScore } from "@/data/badges";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [players, perGame] = await Promise.all([
      getAllPlayersGlobalScores(),
      getPerGameLeaderboards(5),
    ]);

    const global = players.slice(0, 10).map((p) => ({
      ...p,
      badge: getBadgeForScore(p.globalScore),
    }));

    return NextResponse.json({ global, perGame });
  } catch (err) {
    console.error("Hall of fame error:", err);
    return NextResponse.json(
      { error: "Erreur lors du chargement du classement" },
      { status: 500 }
    );
  }
}
