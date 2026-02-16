"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Confetti from "@/components/Confetti";
import RegisterInvite from "@/components/RegisterInvite";
import GameIcon from "@/components/GameIcon";
import { Check, X as XIcon } from "lucide-react";
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
        <div className="text-xl text-black animate-pulse">
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
          <div className="mb-4 animate-bounce-in flex justify-center">
            <GameIcon name={profile.emoji} size={80} />
          </div>

          <div className="inline-block text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
            Rapport Cognitif
          </div>

          <h1
            className="text-3xl md:text-4xl font-medium mb-1 leading-tight text-yellow"
          >
            {profile.title}
          </h1>
          <p className="text-sm font-semibold text-black mb-2">
            {profile.subtitle}
          </p>
          <p className="text-lg text-black font-medium">
            Cobaye : {result.pseudo}
          </p>
        </div>

        {/* IQ Score */}
        <div className="card mb-6 text-center">
          <div
            className={`text-6xl font-black mb-1 ${
              iq >= 145
                ? "text-red"
                : iq >= 130
                  ? "text-blue"
                  : iq >= 115
                    ? "text-blue"
                    : iq >= 100
                      ? "text-black"
                      : iq >= 85
                        ? "text-yellow"
                        : "text-red"
            }`}
          >
            QI {iq}
          </div>
          <div className="text-sm text-black font-medium mb-2">
            {rawScore}/{COGNITIF_MAX_RAW_SCORE} points bruts · {correctCount}/
            {questionResults.length} bonnes réponses
          </div>

          {/* IQ Scale */}
          <div className="relative w-full rounded-full h-4 overflow-hidden mt-4">
            <div
              className={`h-full rounded-full transition-all duration-1000 ease-out ${
                iq >= 145
                  ? "bg-red"
                  : iq >= 130
                    ? "bg-blue"
                    : iq >= 115
                      ? "bg-blue"
                      : iq >= 100
                        ? "bg-black"
                        : iq >= 85
                          ? "bg-yellow"
                          : "bg-red"
              }`}
              style={{
                width: `${((iq - 60) / 100) * 100}%`,
              }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-black mt-1 px-1">
            <span>60</span>
            <span>85</span>
            <span>100</span>
            <span>115</span>
            <span>130</span>
            <span>160</span>
          </div>
        </div>

        {/* Profile description */}
        <div className="card mb-6 border border-black">
          <p className="text-sm text-black leading-relaxed italic mb-4">
            &laquo; {profile.description} &raquo;
          </p>
          <div className="border-t border-black pt-3">
            <p className="text-xs font-bold text-red uppercase mb-1">
              Recommandation
            </p>
            <p className="text-sm text-black leading-relaxed">
              {profile.recommendation}
            </p>
          </div>
        </div>

        {/* Per-question breakdown */}
        {questionResults.length > 0 && (
          <>
            <h2
              className="text-xl font-black mb-4 text-foreground"
            >
              Détail des réponses
            </h2>

            <div className="space-y-3 mb-6">
              {questionResults.map((qr, i) => (
                <div
                  key={i}
                  className={`card border ${
                    qr.correct
                      ? "border-blue"
                      : "border-red"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-black">
                      Q{i + 1}
                    </span>
                    <span
                      className={`text-xs font-black px-2 py-0.5 rounded-full ${
                        qr.correct
                          ? "text-blue"
                          : "text-red"
                      }`}
                    >
                      {qr.correct ? `+${qr.points} pts` : "0 pts"}
                    </span>
                  </div>
                  <p className="text-xs text-black leading-relaxed mb-2 line-clamp-2">
                    {qr.question}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">
                      {qr.correct ? <Check size={16} className="text-green-600" /> : <XIcon size={16} className="text-red" />}
                    </span>
                    <span
                      className={`text-sm font-medium ${
                        qr.correct ? "text-blue" : "text-red"
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
            className="font-bold text-white py-3 px-6 rounded-full transition-all hover:scale-105 bg-red"
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

        <p className="mt-8 text-xs text-foreground italic text-center">
          Ce rapport a été généré par un algorithme qui confond encore corrélation
          et causalité. Aucune valeur scientifique ne peut lui être attribuée.
        </p>
      </div>
    </div>
  );
}
