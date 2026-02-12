"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Confetti from "@/components/Confetti";
import { getMotriciteProfile } from "@/data/motricite-questions";

interface LevelResult {
  levelIndex: number;
  levelName: string;
  hits: number;
  misses: number;
  total: number;
  successRate: number;
  diagnosis: { condition: string; severity: string; explanation: string };
}

interface ScoreResult {
  pseudo: string;
  score: number;
  title: string;
  date: string;
}

export default function MotriciteResultsPage() {
  const router = useRouter();
  const [result, setResult] = useState<ScoreResult | null>(null);
  const [levelResults, setLevelResults] = useState<LevelResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const hasSaved = useRef(false);

  useEffect(() => {
    if (hasSaved.current) return;

    const pseudo = sessionStorage.getItem("motricite-pseudo");
    const scoreStr = sessionStorage.getItem("motricite-score");
    const levelsRaw = sessionStorage.getItem("motricite-level-results");

    if (!pseudo || !scoreStr) {
      router.push("/motricite");
      return;
    }

    hasSaved.current = true;

    const score = parseInt(scoreStr, 10);
    let parsedLevels: LevelResult[] = [];
    try {
      parsedLevels = levelsRaw ? JSON.parse(levelsRaw) : [];
    } catch {
      /* ignore */
    }
    setLevelResults(parsedLevels);

    // Build answers array from level results
    const answers = parsedLevels.map((lr, i) => ({
      questionId: i,
      question: lr.levelName,
      answerIndex: lr.hits,
      answerText: `${lr.hits}/${lr.total} cibles, ${lr.misses ?? 0} ratés (${lr.successRate}%)`,
      points: lr.successRate,
    }));

    async function saveScore() {
      for (const payload of [
        { pseudo, score, answers },
        { pseudo, score, answers: [] },
      ]) {
        try {
          const res = await fetch("/api/motricite-scores", {
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
      const profile = getMotriciteProfile(score);
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
  }, [router]);

  if (loading || !result) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
        <div className="text-xl text-[#0d9488] animate-pulse">
          Compilation du rapport neurologique...
        </div>
      </div>
    );
  }

  const profile = getMotriciteProfile(result.score);

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center px-4 py-12">
      {showConfetti && <Confetti />}

      <div className="max-w-lg w-full animate-slide-up">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-8xl mb-4 animate-bounce-in">
            {profile.emoji}
          </div>

          <div className="inline-block bg-[#0d9488]/10 text-[#0d9488] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
            Rapport Neuromoteur
          </div>

          <h1
            className="text-3xl md:text-4xl font-black mb-1 leading-tight"
            style={{
              background: "linear-gradient(135deg, #0d9488, #14b8a6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {profile.title}
          </h1>
          <p className="text-sm font-semibold text-[#0d9488]/50 mb-2">
            {profile.subtitle}
          </p>
          <p className="text-lg text-purple-dark/60 font-medium">
            Patient : {result.pseudo}
          </p>
        </div>

        {/* Overall score */}
        <div className="card mb-6 text-center">
          <div
            className={`text-6xl font-black mb-1 ${
              result.score >= 90
                ? "text-green-600"
                : result.score >= 70
                  ? "text-[#0d9488]"
                  : result.score >= 50
                    ? "text-orange"
                    : "text-red-600"
            }`}
          >
            {result.score}%
          </div>
          <div className="text-sm text-[#0d9488]/50 font-medium mb-4">
            Précision globale
          </div>

          {/* Visual bar */}
          <div className="w-full bg-[#0d9488]/10 rounded-full h-4 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000 ease-out"
              style={{
                width: `${result.score}%`,
                background:
                  result.score >= 90
                    ? "linear-gradient(90deg, #22c55e, #16a34a)"
                    : result.score >= 70
                      ? "linear-gradient(90deg, #0d9488, #14b8a6)"
                      : result.score >= 50
                        ? "linear-gradient(90deg, #f97316, #ea580c)"
                        : "linear-gradient(90deg, #ef4444, #dc2626)",
              }}
            />
          </div>
        </div>

        {/* Profile description */}
        <div className="card mb-6 border-2 border-[#0d9488]/5">
          <p className="text-sm text-purple-dark/70 leading-relaxed italic mb-4">
            &laquo; {profile.description} &raquo;
          </p>
          <div className="border-t border-[#0d9488]/10 pt-3">
            <p className="text-xs font-bold text-[#0d9488] uppercase mb-1">
              Recommandation
            </p>
            <p className="text-sm text-purple-dark/60 leading-relaxed">
              {profile.recommendation}
            </p>
          </div>
        </div>

        {/* Per-level breakdown */}
        {levelResults.length > 0 && (
          <>
            <h2
              className="text-xl font-black mb-4"
              style={{
                background: "linear-gradient(135deg, #0d9488, #14b8a6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Détail par niveau
            </h2>

            <div className="space-y-4 mb-6">
              {levelResults.map((lr) => (
                <div
                  key={lr.levelIndex}
                  className="card border-2 border-[#0d9488]/10"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-bold text-purple-dark text-sm">
                      Niv. {lr.levelIndex + 1} — {lr.levelName}
                    </div>
                    <div
                      className={`text-lg font-black ${
                        lr.successRate >= 80
                          ? "text-green-600"
                          : lr.successRate >= 50
                            ? "text-orange"
                            : "text-red-600"
                      }`}
                    >
                      {lr.successRate}%
                    </div>
                  </div>

                  <div className="text-xs text-purple-dark/40 mb-3">
                    {lr.hits}/{lr.total} cibles touchées
                    {lr.misses > 0 && (
                      <span className="text-red-400 ml-2">
                        · {lr.misses} clic{lr.misses > 1 ? "s" : ""} raté{lr.misses > 1 ? "s" : ""}
                      </span>
                    )}
                  </div>

                  <div className="bg-[#0d9488]/5 rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
                          lr.successRate >= 80
                            ? "bg-amber-100 text-amber-700"
                            : lr.successRate >= 50
                              ? "bg-orange/10 text-orange"
                              : "bg-red-100 text-red-600"
                        }`}
                      >
                        {lr.diagnosis.severity}
                      </span>
                      <span className="text-xs font-bold text-purple-dark/70">
                        {lr.diagnosis.condition}
                      </span>
                    </div>
                    <p className="text-xs text-purple-dark/50 leading-relaxed italic">
                      {lr.diagnosis.explanation}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Pathologies summary */}
        {levelResults.length > 0 && (
          <div className="card mb-6 border-2 border-red-200/50 bg-red-50/30">
            <h3 className="font-black text-red-600 text-sm uppercase mb-3">
              Pathologies détectées
            </h3>
            <ul className="space-y-2">
              {levelResults.map((lr) => (
                <li key={lr.levelIndex} className="flex items-start gap-2">
                  <span className="text-red-400 mt-0.5">•</span>
                  <div>
                    <span className="text-sm font-bold text-purple-dark/80">
                      {lr.diagnosis.condition}
                    </span>
                    <span className="text-xs text-purple-dark/40 ml-2">
                      ({lr.diagnosis.severity})
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center text-center">
          <button
            onClick={() => {
              sessionStorage.removeItem("motricite-score");
              sessionStorage.removeItem("motricite-level-results");
              router.push("/motricite/quiz");
            }}
            className="font-bold text-white py-3 px-6 rounded-full transition-all hover:scale-105 hover:shadow-lg"
            style={{
              background: "linear-gradient(135deg, #0d9488, #14b8a6)",
            }}
          >
            Nouveau test
          </button>
          <Link
            href="/motricite/classement"
            className="btn-secondary text-center"
          >
            Classement
          </Link>
        </div>

        <p className="mt-8 text-xs text-purple/30 italic text-center">
          Ce rapport a été rédigé par un algorithme qui n&apos;a aucune formation
          médicale. Toute ressemblance avec un vrai diagnostic est purement
          fortuite.
        </p>
      </div>
    </div>
  );
}
