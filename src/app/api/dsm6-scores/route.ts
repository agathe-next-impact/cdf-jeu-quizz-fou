import { NextRequest, NextResponse } from "next/server";
import { addDSM6Score, getDSM6Scores } from "@/data/dsm6-scores";
import type { DSM6PlayerAnswer } from "@/data/dsm6-scores";
import { dsm6Questions, getDSM6Profile } from "@/data/dsm6-questions";
import { getAllRegisteredPseudos } from "@/data/players";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [scores, registeredPseudos] = await Promise.all([
      getDSM6Scores(),
      getAllRegisteredPseudos(),
    ]);
    const filtered = scores
      .filter((s) => registeredPseudos.has(s.pseudo.toLowerCase()))
      .map(({ answers: _answers, ...rest }) => rest);

    // Keep only the best score per player
    const bestByPlayer = new Map<string, (typeof filtered)[number]>();
    for (const entry of filtered) {
      const key = entry.pseudo.toLowerCase();
      const prev = bestByPlayer.get(key);
      if (!prev || entry.score > prev.score) {
        bestByPlayer.set(key, entry);
      }
    }

    return NextResponse.json(
      [...bestByPlayer.values()].sort((a, b) => b.score - a.score)
    );
  } catch (err) {
    console.error("GET /api/dsm6-scores error:", err);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON invalide" }, { status: 400 });
  }

  const { pseudo, score, answers } = body;

  if (!pseudo || typeof pseudo !== "string" || pseudo.trim().length === 0) {
    return NextResponse.json({ error: "Pseudo requis" }, { status: 400 });
  }

  if (typeof score !== "number" || score < 0) {
    return NextResponse.json({ error: "Score invalide" }, { status: 400 });
  }

  const maxScore = dsm6Questions.length * 30;
  const profile = getDSM6Profile(score, maxScore);

  let playerAnswers: DSM6PlayerAnswer[] = [];
  if (Array.isArray(answers)) {
    playerAnswers = answers
      .filter(
        (a: DSM6PlayerAnswer) =>
          typeof a.questionId === "number" &&
          typeof a.answerIndex === "number" &&
          typeof a.question === "string" &&
          typeof a.answerText === "string" &&
          typeof a.points === "number"
      )
      .map((a: DSM6PlayerAnswer) => ({
        questionId: a.questionId,
        question: a.question.slice(0, 300),
        answerIndex: a.answerIndex,
        answerText: a.answerText.slice(0, 300),
        points: a.points,
      }));
  }

  const entry = {
    pseudo: pseudo.trim().slice(0, 20),
    score,
    title: profile.title,
    date: new Date().toISOString(),
    answers: playerAnswers,
  };

  try {
    await addDSM6Score(entry);
  } catch (err) {
    console.error("POST /api/dsm6-scores write error:", err);
    return NextResponse.json({ error: "Erreur sauvegarde" }, { status: 500 });
  }

  const { answers: _answers, ...publicEntry } = entry;
  return NextResponse.json(publicEntry, { status: 201 });
}
