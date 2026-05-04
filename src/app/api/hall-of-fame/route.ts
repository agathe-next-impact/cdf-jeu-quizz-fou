import { NextResponse } from "next/server";
import { getHallOfFameData } from "@/data/players";
import { getBadgeForScore } from "@/data/badges";

// Cached via the underlying fetches' tags (scores:<restBase>, players).
// POSTs to /api/<game>-scores call revalidateTag to invalidate.
export const revalidate = 60;

export async function GET() {
  try {
    const { global: players, perGame } = await getHallOfFameData(5);

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
