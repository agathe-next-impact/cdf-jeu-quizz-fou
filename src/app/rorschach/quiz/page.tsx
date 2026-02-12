"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Brain, ClipboardList, Search } from "lucide-react";
import { rorschachQuestions } from "@/data/rorschach-questions";

/* ------------------------------------------------------------------ */
/*  CSS Inkblot generator — symmetrical abstract blobs                 */
/* ------------------------------------------------------------------ */
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function InkBlot({
  seed,
  colors,
}: {
  seed: number;
  colors: [string, string];
}) {
  const blobs = useMemo(() => {
    const rng = seededRandom(seed * 137);
    const count = 6 + Math.floor(rng() * 4);
    const result: {
      cx: number;
      cy: number;
      rx: number;
      ry: number;
      rotation: number;
      opacity: number;
    }[] = [];
    for (let i = 0; i < count; i++) {
      const cx = 20 + rng() * 30; // only right half (20-50), mirror later
      const cy = 10 + rng() * 80;
      const rx = 8 + rng() * 18;
      const ry = 6 + rng() * 22;
      const rotation = rng() * 360;
      const opacity = 0.5 + rng() * 0.5;
      result.push({ cx, cy, rx, ry, rotation, opacity });
    }
    return result;
  }, [seed]);

  return (
    <div className="relative w-full max-w-[280px] aspect-square mx-auto">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <defs>
          <radialGradient id={`grad-${seed}`}>
            <stop offset="0%" stopColor={colors[0]} />
            <stop offset="100%" stopColor={colors[1]} />
          </radialGradient>
          <filter id={`blur-${seed}`}>
            <feGaussianBlur stdDeviation="0.8" />
          </filter>
        </defs>
        {/* Right half + mirrored left half */}
        {blobs.map((b, i) => (
          <g key={i} filter={`url(#blur-${seed})`}>
            {/* Right */}
            <ellipse
              cx={b.cx}
              cy={b.cy}
              rx={b.rx}
              ry={b.ry}
              fill={`url(#grad-${seed})`}
              opacity={b.opacity}
              transform={`rotate(${b.rotation} ${b.cx} ${b.cy})`}
            />
            {/* Mirror left */}
            <ellipse
              cx={100 - b.cx}
              cy={b.cy}
              rx={b.rx}
              ry={b.ry}
              fill={`url(#grad-${seed})`}
              opacity={b.opacity}
              transform={`rotate(${-b.rotation} ${100 - b.cx} ${b.cy})`}
            />
          </g>
        ))}
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Quiz page                                                          */
/* ------------------------------------------------------------------ */
export default function RorschachQuizPage() {
  const router = useRouter();
  const [pseudo, setPseudo] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [answeredPoints, setAnsweredPoints] = useState(0);
  const [interpretation, setInterpretation] = useState("");
  const [playerAnswers, setPlayerAnswers] = useState<
    {
      questionId: number;
      question: string;
      answerIndex: number;
      answerText: string;
      points: number;
    }[]
  >([]);

  useEffect(() => {
    const stored = sessionStorage.getItem("rorschach-pseudo");
    if (!stored) {
      router.push("/rorschach");
      return;
    }
    setPseudo(stored);
  }, [router]);

  const handleAnswer = useCallback(
    (answerIndex: number) => {
      if (showFeedback) return;

      const q = rorschachQuestions[currentQuestion];
      const answer = q.answers[answerIndex];
      setSelectedAnswer(answerIndex);
      setAnsweredPoints(answer.points);
      setInterpretation(answer.interpretation);
      setShowFeedback(true);
      setScore((prev) => prev + answer.points);

      const newAnswer = {
        questionId: q.id,
        question: `Tache n°${q.id}`,
        answerIndex,
        answerText: answer.text,
        points: answer.points,
      };
      const updatedAnswers = [...playerAnswers, newAnswer];
      setPlayerAnswers(updatedAnswers);

      setTimeout(() => {
        if (currentQuestion < rorschachQuestions.length - 1) {
          setCurrentQuestion((prev) => prev + 1);
          setSelectedAnswer(null);
          setShowFeedback(false);
          setAnsweredPoints(0);
          setInterpretation("");
        } else {
          const finalScore = score + answer.points;
          sessionStorage.setItem("rorschach-score", String(finalScore));
          sessionStorage.setItem(
            "rorschach-answers",
            JSON.stringify(updatedAnswers)
          );
          router.push("/rorschach/results");
        }
      }, 2500);
    },
    [currentQuestion, router, score, showFeedback, playerAnswers]
  );

  if (!pseudo) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
        <div className="text-xl text-blue animate-pulse">
          Préparation de la séance...
        </div>
      </div>
    );
  }

  const question = rorschachQuestions[currentQuestion];
  const progress =
    ((currentQuestion + 1) / rorschachQuestions.length) * 100;
  const maxScore = rorschachQuestions.length * 30;

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center px-4 py-8">
      <div className="max-w-2xl w-full">
        {/* Progress bar */}
        <div className="mb-6 animate-slide-up">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-bold text-blue">
              Tache {currentQuestion + 1}/{rorschachQuestions.length}
            </span>
            <span className="text-sm font-bold text-blue">
              Sujet {pseudo} &mdash; {score} pts
            </span>
          </div>
          <div className="w-full rounded-full h-3 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${progress}%`,
                backgroundColor: "var(--color-blue)",
              }}
            />
          </div>
        </div>

        {/* Inkblot display */}
        <div
          key={question.id}
          className="card mb-6 text-center animate-slide-up border border-blue bg-white"
        >
          <div className="mb-4">
            <InkBlot seed={question.blotSeed} colors={question.blotColors} />
          </div>
          <h2 className="text-xl font-black text-black">
            Que voyez-vous ?
          </h2>
        </div>

        {/* Answer buttons */}
        <div className="grid gap-3">
          {question.answers.map((answer, index) => {
            const isSelected = selectedAnswer === index;

            let bgClass =
              "bg-white border border-blue hover:border-blue";
            if (showFeedback && isSelected) {
              if (answeredPoints >= 25)
                bgClass =
                  "border border-red scale-[1.02]";
              else if (answeredPoints >= 15)
                bgClass =
                  "border border-yellow scale-[1.02]";
              else
                bgClass =
                  "border border-yellow scale-[1.02]";
            }

            return (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                disabled={showFeedback}
                className={`${bgClass} rounded-2xl px-6 py-4 text-left transition-all duration-300 cursor-pointer disabled:cursor-default flex items-center gap-4 animate-slide-up`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <span className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-blue text-sm shrink-0">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="font-semibold text-black flex-1">
                  {answer.text}
                </span>
                {showFeedback && isSelected && (
                  <span className="text-sm font-bold animate-bounce-in">
                    {answeredPoints >= 25
                      ? <Brain size={20} />
                      : answeredPoints >= 15
                        ? <ClipboardList size={20} />
                        : <Search size={20} />}{" "}
                    +{answeredPoints}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Interpretation feedback */}
        {showFeedback && interpretation && (
          <div className="mt-4 card border border-blue animate-slide-up">
            <p className="text-sm text-black italic font-medium text-center">
              <span className="text-blue font-bold">Analyse :</span>{" "}
              {interpretation}
            </p>
          </div>
        )}

        {/* Score bar */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full">
            <span className="text-sm font-medium text-blue">
              Indice de pathologie
            </span>
            <span className="text-lg font-black text-blue">{score}</span>
            <span className="text-sm text-blue">/ {maxScore}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
