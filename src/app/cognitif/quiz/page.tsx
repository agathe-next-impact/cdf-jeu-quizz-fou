"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Check, X as XIcon, Lightbulb } from "lucide-react";
import {
  cognitifQuestions,
  COGNITIF_TIME_PER_QUESTION,
  calculateIQ,
} from "@/data/cognitif-questions";

interface QuestionResult {
  questionId: number;
  question: string;
  userAnswer: string;
  correct: boolean;
  points: number;
}

export default function CognitifQuizPage() {
  const router = useRouter();
  const [pseudo, setPseudo] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [timeLeft, setTimeLeft] = useState(COGNITIF_TIME_PER_QUESTION);
  const [results, setResults] = useState<QuestionResult[]>([]);
  const [feedback, setFeedback] = useState<{
    correct: boolean;
    points: number;
  } | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const p = sessionStorage.getItem("cognitif-pseudo");
    if (!p) {
      router.push("/cognitif");
      return;
    }
    setPseudo(p);
  }, [router]);

  const submitAnswer = useCallback(
    (userAnswer: string) => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      const q = cognitifQuestions[currentIndex];
      const normalized = userAnswer.trim().toLowerCase();
      const correct = q.acceptableAnswers.some(
        (a) => normalized === a.toLowerCase()
      );
      const points = correct ? q.points : 0;

      const result: QuestionResult = {
        questionId: q.id,
        question: q.question,
        userAnswer: userAnswer.trim() || "(pas de réponse)",
        correct,
        points,
      };

      setFeedback({ correct, points });

      // After short feedback, move to next
      setTimeout(() => {
        const newResults = [...results, result];
        setResults(newResults);
        setFeedback(null);
        setAnswer("");
        setShowHint(false);

        if (currentIndex + 1 < cognitifQuestions.length) {
          setCurrentIndex(currentIndex + 1);
          setTimeLeft(COGNITIF_TIME_PER_QUESTION);
        } else {
          // Quiz finished
          const rawScore = newResults.reduce((s, r) => s + r.points, 0);
          const iq = calculateIQ(rawScore);

          sessionStorage.setItem("cognitif-score", String(iq));
          sessionStorage.setItem("cognitif-raw-score", String(rawScore));
          sessionStorage.setItem(
            "cognitif-results",
            JSON.stringify(newResults)
          );
          router.push("/cognitif/results");
        }
      }, 1500);
    },
    [currentIndex, results, router]
  );

  // Timer
  useEffect(() => {
    if (pseudo === null) return;
    if (feedback) return; // pause during feedback

    setTimeLeft(COGNITIF_TIME_PER_QUESTION);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          submitAnswer(answer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, pseudo, feedback]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-focus input
  useEffect(() => {
    if (!feedback && inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentIndex, feedback]);

  if (!pseudo) return null;

  const q = cognitifQuestions[currentIndex];
  const progress = ((currentIndex) / cognitifQuestions.length) * 100;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (feedback) return;
    submitAnswer(answer);
  }

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center px-4 py-8">
      <div className="max-w-lg w-full">
        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-yellow">
              Question {currentIndex + 1}/{cognitifQuestions.length}
            </span>
            <span
              className={`text-sm font-black ${
                timeLeft <= 10
                  ? "text-red animate-pulse"
                  : "text-yellow"
              }`}
            >
              {timeLeft}s
            </span>
          </div>
          <div className="w-full rounded-full h-3 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500 ease-out bg-yellow"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>
        </div>

        {/* Timer bar */}
        <div className="w-full rounded-full h-1.5 mb-6 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 linear ${
              timeLeft <= 10
                ? "bg-red"
                : timeLeft <= 20
                  ? "bg-yellow"
                  : "bg-blue"
            }`}
            style={{
              width: `${(timeLeft / COGNITIF_TIME_PER_QUESTION) * 100}%`,
            }}
          />
        </div>

        {/* Feedback overlay */}
        {feedback && (
          <div
            className={`card text-center mb-4 border animate-slide-up ${
              feedback.correct
                ? "border-blue"
                : "border-red"
            }`}
          >
            <div className="text-4xl mb-2 flex justify-center">
              {feedback.correct ? <Check size={40} className="text-green-600" /> : <XIcon size={40} className="text-red" />}
            </div>
            <p
              className={`font-bold ${
                feedback.correct ? "text-blue" : "text-red"
              }`}
            >
              {feedback.correct
                ? `Correct ! +${feedback.points} points`
                : "Mauvaise réponse"}
            </p>
            {!feedback.correct && (
              <p className="text-sm text-red mt-1">
                Réponse attendue : {q.correctAnswer}
              </p>
            )}
          </div>
        )}

        {/* Question card */}
        {!feedback && (
          <div className="card border border-black mb-6 animate-slide-up">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-black text-xs font-black px-3 py-1 rounded-full">
                {q.points} pts
              </span>
              <span className="text-xs text-black font-medium">
                Question {currentIndex + 1}
              </span>
            </div>

            <p className="text-base font-semibold text-black leading-relaxed mb-6">
              {q.question}
            </p>

            {/* Hint */}
            {!showHint ? (
              <button
                onClick={() => setShowHint(true)}
                className="text-xs text-foreground hover:text-foreground font-semibold mb-4 transition-colors inline-flex items-center gap-1"
              >
                <Lightbulb size={14} /> Afficher l&apos;indice
              </button>
            ) : (
              <div className="rounded-xl p-3 mb-4 animate-slide-up">
                <p className="text-xs text-fore italic inline-flex items-center gap-1">
                  <Lightbulb size={14} /> {q.hint}
                </p>
              </div>
            )}

            {/* Answer input */}
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                ref={inputRef}
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Tapez votre réponse..."
                className="w-full px-4 py-3 rounded-xl border border-black focus:border-red focus:outline-none text-base font-medium transition-colors bg-white placeholder:text-black"
                autoComplete="off"
              />
              <button
                type="submit"
                disabled={answer.trim().length === 0}
                className="w-full font-bold text-white py-3 px-6 rounded-full transition-all hover:scale-105 disabled:hover:scale-100 bg-red"
              >
                Valider
              </button>
            </form>
          </div>
        )}

        {/* Score so far */}
        {!feedback && results.length > 0 && (
          <div className="text-center">
            <span className="text-xs text-black font-medium">
              Score actuel :{" "}
              <span className="font-bold text-black">
                {results.reduce((s, r) => s + r.points, 0)} pts
              </span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
