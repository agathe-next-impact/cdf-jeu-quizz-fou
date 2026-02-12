"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Confetti from "@/components/Confetti";
import RegisterInvite from "@/components/RegisterInvite";
import GameIcon from "@/components/GameIcon";
import {
  evaluationQuestions,
  getEvaluationProfile,
} from "@/data/evaluation-questions";

interface ScoreResult {
  pseudo: string;
  score: number;
  title: string;
  date: string;
}

interface DiagnosisEntry {
  diagnosis: string;
  severity: string;
  explanation: string;
}

export default function EvaluationResultsPage() {
  const router = useRouter();
  const [result, setResult] = useState<ScoreResult | null>(null);
  const [diagnoses, setDiagnoses] = useState<DiagnosisEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const hasSaved = useRef(false);

  const maxScore = evaluationQuestions.length * 30;

  useEffect(() => {
    if (hasSaved.current) return;

    const pseudo = sessionStorage.getItem("evaluation-pseudo");
    const scoreStr = sessionStorage.getItem("evaluation-score");
    const diagnosesRaw = sessionStorage.getItem("evaluation-diagnoses");

    if (!pseudo || !scoreStr) {
      router.push("/evaluation");
      return;
    }

    hasSaved.current = true;

    const score = parseInt(scoreStr, 10);
    const answersRaw = sessionStorage.getItem("evaluation-answers");
    let answers: unknown[] = [];
    try {
      answers = answersRaw ? JSON.parse(answersRaw) : [];
    } catch {
      /* ignore */
    }

    let parsedDiagnoses: DiagnosisEntry[] = [];
    try {
      parsedDiagnoses = diagnosesRaw ? JSON.parse(diagnosesRaw) : [];
    } catch {
      /* ignore */
    }
    setDiagnoses(parsedDiagnoses);

    async function saveScore() {
      for (const payload of [
        { pseudo, score, answers },
        { pseudo, score, answers: [] },
      ]) {
        try {
          const res = await fetch("/api/evaluation-scores", {
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
      const profile = getEvaluationProfile(score, maxScore);
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
  }, [router, maxScore]);

  if (loading || !result) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
        <div className="text-xl text-blue animate-pulse">
          Rédaction du rapport psychiatrique...
        </div>
      </div>
    );
  }

  const percentage = Math.round((result.score / maxScore) * 100);
  const profile = getEvaluationProfile(result.score, maxScore);

  function getSeverityColor(sev: string): string {
    if (["CRITIQUE", "EXPLOSIF", "TOXIQUE", "DANGEREUX"].includes(sev))
      return "bg-red";
    if (["ALARMANT", "GRAVE", "AIGU", "PATHOLOGIQUE"].includes(sev))
      return "bg-yellow";
    return "bg-yellow";
  }

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-4 py-12">
      {showConfetti && <Confetti />}

      <div className="max-w-lg w-full text-center animate-slide-up">
        {/* Emoji */}
        <div className="mb-6 animate-bounce-in flex justify-center"><GameIcon name={profile.emoji} size={80} /></div>

        {/* Title */}
        <div className="inline-block text-blue text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
          Rapport Psychiatrique Complet
        </div>
        <h1
          className="text-3xl md:text-4xl font-black mb-1 leading-tight text-blue"
        >
          {profile.title}
        </h1>
        <p className="text-sm font-semibold text-blue mb-2">
          {profile.subtitle}
        </p>

        {/* Pseudo */}
        <p className="text-lg text-black font-medium mb-6">
          Patient : {result.pseudo}
        </p>

        {/* Description */}
        <div className="card mb-6 border border-blue">
          <p className="text-sm text-black leading-relaxed italic">
            &laquo; {profile.description} &raquo;
          </p>
        </div>

        {/* Score card */}
        <div className="card mb-6">
          <div className="mb-6">
            <div className="text-5xl font-black text-blue mb-1">
              {result.score}
            </div>
            <div className="text-sm text-blue font-medium">
              points sur {maxScore}
            </div>
          </div>

          {/* Score bar */}
          <div className="w-full rounded-full h-4 overflow-hidden mb-4">
            <div
              className="h-full rounded-full transition-all duration-1000 ease-out bg-blue"
              style={{
                width: `${percentage}%`,
              }}
            />
          </div>
          <div className="text-sm font-bold text-blue">
            Indice de pathologie : {percentage}%
          </div>
        </div>

        {/* Psychiatric report — diagnoses list */}
        {diagnoses.length > 0 && (
          <div className="card mb-6 border border-red text-left">
            <h2 className="text-lg font-black text-red mb-4 text-center">
              Troubles identifiés
            </h2>
            <div className="space-y-3">
              {diagnoses.map((d, i) => (
                <div
                  key={i}
                  className="rounded-xl p-4 border border-red"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-red">
                      {i + 1}. {d.diagnosis}
                    </span>
                    <span
                      className={`${getSeverityColor(d.severity)} text-white text-[10px] font-bold px-2 py-0.5 rounded-full`}
                    >
                      {d.severity}
                    </span>
                  </div>
                  <p className="text-xs text-red leading-relaxed">
                    {d.explanation}
                  </p>
                </div>
              ))}
            </div>
            <p className="text-center text-sm font-bold text-red mt-4">
              CONCLUSION : Vous souffrez de {diagnoses.length} pathologies
              émotionnelles graves.
            </p>
            <p className="text-center text-xs text-red mt-2">
              Recommandation : Consultez immédiatement un professionnel
              imaginaire.
            </p>
          </div>
        )}

        {/* Register invite */}
        <RegisterInvite />

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => {
              sessionStorage.removeItem("evaluation-score");
              sessionStorage.removeItem("evaluation-answers");
              sessionStorage.removeItem("evaluation-diagnoses");
              router.push("/evaluation/quiz");
            }}
            className="font-bold text-white py-3 px-6 rounded-full transition-all hover:scale-105 bg-blue"
          >
            Nouvelle consultation
          </button>
          <Link
            href="/evaluation/classement"
            className="btn-secondary text-center"
          >
            Classement des patients
          </Link>
        </div>

        <p className="mt-8 text-xs text-blue italic">
          * Ce test est une parodie satirique. Toute ressemblance avec de vrais
          diagnostics est volontairement ridicule. Partagez-le pour alarmer vos
          proches.
        </p>
      </div>
    </div>
  );
}
