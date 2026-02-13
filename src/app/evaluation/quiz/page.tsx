"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import GameIcon from "@/components/GameIcon";
import { evaluationQuestions } from "@/data/evaluation-questions";

export default function EvaluationQuizPage() {
  const router = useRouter();
  const [pseudo, setPseudo] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [answeredPoints, setAnsweredPoints] = useState(0);
  const [diagnosis, setDiagnosis] = useState("");
  const [severity, setSeverity] = useState("");
  const [explanation, setExplanation] = useState("");
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
    const stored = sessionStorage.getItem("evaluation-pseudo");
    if (!stored) {
      router.push("/evaluation");
      return;
    }
    setPseudo(stored);
  }, [router]);

  const handleAnswer = useCallback(
    (answerIndex: number) => {
      if (showFeedback) return;

      const q = evaluationQuestions[currentQuestion];
      const answer = q.answers[answerIndex];
      setSelectedAnswer(answerIndex);
      setAnsweredPoints(answer.points);
      setDiagnosis(answer.diagnosis);
      setSeverity(answer.severity);
      setExplanation(answer.explanation);
      setShowFeedback(true);
      setScore((prev) => prev + answer.points);

      const newAnswer = {
        questionId: q.id,
        question: q.question,
        answerIndex,
        answerText: answer.text,
        points: answer.points,
      };
      const updatedAnswers = [...playerAnswers, newAnswer];
      setPlayerAnswers(updatedAnswers);

      // Store diagnoses for the final report
      const storedDiagnoses = sessionStorage.getItem("evaluation-diagnoses");
      const diagnoses = storedDiagnoses ? JSON.parse(storedDiagnoses) : [];
      diagnoses.push({
        diagnosis: answer.diagnosis,
        severity: answer.severity,
        explanation: answer.explanation,
      });
      sessionStorage.setItem("evaluation-diagnoses", JSON.stringify(diagnoses));

      setTimeout(() => {
        if (currentQuestion < evaluationQuestions.length - 1) {
          setCurrentQuestion((prev) => prev + 1);
          setSelectedAnswer(null);
          setShowFeedback(false);
          setAnsweredPoints(0);
          setDiagnosis("");
          setSeverity("");
          setExplanation("");
        } else {
          const finalScore = score + answer.points;
          sessionStorage.setItem("evaluation-score", String(finalScore));
          sessionStorage.setItem(
            "evaluation-answers",
            JSON.stringify(updatedAnswers)
          );
          router.push("/evaluation/results");
        }
      }, 3500);
    },
    [currentQuestion, router, score, showFeedback, playerAnswers]
  );

  if (!pseudo) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
        <div className="text-xl text-blue animate-pulse">
          Préparation de la consultation...
        </div>
      </div>
    );
  }

  const question = evaluationQuestions[currentQuestion];
  const progress =
    ((currentQuestion + 1) / evaluationQuestions.length) * 100;
  const maxScore = evaluationQuestions.length * 30;

  function getSeverityColor(sev: string): string {
    if (["CRITIQUE", "EXPLOSIF", "TOXIQUE", "DANGEREUX"].includes(sev))
      return "bg-red";
    if (["ALARMANT", "GRAVE", "AIGU", "PATHOLOGIQUE"].includes(sev))
      return "bg-yellow";
    return "bg-yellow";
  }

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center px-4 py-8">
      <div className="max-w-2xl w-full">
        {/* Progress bar */}
        <div className="mb-6 animate-slide-up">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-bold text-yellow">
              Question {currentQuestion + 1}/{evaluationQuestions.length}
            </span>
            <span className="text-sm font-bold text-yellow">
              Patient {pseudo} &mdash; {score} pts
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

        {/* Emoji display */}
        <div
          key={question.id}
          className="card mb-6 text-center animate-slide-up border border-black bg-white"
        >
          <div className="flex justify-center my-6 animate-float">
            <GameIcon name={question.emoji} size={120} />
          </div>
          <h2 className="text-xl font-black text-black">
            {question.question}
          </h2>
        </div>

        {/* Answer buttons */}
        <div className="grid gap-3">
          {question.answers.map((answer, index) => {
            const isSelected = selectedAnswer === index;

            let bgClass =
              "bg-white border border-black hover:border-black";
            if (showFeedback && isSelected) {
              bgClass =
                "border border-red scale-[1.02]";
            }

            return (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                disabled={showFeedback}
                className={`${bgClass} rounded-2xl px-6 py-4 text-left transition-all duration-300 cursor-pointer disabled:cursor-default flex items-center gap-4 animate-slide-up`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <span
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm shrink-0 bg-blue"
                >
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="font-semibold text-black flex-1">
                  {answer.text}
                </span>
                {showFeedback && isSelected && (
                  <span className="text-sm font-bold animate-bounce-in">
                    +{answeredPoints}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Diagnostic feedback */}
        {showFeedback && diagnosis && (
          <div className="mt-4 animate-shake">
            <div className="card border border-red">
              <h3 className="text-lg font-black text-red mb-2">
                Diagnostic instantané
              </h3>
              <p className="text-sm font-bold text-red mb-2">
                {diagnosis}
              </p>
              <p className="text-sm text-red leading-relaxed mb-3">
                {explanation}
              </p>
              <div
                className={`${getSeverityColor(severity)} text-white text-xs font-bold px-3 py-1.5 rounded-full inline-block`}
              >
                Sévérité : {severity}
              </div>
            </div>
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
