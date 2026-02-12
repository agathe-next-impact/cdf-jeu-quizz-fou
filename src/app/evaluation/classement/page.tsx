"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Medal, Brain, ClipboardList } from "lucide-react";

interface PlayerScore {
  pseudo: string;
  score: number;
  title: string;
  date: string;
}

const MEDAL_COLORS = ["text-yellow", "text-black/60", "text-yellow/70"];

function getRowBg(index: number): string {
  if (index === 0) return "border-blue";
  if (index === 1) return "border-blue";
  if (index === 2) return "border-blue";
  return "bg-white border-blue";
}

export default function EvaluationClassementPage() {
  const [scores, setScores] = useState<PlayerScore[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/evaluation-scores")
      .then((res) => res.json())
      .then((data: PlayerScore[]) => {
        setScores(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center px-4 py-12">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-10 animate-slide-up">
          <div className="flex justify-center mb-4"><Brain size={48} className="text-black" /></div>
          <h1
            className="text-4xl md:text-5xl font-black mb-2 text-blue"
          >
            Classement des Patients
          </h1>
          <p className="text-black font-medium">
            Les psychés les plus perturbées
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-xl text-blue animate-pulse">
              Consultation des dossiers...
            </div>
          </div>
        ) : scores.length === 0 ? (
          <div className="card text-center py-12 animate-slide-up">
            <div className="flex justify-center mb-4"><ClipboardList size={48} className="text-black" /></div>
            <h2 className="text-xl font-bold text-black mb-2">
              Aucun patient évalué
            </h2>
            <p className="text-blue mb-6">
              Soyez le premier cas du registre
            </p>
            <Link
              href="/evaluation"
              className="inline-block font-bold text-white py-3 px-6 rounded-full transition-all hover:scale-105 bg-blue"
            >
              Passer l&apos;évaluation
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {scores.map((player, index) => (
              <div
                key={`${player.pseudo}-${player.date}`}
                className={`flex items-center gap-4 p-4 rounded-2xl border transition-all hover:scale-[1.01] ${getRowBg(index)} animate-slide-up`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {/* Rank */}
                <div className="w-12 text-center shrink-0">
                  {index < 3 ? (
                    <Medal size={24} className={MEDAL_COLORS[index]} />
                  ) : (
                    <span className="text-lg font-black text-blue">
                      #{index + 1}
                    </span>
                  )}
                </div>

                {/* Player info */}
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-black truncate">
                    {player.pseudo}
                  </div>
                  <div className="text-xs text-blue font-medium">
                    {player.title}
                  </div>
                </div>

                {/* Score */}
                <div className="text-right shrink-0">
                  <div className="text-2xl font-black text-blue">
                    {player.score}
                  </div>
                  <div className="text-xs text-blue font-medium">
                    pts
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Back button */}
        <div className="text-center mt-10">
          <Link href="/evaluation" className="btn-secondary inline-block">
            Retour à l&apos;évaluation
          </Link>
        </div>
      </div>
    </div>
  );
}
