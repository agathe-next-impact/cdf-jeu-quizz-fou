import { NextRequest, NextResponse } from "next/server";
import { addEvasionScore, getEvasionScores } from "@/data/evasion-scores";
import type { EvasionPlayerAnswer } from "@/data/evasion-scores";
import { getEvasionOutcome } from "@/data/evasion-questions";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const scores = await getEvasionScores();
    const publicScores = scores.map(({ answers: _answers, ...rest }) => rest);
    return NextResponse.json(publicScores);
  } catch (err) {
    console.error("GET /api/evasion-scores error:", err);
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

  const outcome = getEvasionOutcome(score);

  let playerAnswers: EvasionPlayerAnswer[] = [];
  if (Array.isArray(answers)) {
    playerAnswers = answers
      .filter(
        (a: EvasionPlayerAnswer) =>
          typeof a.questionId === "number" &&
          typeof a.answerIndex === "number" &&
          typeof a.question === "string" &&
          typeof a.answerText === "string" &&
          typeof a.points === "number"
      )
      .map((a: EvasionPlayerAnswer) => ({
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
    title: outcome.title,
    date: new Date().toISOString(),
    answers: playerAnswers,
  };

  try {
    await addEvasionScore(entry);
  } catch (err) {
    console.error("POST /api/evasion-scores write error:", err);
    return NextResponse.json({ error: "Erreur sauvegarde" }, { status: 500 });
  }

  const { answers: _answers, ...publicEntry } = entry;
  return NextResponse.json(publicEntry, { status: 201 });
}
