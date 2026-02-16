"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Hospital, ClipboardList, Check } from "lucide-react";
import { dsm6Questions } from "@/data/dsm6-questions";

export default function DSM6QuizPage() {
  const router = useRouter();
  const [pseudo, setPseudo] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [answeredPoints, setAnsweredPoints] = useState(0);
  const [playerAnswers, setPlayerAnswers] = useState<
    { questionId: number; question: string; answerIndex: number; answerText: string; points: number }[]
  >([]);

  useEffect(() => {
    const stored = sessionStorage.getItem("dsm6-pseudo");
    if (!stored) {
      router.push("/dsm6");
      return;
    }
    setPseudo(stored);
  }, [router]);

  const handleAnswer = useCallback(
    (answerIndex: number) => {
      if (showFeedback) return;

      const q = dsm6Questions[currentQuestion];
      const answer = q.answers[answerIndex];
      const points = answer.points;
      setSelectedAnswer(answerIndex);
      setAnsweredPoints(points);
      setShowFeedback(true);
      setScore((prev) => prev + points);

      const newAnswer = {
        questionId: q.id,
        question: q.question,
        answerIndex,
        answerText: answer.text,
        points,
      };
      const updatedAnswers = [...playerAnswers, newAnswer];
      setPlayerAnswers(updatedAnswers);

      setTimeout(() => {
        if (currentQuestion < dsm6Questions.length - 1) {
          setCurrentQuestion((prev) => prev + 1);
          setSelectedAnswer(null);
          setShowFeedback(false);
          setAnsweredPoints(0);
        } else {
          const finalScore = score + points;
          sessionStorage.setItem("dsm6-score", String(finalScore));
          sessionStorage.setItem("dsm6-answers", JSON.stringify(updatedAnswers));
          router.push("/dsm6/results");
        }
      }, 1200);
    },
    [currentQuestion, router, score, showFeedback, playerAnswers]
  );

  if (!pseudo) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
        <div className="text-xl text-blue animate-pulse">Chargement du dossier patient...</div>
      </div>
    );
  }

  const question = dsm6Questions[currentQuestion];
  const progress = ((currentQuestion + 1) / dsm6Questions.length) * 100;
  const maxScore = dsm6Questions.length * 30;

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center px-4 py-8">
      <div className="max-w-2xl w-full">
        {/* Progress bar */}
        <div className="mb-6 animate-slide-up">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-bold text-yellow">
              Question {currentQuestion + 1}/{dsm6Questions.length}
            </span>
            <span className="text-sm font-bold text-yellow">
              Patient {pseudo} — {score} pts
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

        {/* Section badge */}
        <div className="flex justify-center mb-4">
          <span className="text-red px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            {question.section}
          </span>
        </div>

        {/* Question card */}
        <div key={question.id} className="card mb-6 text-center animate-slide-up border border-black">
          <h2 className="text-xl md:text-2xl font-black text-black leading-snug">
            {question.question}
          </h2>
        </div>

        {/* Answer buttons */}
        <div className="grid gap-3">
          {question.answers.map((answer, index) => {
            const isSelected = selectedAnswer === index;
            const isHighPoints = showFeedback && isSelected && answeredPoints >= 25;
            const isMedPoints = showFeedback && isSelected && answeredPoints >= 10 && answeredPoints < 25;
            const isLowPoints = showFeedback && isSelected && answeredPoints < 10;

            let bgClass = "bg-white border border-black hover:border-black";
            if (isHighPoints) bgClass = "border border-red scale-[1.02]";
            if (isMedPoints) bgClass = "border border-yellow scale-[1.02]";
            if (isLowPoints) bgClass = "border border-blue scale-[1.02]";

            return (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                disabled={showFeedback}
                className={`${bgClass} rounded-2xl px-6 py-4 text-left transition-all duration-300 cursor-pointer disabled:cursor-default flex items-center gap-4 animate-slide-up`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <span className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-red text-sm shrink-0">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="font-semibold text-black flex-1">
                  {answer.text}
                </span>
                {showFeedback && isSelected && (
                  <span className="text-sm font-bold animate-bounce-in">
                    {answeredPoints >= 25 ? <Hospital size={20} /> : answeredPoints >= 10 ? <ClipboardList size={20} /> : <Check size={20} />} +{answeredPoints}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Score bar */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full">
            <span className="text-sm font-medium text-yellow">Indice de folie</span>
            <span className="text-lg font-black text-yellow">{score}</span>
            <span className="text-sm text-yellow">/ {maxScore}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
