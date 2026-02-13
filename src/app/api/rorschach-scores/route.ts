import { NextRequest, NextResponse } from "next/server";
import { addRorschachScore, getRorschachScores } from "@/data/rorschach-scores";
import type { RorschachPlayerAnswer } from "@/data/rorschach-scores";
import { rorschachQuestions, getRorschachProfile } from "@/data/rorschach-questions";
import { findPlayerByPseudo } from "@/data/players";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { getRegisteredPseudos } = await import("@/data/players");
    const [scores, registered] = await Promise.all([getRorschachScores(), getRegisteredPseudos()]);
    const publicScores = scores
      .filter((s) => registered.has(s.pseudo.toLowerCase()))
      .map(({ answers: _answers, ...rest }) => rest);
    return NextResponse.json(publicScores);
  } catch (err) {
    console.error("GET /api/rorschach-scores error:", err);
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

  const player = await findPlayerByPseudo(pseudo.trim());
  if (!player) {
    return NextResponse.json({ error: "Inscription requise pour enregistrer un score" }, { status: 403 });
  }

  const maxScore = rorschachQuestions.length * 30;
  const profile = getRorschachProfile(score, maxScore);

  let playerAnswers: RorschachPlayerAnswer[] = [];
  if (Array.isArray(answers)) {
    playerAnswers = answers
      .filter(
        (a: RorschachPlayerAnswer) =>
          typeof a.questionId === "number" &&
          typeof a.answerIndex === "number" &&
          typeof a.question === "string" &&
          typeof a.answerText === "string" &&
          typeof a.points === "number"
      )
      .map((a: RorschachPlayerAnswer) => ({
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
    await addRorschachScore(entry);
  } catch (err) {
    console.error("POST /api/rorschach-scores write error:", err);
    return NextResponse.json({ error: "Erreur sauvegarde" }, { status: 500 });
  }

  const { answers: _answers, ...publicEntry } = entry;
  return NextResponse.json(publicEntry, { status: 201 });
}
