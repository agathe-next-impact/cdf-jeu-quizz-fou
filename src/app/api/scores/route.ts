import { NextRequest, NextResponse } from "next/server";
import { addScore, getScores, getTitle } from "@/data/scores";
import { questions } from "@/data/questions";

export async function GET() {
  const scores = getScores();
  return NextResponse.json(scores);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { pseudo, score } = body;

  if (!pseudo || typeof pseudo !== "string" || pseudo.trim().length === 0) {
    return NextResponse.json({ error: "Pseudo requis" }, { status: 400 });
  }

  if (typeof score !== "number" || score < 0) {
    return NextResponse.json({ error: "Score invalide" }, { status: 400 });
  }

  const maxScore = questions.length * 30;
  const title = getTitle(score, maxScore);

  const entry = {
    pseudo: pseudo.trim().slice(0, 20),
    score,
    title,
    date: new Date().toISOString(),
  };

  addScore(entry);

  return NextResponse.json(entry, { status: 201 });
}
