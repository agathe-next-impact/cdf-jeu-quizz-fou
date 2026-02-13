"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  evasionQuestions,
  EVASION_STARTING_DAYS,
} from "@/data/evasion-questions";

export default function EvasionQuizPage() {
  const router = useRouter();
  const [pseudo, setPseudo] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [totalDays, setTotalDays] = useState(EVASION_STARTING_DAYS);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [lastPoints, setLastPoints] = useState(0);
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
    const stored = sessionStorage.getItem("evasion-pseudo");
    if (!stored) {
      router.push("/evasion");
      return;
    }
    setPseudo(stored);
  }, [router]);

  const handleAnswer = useCallback(
    (answerIndex: number) => {
      if (showFeedback) return;

      const q = evasionQuestions[currentQuestion];
      const choice = q.choices[answerIndex];
      setSelectedAnswer(answerIndex);
      setLastPoints(choice.points);
      setShowFeedback(true);

      const newDays = Math.max(0, totalDays + choice.points);
      setTotalDays(newDays);

      const newAnswer = {
        questionId: q.id,
        question: q.question,
        answerIndex,
        answerText: choice.text,
        points: choice.points,
      };
      const updatedAnswers = [...playerAnswers, newAnswer];
      setPlayerAnswers(updatedAnswers);

      setTimeout(() => {
        if (currentQuestion < evasionQuestions.length - 1) {
          setCurrentQuestion((prev) => prev + 1);
          setSelectedAnswer(null);
          setShowFeedback(false);
          setLastPoints(0);
        } else {
          sessionStorage.setItem("evasion-score", String(newDays));
          sessionStorage.setItem(
            "evasion-answers",
            JSON.stringify(updatedAnswers)
          );
          router.push("/evasion/results");
        }
      }, 2000);
    },
    [currentQuestion, router, totalDays, showFeedback, playerAnswers]
  );

  if (!pseudo) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
        <div className="text-xl text-blue animate-pulse">
          Le Dr. Moreau vous attend...
        </div>
      </div>
    );
  }

  const question = evasionQuestions[currentQuestion];
  const progress =
    ((currentQuestion + 1) / evasionQuestions.length) * 100;

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center px-4 py-8">
      <div className="max-w-2xl w-full">
        {/* Progress bar */}
        <div className="mb-6 animate-slide-up">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-bold text-yellow">
              Scène {currentQuestion + 1}/{evasionQuestions.length}
            </span>
            <span className="text-sm font-bold text-yellow">
              Patient {pseudo}
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

        {/* Days counter */}
        <div className="text-center mb-6 animate-slide-up">
          <div
            className={`inline-flex items-center gap-3 px-6 py-3 rounded-full border transition-all duration-300 ${
              totalDays <= 10
                ? "border-blue text-blue"
                : totalDays <= 30
                  ? "border-blue text-blue"
                  : totalDays <= 50
                    ? "border-yellow text-yellow"
                    : "border-red text-red"
            }`}
          >
            <span className="text-sm font-medium">
              Jours avant la sortie :
            </span>
            <span className="text-2xl font-black">{totalDays}</span>
          </div>

          {showFeedback && (
            <div
              className={`mt-2 text-sm font-bold animate-bounce-in ${
                lastPoints < 0 ? "text-blue" : "text-red"
              }`}
            >
              {lastPoints < 0
                ? `${lastPoints} jours`
                : `+${lastPoints} jours`}
            </div>
          )}
        </div>

        {/* Story narrative */}
        <div
          key={question.id}
          className="card mb-6 animate-slide-up border border-black bg-white"
        >
          <p className="text-sm text-black leading-relaxed italic mb-4">
            {question.story}
          </p>
          <div className="border-t border-black pt-4">
            <p className="text-base font-bold text-blue">
              <span className="text-blue">Dr. Moreau :</span>{" "}
              &laquo; {question.question} &raquo;
            </p>
          </div>
        </div>

        {/* Choice buttons */}
        <div className="grid gap-3">
          {question.choices.map((choice, index) => {
            const isSelected = selectedAnswer === index;

            let bgClass =
              "bg-white border border-black hover:border-black";
            if (showFeedback && isSelected) {
              bgClass =
                lastPoints < 0
                  ? "border border-blue scale-[1.02]"
                  : "border border-red scale-[1.02]";
            }

            return (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                disabled={showFeedback}
                className={`${bgClass} rounded-2xl px-6 py-4 text-left transition-all duration-300 cursor-pointer disabled:cursor-default flex items-center gap-4 animate-slide-up`}
                style={{ animationDelay: `${index * 0.08}s` }}
              >
                <span
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-red text-sm shrink-0"
                >
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="font-semibold text-black flex-1">
                  {choice.text}
                </span>
                {showFeedback && isSelected && (
                  <span
                    className={`text-sm font-bold animate-bounce-in ${
                      lastPoints < 0 ? "text-blue" : "text-red"
                    }`}
                  >
                    {lastPoints < 0 ? `${lastPoints}j` : `+${lastPoints}j`}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
