import { NextRequest, NextResponse } from "next/server";
import { addEvaluationScore, getEvaluationScores } from "@/data/evaluation-scores";
import type { EvaluationPlayerAnswer } from "@/data/evaluation-scores";
import { evaluationQuestions, getEvaluationProfile } from "@/data/evaluation-questions";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const scores = await getEvaluationScores();
    const publicScores = scores.map(({ answers: _answers, ...rest }) => rest);
    return NextResponse.json(publicScores);
  } catch (err) {
    console.error("GET /api/evaluation-scores error:", err);
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

  const maxScore = evaluationQuestions.length * 30;
  const profile = getEvaluationProfile(score, maxScore);

  let playerAnswers: EvaluationPlayerAnswer[] = [];
  if (Array.isArray(answers)) {
    playerAnswers = answers
      .filter(
        (a: EvaluationPlayerAnswer) =>
          typeof a.questionId === "number" &&
          typeof a.answerIndex === "number" &&
          typeof a.question === "string" &&
          typeof a.answerText === "string" &&
          typeof a.points === "number"
      )
      .map((a: EvaluationPlayerAnswer) => ({
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
    await addEvaluationScore(entry);
  } catch (err) {
    console.error("POST /api/evaluation-scores write error:", err);
    return NextResponse.json({ error: "Erreur sauvegarde" }, { status: 500 });
  }

  const { answers: _answers, ...publicEntry } = entry;
  return NextResponse.json(publicEntry, { status: 201 });
}
