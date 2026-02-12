"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Confetti from "@/components/Confetti";
import RegisterInvite from "@/components/RegisterInvite";
import GameIcon from "@/components/GameIcon";
import { getEvasionOutcome } from "@/data/evasion-questions";

interface ScoreResult {
  pseudo: string;
  score: number;
  title: string;
  date: string;
}

export default function EvasionResultsPage() {
  const router = useRouter();
  const [result, setResult] = useState<ScoreResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const hasSaved = useRef(false);

  useEffect(() => {
    if (hasSaved.current) return;

    const pseudo = sessionStorage.getItem("evasion-pseudo");
    const scoreStr = sessionStorage.getItem("evasion-score");

    if (!pseudo || !scoreStr) {
      router.push("/evasion");
      return;
    }

    hasSaved.current = true;

    const score = parseInt(scoreStr, 10);
    const answersRaw = sessionStorage.getItem("evasion-answers");
    let answers: unknown[] = [];
    try {
      answers = answersRaw ? JSON.parse(answersRaw) : [];
    } catch {
      /* ignore */
    }

    async function saveScore() {
      for (const payload of [
        { pseudo, score, answers },
        { pseudo, score, answers: [] },
      ]) {
        try {
          const res = await fetch("/api/evasion-scores", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          if (res.ok) {
            const data: ScoreResult = await res.json();
            setResult(data);
            setLoading(false);
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 4000);
            return;
          }
        } catch {
          /* retry with next payload */
        }
      }

      // Fallback local
      const outcome = getEvasionOutcome(score);
      setResult({
        pseudo: pseudo!,
        score,
        title: outcome.title,
        date: new Date().toISOString(),
      });
      setLoading(false);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
    }

    saveScore();
  }, [router]);

  if (loading || !result) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
        <div className="text-xl text-blue animate-pulse">
          Le Dr. Moreau rédige son rapport...
        </div>
      </div>
    );
  }

  const outcome = getEvasionOutcome(result.score);

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-4 py-12">
      {showConfetti && <Confetti />}

      <div className="max-w-lg w-full text-center animate-slide-up">
        {/* Emoji */}
        <div className="mb-6 animate-bounce-in flex justify-center"><GameIcon name={outcome.emoji} size={80} /></div>

        {/* Title */}
        <div className="inline-block text-blue text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
          Verdict du Dr. Moreau
        </div>
        <h1
          className="text-3xl md:text-4xl font-black mb-1 leading-tight text-blue"
        >
          {outcome.title}
        </h1>
        <p className="text-sm font-semibold text-blue mb-2">
          {outcome.subtitle}
        </p>

        {/* Pseudo */}
        <p className="text-lg text-black font-medium mb-6">
          Patient : {result.pseudo}
        </p>

        {/* Days card */}
        <div className="card mb-6">
          <div className="mb-4">
            <div
              className={`text-6xl font-black mb-1 ${
                result.score <= 10
                  ? "text-blue"
                  : result.score <= 30
                    ? "text-blue"
                    : result.score <= 50
                      ? "text-yellow"
                      : "text-red"
              }`}
            >
              {result.score}
            </div>
            <div className="text-sm text-blue font-medium">
              jours avant la sortie
            </div>
          </div>

          {/* Visual bar */}
          <div className="w-full rounded-full h-4 overflow-hidden mb-4">
            <div
              className={`h-full rounded-full transition-all duration-1000 ease-out ${
                result.score <= 10
                  ? "bg-blue"
                  : result.score <= 30
                    ? "bg-blue"
                    : result.score <= 50
                      ? "bg-yellow"
                      : "bg-red"
              }`}
              style={{
                width: `${Math.min(100, (result.score / 80) * 100)}%`,
              }}
            />
          </div>
        </div>

        {/* Description */}
        <div className="card mb-6 border border-blue">
          <p className="text-sm text-black leading-relaxed italic">
            &laquo; {outcome.description} &raquo;
          </p>
        </div>

        {/* Register invite */}
        <RegisterInvite />

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => {
              sessionStorage.removeItem("evasion-score");
              sessionStorage.removeItem("evasion-answers");
              router.push("/evasion/quiz");
            }}
            className="font-bold text-white py-3 px-6 rounded-full transition-all hover:scale-105 bg-blue"
          >
            Nouvelle évaluation
          </button>
          <Link
            href="/evasion/classement"
            className="btn-secondary text-center"
          >
            Classement des patients
          </Link>
        </div>

        <p className="mt-8 text-xs text-blue italic">
          Le Dr. Moreau vous souhaite un prompt rétablissement. Ou pas.
        </p>
      </div>
    </div>
  );
}
