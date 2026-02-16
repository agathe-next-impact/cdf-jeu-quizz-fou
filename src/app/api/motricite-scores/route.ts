import { NextRequest, NextResponse } from "next/server";
import { addMotriciteScore, getMotriciteScores } from "@/data/motricite-scores";
import type { MotricitePlayerAnswer } from "@/data/motricite-scores";
import { getMotriciteProfile } from "@/data/motricite-questions";
import { getAllRegisteredPseudos } from "@/data/players";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [scores, registeredPseudos] = await Promise.all([
      getMotriciteScores(),
      getAllRegisteredPseudos(),
    ]);
    const publicScores = scores
      .filter((s) => registeredPseudos.has(s.pseudo.toLowerCase()))
      .map(({ answers: _answers, ...rest }) => rest);
    return NextResponse.json(publicScores);
  } catch (err) {
    console.error("GET /api/motricite-scores error:", err);
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

  if (typeof score !== "number" || score < 0 || score > 100) {
    return NextResponse.json({ error: "Score invalide" }, { status: 400 });
  }

  const profile = getMotriciteProfile(score);

  let playerAnswers: MotricitePlayerAnswer[] = [];
  if (Array.isArray(answers)) {
    playerAnswers = answers
      .filter(
        (a: MotricitePlayerAnswer) =>
          typeof a.questionId === "number" &&
          typeof a.answerIndex === "number" &&
          typeof a.question === "string" &&
          typeof a.answerText === "string" &&
          typeof a.points === "number"
      )
      .map((a: MotricitePlayerAnswer) => ({
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
    await addMotriciteScore(entry);
  } catch (err) {
    console.error("POST /api/motricite-scores write error:", err);
    return NextResponse.json({ error: "Erreur sauvegarde" }, { status: 500 });
  }

  const { answers: _answers, ...publicEntry } = entry;
  return NextResponse.json(publicEntry, { status: 201 });
}
