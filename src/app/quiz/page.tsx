"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { questions } from "@/data/questions";

export default function QuizPage() {
  const router = useRouter();
  const [pseudo, setPseudo] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [answeredPoints, setAnsweredPoints] = useState(0);

  useEffect(() => {
    const stored = sessionStorage.getItem("pseudo");
    if (!stored) {
      router.push("/");
      return;
    }
    setPseudo(stored);
  }, [router]);

  const handleAnswer = useCallback(
    (answerIndex: number) => {
      if (showFeedback) return;

      const points = questions[currentQuestion].answers[answerIndex].points;
      setSelectedAnswer(answerIndex);
      setAnsweredPoints(points);
      setShowFeedback(true);
      setScore((prev) => prev + points);

      setTimeout(() => {
        if (currentQuestion < questions.length - 1) {
          setCurrentQuestion((prev) => prev + 1);
          setSelectedAnswer(null);
          setShowFeedback(false);
          setAnsweredPoints(0);
        } else {
          const finalScore = score + points;
          sessionStorage.setItem("score", String(finalScore));
          router.push("/results");
        }
      }, 1200);
    },
    [currentQuestion, router, score, showFeedback]
  );

  if (!pseudo) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
        <div className="text-xl text-purple animate-pulse">Chargement...</div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const maxScore = questions.length * 30;

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center px-4 py-8">
      <div className="max-w-2xl w-full">
        {/* Progress bar & info */}
        <div className="mb-6 animate-slide-up">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-bold text-purple">
              Question {currentQuestion + 1}/{questions.length}
            </span>
            <span className="text-sm font-bold text-purple">
              {pseudo} — {score} pts
            </span>
          </div>
          <div className="w-full bg-purple/10 rounded-full h-3 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${progress}%`,
                background: "linear-gradient(90deg, #7B2D8E, #FF6B9D)",
              }}
            />
          </div>
        </div>

        {/* Category badge */}
        <div className="flex justify-center mb-4">
          <span className="bg-yellow/30 text-purple-dark px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            {question.category}
          </span>
        </div>

        {/* Question card */}
        <div
          key={question.id}
          className="card mb-6 text-center animate-slide-up"
        >
          <h2 className="text-2xl md:text-3xl font-black text-purple-dark leading-snug">
            {question.question}
          </h2>
        </div>

        {/* Answer buttons */}
        <div className="grid gap-3">
          {question.answers.map((answer, index) => {
            const isSelected = selectedAnswer === index;
            const isHighPoints = showFeedback && isSelected && answeredPoints >= 25;
            const isMedPoints =
              showFeedback && isSelected && answeredPoints >= 10 && answeredPoints < 25;
            const isLowPoints = showFeedback && isSelected && answeredPoints < 10;

            let bgClass = "bg-white hover:bg-purple/5 border-2 border-purple/10 hover:border-purple/30";
            if (isHighPoints)
              bgClass = "bg-green/20 border-2 border-green scale-[1.02]";
            if (isMedPoints)
              bgClass = "bg-yellow/20 border-2 border-yellow scale-[1.02]";
            if (isLowPoints)
              bgClass = "bg-pink/20 border-2 border-pink scale-[1.02]";

            return (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                disabled={showFeedback}
                className={`${bgClass} rounded-2xl px-6 py-4 text-left transition-all duration-300 cursor-pointer disabled:cursor-default flex items-center gap-4 animate-slide-up`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <span className="w-10 h-10 rounded-full bg-purple/10 flex items-center justify-center font-bold text-purple text-sm shrink-0">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="font-semibold text-purple-dark flex-1">
                  {answer.text}
                </span>
                {showFeedback && isSelected && (
                  <span className="text-sm font-bold animate-bounce-in">
                    +{answeredPoints} pts
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Score bar at bottom */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 bg-purple/5 px-4 py-2 rounded-full">
            <span className="text-sm font-medium text-purple/60">Score</span>
            <span className="text-lg font-black text-purple">{score}</span>
            <span className="text-sm text-purple/40">/ {maxScore}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
