"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Confetti from "@/components/Confetti";
import RegisterInvite from "@/components/RegisterInvite";
import GameIcon from "@/components/GameIcon";
import {
  rorschachQuestions,
  getRorschachProfile,
} from "@/data/rorschach-questions";

interface ScoreResult {
  pseudo: string;
  score: number;
  title: string;
  date: string;
}

export default function RorschachResultsPage() {
  const router = useRouter();
  const [result, setResult] = useState<ScoreResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const hasSaved = useRef(false);

  const maxScore = rorschachQuestions.length * 30;

  useEffect(() => {
    if (hasSaved.current) return;

    const pseudo = sessionStorage.getItem("rorschach-pseudo");
    const scoreStr = sessionStorage.getItem("rorschach-score");

    if (!pseudo || !scoreStr) {
      router.push("/rorschach");
      return;
    }

    hasSaved.current = true;

    const score = parseInt(scoreStr, 10);
    const answersRaw = sessionStorage.getItem("rorschach-answers");
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
          const res = await fetch("/api/rorschach-scores", {
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
      const profile = getRorschachProfile(score, maxScore);
      setResult({
        pseudo: pseudo!,
        score,
        title: profile.title,
        date: new Date().toISOString(),
      });
      setLoading(false);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
    }

    saveScore();
  }, [router, maxScore]);

  if (loading || !result) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
        <div className="text-xl text-blue animate-pulse">
          Rédaction du rapport psychologique...
        </div>
      </div>
    );
  }

  const percentage = Math.round((result.score / maxScore) * 100);
  const profile = getRorschachProfile(result.score, maxScore);

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-4 py-12">
      {showConfetti && <Confetti />}

      <div className="max-w-lg w-full text-center animate-slide-up">
        {/* Emoji */}
        <div className="mb-6 animate-bounce-in flex justify-center"><GameIcon name={profile.emoji} size={80} /></div>

        {/* Title */}
        <div className="inline-block text-blue text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
          Rapport Rorschach
        </div>
        <h1
          className="text-3xl md:text-4xl font-regular mb-1 leading-tight text-black"
        >
          {profile.title}
        </h1>
        <p className="text-sm font-semibold text-yellow mb-2">
          {profile.subtitle}
        </p>

        {/* Pseudo */}
        <p className="text-lg text-black font-medium mb-6">
          Sujet : {result.pseudo}
        </p>

        {/* Description */}
        <div className="card mb-6 border border-yellow">
          <p className="text-sm text-black leading-relaxed italic">
            &laquo; {profile.description} &raquo;
          </p>
        </div>

        {/* Score card */}
        <div className="card mb-8">
          <div className="mb-6">
            <div className="text-5xl font-black text-foreground mb-1">
              {result.score}
            </div>
            <div className="text-sm text-foreground font-medium">
              points sur {maxScore}
            </div>
          </div>

          {/* Score bar */}
          <div className="w-full rounded-full h-4 overflow-hidden mb-4">
            <div
              className="h-full rounded-full transition-all duration-1000 ease-out"
              style={{
                width: `${percentage}%`,
                backgroundColor: "var(--color-yellow)",
              }}
            />
          </div>
          <div className="text-sm font-bold text-foreground">
            Indice de pathologie : {percentage}%
          </div>
        </div>

        {/* Register invite */}
        <RegisterInvite />

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => {
              sessionStorage.removeItem("rorschach-score");
              sessionStorage.removeItem("rorschach-answers");
              router.push("/rorschach/quiz");
            }}
            className="btn-primary"
          >
            Nouvelle séance
          </button>
          <Link
            href="/rorschach/classement"
            className="btn-secondary text-center"
          >
            Classement des sujets
          </Link>
        </div>

        <p className="mt-8 text-xs text-foreground italic">
          Ce rapport est garanti sans aucune valeur scientifique. Partagez-le
          pour alarmer vos proches.
        </p>
      </div>
    </div>
  );
}
