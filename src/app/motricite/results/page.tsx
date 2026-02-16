"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Confetti from "@/components/Confetti";
import RegisterInvite from "@/components/RegisterInvite";
import GameIcon from "@/components/GameIcon";
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
        <div className="text-xl text-blue animate-pulse">
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
          <div className="mb-4 animate-bounce-in flex justify-center">
            <GameIcon name={profile.emoji} size={80} />
          </div>

          <div className="inline-block text-blue text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
            Rapport Neuromoteur
          </div>

          <h1 className="text-3xl md:text-4xl font-medium mb-1 leading-tight text-foreground">
            {profile.title}
          </h1>
          <p className="text-sm font-medium text-foreground mb-2">
            {profile.subtitle}
          </p>
          <p className="text-lg text-black font-medium">
            Patient : {result.pseudo}
          </p>
        </div>

        {/* Overall score */}
        <div className="card mb-6 text-center">
          <div
            className={`text-6xl font-black mb-1 ${
              result.score >= 90
                ? "text-blue"
                : result.score >= 70
                  ? "text-blue"
                  : result.score >= 50
                    ? "text-yellow"
                    : "text-red"
            }`}
          >
            {result.score}%
          </div>
          <div className="text-sm text-foreground font-medium mb-4">
            Précision globale
          </div>

          {/* Visual bar */}
          <div className="w-full rounded-full h-4 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ease-out ${
                result.score >= 80
                  ? "bg-blue"
                  : result.score >= 60
                    ? "bg-blue"
                    : result.score >= 40
                      ? "bg-yellow"
                      : "bg-red"
              }`}
              style={{
                width: `${result.score}%`,
              }}
            />
          </div>
        </div>

        {/* Profile description */}
        <div className="card mb-6 border border-blue">
          <p className="text-sm text-foreground leading-relaxed italic mb-4">
            &laquo; {profile.description} &raquo;
          </p>
          <div className="border-t border-red pt-3">
            <p className="text-xs font-bold text-red uppercase mb-1">
              Recommandation
            </p>
            <p className="text-sm text-black leading-relaxed">
              {profile.recommendation}
            </p>
          </div>
        </div>

        {/* Per-level breakdown */}
        {levelResults.length > 0 && (
          <>
            <h2 className="text-xl font-black mb-4 text-foreground">
              Détail par niveau
            </h2>

            <div className="space-y-4 mb-6">
              {levelResults.map((lr) => (
                <div
                  key={lr.levelIndex}
                  className="card border border-blue"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-bold text-black text-sm">
                      Niv. {lr.levelIndex + 1} — {lr.levelName}
                    </div>
                    <div
                      className={`text-lg font-black ${
                        lr.successRate >= 80
                          ? "text-blue"
                          : lr.successRate >= 50
                            ? "text-yellow"
                            : "text-red"
                      }`}
                    >
                      {lr.successRate}%
                    </div>
                  </div>

                  <div className="text-xs text-black mb-3">
                    {lr.hits}/{lr.total} cibles touchées
                    {lr.misses > 0 && (
                      <span className="text-red ml-2">
                        · {lr.misses} clic{lr.misses > 1 ? "s" : ""} raté{lr.misses > 1 ? "s" : ""}
                      </span>
                    )}
                  </div>

                  <div className="rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
                          lr.successRate >= 80
                            ? "text-yellow"
                            : lr.successRate >= 50
                              ? "text-yellow"
                              : "text-red"
                        }`}
                      >
                        {lr.diagnosis.severity}
                      </span>
                      <span className="text-xs font-bold text-black">
                        {lr.diagnosis.condition}
                      </span>
                    </div>
                    <p className="text-xs text-black leading-relaxed italic">
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
          <div className="card mb-6 border border-red">
            <h3 className="font-black text-red text-sm uppercase mb-3">
              Pathologies détectées
            </h3>
            <ul className="space-y-2">
              {levelResults.map((lr) => (
                <li key={lr.levelIndex} className="flex items-start gap-2">
                  <span className="text-red mt-0.5">•</span>
                  <div>
                    <span className="text-sm font-bold text-black">
                      {lr.diagnosis.condition}
                    </span>
                    <span className="text-xs text-black ml-2">
                      ({lr.diagnosis.severity})
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Register invite */}
        <RegisterInvite />

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center text-center">
          <button
            onClick={() => {
              sessionStorage.removeItem("motricite-score");
              sessionStorage.removeItem("motricite-level-results");
              router.push("/motricite/quiz");
            }}
            className="font-bold text-white py-3 px-6 rounded-full transition-all hover:scale-105 bg-blue"
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

        <p className="mt-8 text-xs text-foreground italic text-center">
          Ce rapport a été rédigé par un algorithme qui n&apos;a aucune formation
          médicale. Toute ressemblance avec un vrai diagnostic est purement
          fortuite.
        </p>
      </div>
    </div>
  );
}
