"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Confetti from "@/components/Confetti";
import { dsm6Questions, getDSM6Profile } from "@/data/dsm6-questions";

interface ScoreResult {
  pseudo: string;
  score: number;
  title: string;
  date: string;
}

export default function DSM6ResultsPage() {
  const router = useRouter();
  const [result, setResult] = useState<ScoreResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const hasSaved = useRef(false);

  const maxScore = dsm6Questions.length * 30;

  useEffect(() => {
    if (hasSaved.current) return;

    const pseudo = sessionStorage.getItem("dsm6-pseudo");
    const scoreStr = sessionStorage.getItem("dsm6-score");

    if (!pseudo || !scoreStr) {
      router.push("/dsm6");
      return;
    }

    hasSaved.current = true;

    const score = parseInt(scoreStr, 10);
    const answersRaw = sessionStorage.getItem("dsm6-answers");
    let answers: unknown[] = [];
    try {
      answers = answersRaw ? JSON.parse(answersRaw) : [];
    } catch { /* ignore */ }

    async function saveScore() {
      for (const payload of [
        { pseudo, score, answers },
        { pseudo, score, answers: [] },
      ]) {
        try {
          const res = await fetch("/api/dsm6-scores", {
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
      const profile = getDSM6Profile(score, maxScore);
      setResult({ pseudo: pseudo!, score, title: profile.title, date: new Date().toISOString() });
      setLoading(false);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
    }

    saveScore();
  }, [router, maxScore]);

  if (loading || !result) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
        <div className="text-xl text-purple animate-pulse">
          Analyse du dossier en cours...
        </div>
      </div>
    );
  }

  const percentage = Math.round((result.score / maxScore) * 100);
  const profile = getDSM6Profile(result.score, maxScore);

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-4 py-12">
      {showConfetti && <Confetti />}

      <div className="max-w-lg w-full text-center animate-slide-up">
        {/* Emoji */}
        <div className="text-8xl mb-6 animate-bounce-in">{profile.emoji}</div>

        {/* Title */}
        <div className="inline-block bg-red-100 text-red-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
          Diagnostic DSM-6
        </div>
        <h1 className="text-3xl md:text-4xl font-black mb-1 leading-tight" style={{ background: "linear-gradient(135deg, #1a365d, #e53e3e)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
          {profile.title}
        </h1>
        <p className="text-sm font-semibold text-purple/50 mb-2">{profile.subtitle}</p>

        {/* Pseudo */}
        <p className="text-lg text-purple-dark/60 font-medium mb-6">
          Patient : {result.pseudo}
        </p>

        {/* Description */}
        <div className="card mb-6 border-2 border-purple/5">
          <p className="text-sm text-purple-dark/70 leading-relaxed italic">
            &laquo; {profile.description} &raquo;
          </p>
        </div>

        {/* Score card */}
        <div className="card mb-8">
          <div className="mb-6">
            <div className="text-5xl font-black text-purple mb-1">
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
                background: "linear-gradient(90deg, #1a365d, #e53e3e, #ff6b6b)",
              }}
            />
          </div>
          <div className="text-sm font-bold text-purple">
            Indice de pathologie : {percentage}%
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => {
              sessionStorage.removeItem("dsm6-score");
              sessionStorage.removeItem("dsm6-answers");
              router.push("/dsm6/quiz");
            }}
            className="btn-primary"
          >
            Nouvelle consultation
          </button>
          <Link href="/dsm6/classement" className="btn-secondary text-center">
            Classement des patients
          </Link>
        </div>

        <p className="mt-8 text-xs text-purple/30 italic">
          Ce diagnostic est garanti sans aucune valeur m&eacute;dicale. Envoyez-le &agrave; vos proches pour confirmation.
        </p>
      </div>
    </div>
  );
}
