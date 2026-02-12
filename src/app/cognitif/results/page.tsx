"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Confetti from "@/components/Confetti";
import RegisterInvite from "@/components/RegisterInvite";
import {
  calculateIQ,
  getCognitifProfile,
  COGNITIF_MAX_RAW_SCORE,
} from "@/data/cognitif-questions";

interface QuestionResult {
  questionId: number;
  question: string;
  userAnswer: string;
  correct: boolean;
  points: number;
}

interface ScoreResult {
  pseudo: string;
  score: number;
  title: string;
  date: string;
}

export default function CognitifResultsPage() {
  const router = useRouter();
  const [result, setResult] = useState<ScoreResult | null>(null);
  const [questionResults, setQuestionResults] = useState<QuestionResult[]>([]);
  const [rawScore, setRawScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const hasSaved = useRef(false);

  useEffect(() => {
    if (hasSaved.current) return;

    const pseudo = sessionStorage.getItem("cognitif-pseudo");
    const iqStr = sessionStorage.getItem("cognitif-score");
    const rawStr = sessionStorage.getItem("cognitif-raw-score");
    const resultsRaw = sessionStorage.getItem("cognitif-results");

    if (!pseudo || !iqStr) {
      router.push("/cognitif");
      return;
    }

    hasSaved.current = true;

    const iq = parseInt(iqStr, 10);
    const raw = parseInt(rawStr ?? "0", 10);
    setRawScore(raw);

    let parsed: QuestionResult[] = [];
    try {
      parsed = resultsRaw ? JSON.parse(resultsRaw) : [];
    } catch {
      /* ignore */
    }
    setQuestionResults(parsed);

    const answers = parsed.map((qr, i) => ({
      questionId: i,
      question: qr.question,
      answerIndex: qr.correct ? 1 : 0,
      answerText: qr.userAnswer,
      points: qr.points,
    }));

    async function saveScore() {
      for (const payload of [
        { pseudo, score: raw, answers },
        { pseudo, score: raw, answers: [] },
      ]) {
        try {
          const res = await fetch("/api/cognitif-scores", {
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
      const profile = getCognitifProfile(iq);
      setResult({
        pseudo: pseudo!,
        score: iq,
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
        <div className="text-xl text-[#2c3e50] animate-pulse">
          Calcul de votre QI en cours...
        </div>
      </div>
    );
  }

  const iq = result.score;
  const profile = getCognitifProfile(iq);
  const correctCount = questionResults.filter((r) => r.correct).length;

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center px-4 py-12">
      {showConfetti && <Confetti />}

      <div className="max-w-lg w-full animate-slide-up">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-8xl mb-4 animate-bounce-in">
            {profile.emoji}
          </div>

          <div className="inline-block bg-[#2c3e50]/10 text-[#2c3e50] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
            Rapport Cognitif
          </div>

          <h1
            className="text-3xl md:text-4xl font-black mb-1 leading-tight"
            style={{
              background: "linear-gradient(135deg, #2c3e50, #e74c3c)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {profile.title}
          </h1>
          <p className="text-sm font-semibold text-[#2c3e50]/50 mb-2">
            {profile.subtitle}
          </p>
          <p className="text-lg text-purple-dark/60 font-medium">
            Cobaye : {result.pseudo}
          </p>
        </div>

        {/* IQ Score */}
        <div className="card mb-6 text-center">
          <div
            className={`text-6xl font-black mb-1 ${
              iq >= 145
                ? "text-[#e74c3c]"
                : iq >= 130
                  ? "text-green-600"
                  : iq >= 115
                    ? "text-[#3498db]"
                    : iq >= 100
                      ? "text-[#2c3e50]"
                      : iq >= 85
                        ? "text-orange"
                        : "text-red-600"
            }`}
          >
            QI {iq}
          </div>
          <div className="text-sm text-[#2c3e50]/50 font-medium mb-2">
            {rawScore}/{COGNITIF_MAX_RAW_SCORE} points bruts · {correctCount}/
            {questionResults.length} bonnes réponses
          </div>

          {/* IQ Scale */}
          <div className="relative w-full bg-[#2c3e50]/10 rounded-full h-4 overflow-hidden mt-4">
            <div
              className="h-full rounded-full transition-all duration-1000 ease-out"
              style={{
                width: `${((iq - 60) / 100) * 100}%`,
                background:
                  iq >= 145
                    ? "linear-gradient(90deg, #e74c3c, #c0392b)"
                    : iq >= 130
                      ? "linear-gradient(90deg, #22c55e, #16a34a)"
                      : iq >= 115
                        ? "linear-gradient(90deg, #3498db, #2980b9)"
                        : iq >= 100
                          ? "linear-gradient(90deg, #2c3e50, #34495e)"
                          : iq >= 85
                            ? "linear-gradient(90deg, #f97316, #ea580c)"
                            : "linear-gradient(90deg, #ef4444, #dc2626)",
              }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-[#2c3e50]/30 mt-1 px-1">
            <span>60</span>
            <span>85</span>
            <span>100</span>
            <span>115</span>
            <span>130</span>
            <span>160</span>
          </div>
        </div>

        {/* Profile description */}
        <div className="card mb-6 border-2 border-[#2c3e50]/5">
          <p className="text-sm text-purple-dark/70 leading-relaxed italic mb-4">
            &laquo; {profile.description} &raquo;
          </p>
          <div className="border-t border-[#2c3e50]/10 pt-3">
            <p className="text-xs font-bold text-[#e74c3c] uppercase mb-1">
              Recommandation
            </p>
            <p className="text-sm text-purple-dark/60 leading-relaxed">
              {profile.recommendation}
            </p>
          </div>
        </div>

        {/* Per-question breakdown */}
        {questionResults.length > 0 && (
          <>
            <h2
              className="text-xl font-black mb-4"
              style={{
                background: "linear-gradient(135deg, #2c3e50, #e74c3c)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Détail des réponses
            </h2>

            <div className="space-y-3 mb-6">
              {questionResults.map((qr, i) => (
                <div
                  key={i}
                  className={`card border-2 ${
                    qr.correct
                      ? "border-green-200/50 bg-green-50/30"
                      : "border-red-200/50 bg-red-50/30"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-[#2c3e50]/50">
                      Q{i + 1}
                    </span>
                    <span
                      className={`text-xs font-black px-2 py-0.5 rounded-full ${
                        qr.correct
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {qr.correct ? `+${qr.points} pts` : "0 pts"}
                    </span>
                  </div>
                  <p className="text-xs text-purple-dark/60 leading-relaxed mb-2 line-clamp-2">
                    {qr.question}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">
                      {qr.correct ? "✅" : "❌"}
                    </span>
                    <span
                      className={`text-sm font-medium ${
                        qr.correct ? "text-green-700" : "text-red-600"
                      }`}
                    >
                      {qr.userAnswer}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Register invite */}
        <RegisterInvite />

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center text-center">
          <button
            onClick={() => {
              sessionStorage.removeItem("cognitif-score");
              sessionStorage.removeItem("cognitif-raw-score");
              sessionStorage.removeItem("cognitif-results");
              router.push("/cognitif/quiz");
            }}
            className="font-bold text-white py-3 px-6 rounded-full transition-all hover:scale-105 hover:shadow-lg"
            style={{
              background: "linear-gradient(135deg, #2c3e50, #e74c3c)",
            }}
          >
            Nouveau test
          </button>
          <Link
            href="/cognitif/classement"
            className="btn-secondary text-center"
          >
            Classement
          </Link>
        </div>

        <p className="mt-8 text-xs text-purple/30 italic text-center">
          Ce rapport a été généré par un algorithme qui confond encore corrélation
          et causalité. Aucune valeur scientifique ne peut lui être attribuée.
        </p>
      </div>
    </div>
  );
}
