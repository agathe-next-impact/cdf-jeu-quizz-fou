"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Confetti from "@/components/Confetti";
import { questions } from "@/data/questions";

interface ScoreResult {
  pseudo: string;
  score: number;
  title: string;
  date: string;
}

function getTitleEmoji(title: string): string {
  if (title.includes("Complètement")) return "🤪";
  if (title.includes("Barré")) return "🔥";
  if (title.includes("Allumé")) return "💡";
  if (title.includes("Fêlé")) return "😜";
  if (title.includes("Toqué")) return "🤔";
  if (title.includes("Presque")) return "😇";
  return "😴";
}

export default function ResultsPage() {
  const router = useRouter();
  const [result, setResult] = useState<ScoreResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const hasSaved = useRef(false);

  useEffect(() => {
    if (hasSaved.current) return;

    const pseudo = sessionStorage.getItem("pseudo");
    const scoreStr = sessionStorage.getItem("score");

    if (!pseudo || !scoreStr) {
      router.push("/");
      return;
    }

    hasSaved.current = true;

    const score = parseInt(scoreStr, 10);
    const answersRaw = sessionStorage.getItem("answers");
    let answers = [];
    try {
      answers = answersRaw ? JSON.parse(answersRaw) : [];
    } catch { /* ignore */ }

    fetch("/api/scores", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pseudo, score, answers }),
    })
      .then((res) => res.json())
      .then((data: ScoreResult) => {
        setResult(data);
        setLoading(false);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 4000);
      })
      .catch(() => {
        const maxScore = questions.length * 30;
        const percentage = (score / maxScore) * 100;
        let title = "Trop Sage !";
        if (percentage >= 90) title = "Complètement Fou / Folle !";
        else if (percentage >= 75) title = "Sacrément Barré(e) !";
        else if (percentage >= 60) title = "Bien Allumé(e) !";
        else if (percentage >= 45) title = "Un Peu Fêlé(e)";
        else if (percentage >= 30) title = "Légèrement Toqué(e)";
        else if (percentage >= 15) title = "Presque Sage";

        setResult({ pseudo, score, title, date: new Date().toISOString() });
        setLoading(false);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 4000);
      });
  }, [router]);

  if (loading || !result) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
        <div className="text-xl text-purple animate-pulse">
          Calcul de ton niveau de folie...
        </div>
      </div>
    );
  }

  const maxScore = questions.length * 30;
  const percentage = Math.round((result.score / maxScore) * 100);
  const emoji = getTitleEmoji(result.title);

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-4 py-12">
      {showConfetti && <Confetti />}

      <div className="max-w-lg w-full text-center animate-slide-up">
        {/* Big emoji */}
        <div className="text-8xl mb-6 animate-bounce-in">{emoji}</div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-black gradient-text mb-2 leading-tight">
          {result.title}
        </h1>

        {/* Pseudo */}
        <p className="text-lg text-purple-dark/60 font-medium mb-8">
          Bravo {result.pseudo} !
        </p>

        {/* Score card */}
        <div className="card mb-8">
          <div className="mb-6">
            <div className="text-6xl font-black text-purple mb-1">
              {result.score}
            </div>
            <div className="text-sm text-purple/50 font-medium">
              points sur {maxScore}
            </div>
          </div>

          {/* Score bar */}
          <div className="w-full bg-purple/10 rounded-full h-4 overflow-hidden mb-4">
            <div
              className="h-full rounded-full transition-all duration-1000 ease-out"
              style={{
                width: `${percentage}%`,
                background: "linear-gradient(90deg, #7B2D8E, #FF6B9D, #FFD23F)",
              }}
            />
          </div>
          <div className="text-sm font-bold text-purple">{percentage}% de folie</div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => {
              sessionStorage.removeItem("score");
              router.push("/quiz");
            }}
            className="btn-primary"
          >
            Rejouer
          </button>
          <Link href="/classement" className="btn-secondary text-center">
            Voir le classement
          </Link>
        </div>

        {/* Share hint */}
        <p className="mt-8 text-sm text-purple/40">
          Partage ton résultat et défie tes amis !
        </p>
      </div>
    </div>
  );
}
