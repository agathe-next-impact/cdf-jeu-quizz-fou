"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface PlayerScore {
  pseudo: string;
  score: number;
  title: string;
  date: string;
}

const MEDAL_EMOJIS = ["🥇", "🥈", "🥉"];

function getRowBg(index: number): string {
  if (index === 0) return "bg-[#1e3c72]/10 border-[#1e3c72]/30";
  if (index === 1) return "bg-[#1e3c72]/5 border-[#1e3c72]/20";
  if (index === 2) return "bg-[#1e3c72]/[0.03] border-[#1e3c72]/10";
  return "bg-white border-[#1e3c72]/5";
}

export default function EvasionClassementPage() {
  const [scores, setScores] = useState<PlayerScore[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/evasion-scores")
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
          <div className="text-5xl mb-4">🏥</div>
          <h1
            className="text-4xl md:text-5xl font-black mb-2"
            style={{
              background: "linear-gradient(135deg, #1e3c72, #2a5298)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Classement des Patients
          </h1>
          <p className="text-purple-dark/60 font-medium">
            Les internements les plus longs
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-xl text-[#1e3c72] animate-pulse">
              Consultation des dossiers...
            </div>
          </div>
        ) : scores.length === 0 ? (
          <div className="card text-center py-12 animate-slide-up">
            <div className="text-5xl mb-4">📋</div>
            <h2 className="text-xl font-bold text-purple-dark mb-2">
              Aucun patient évalué
            </h2>
            <p className="text-purple/50 mb-6">
              Soyez le premier à affronter le Dr. Moreau
            </p>
            <Link
              href="/evasion"
              className="inline-block font-bold text-white py-3 px-6 rounded-full transition-all hover:scale-105"
              style={{
                background: "linear-gradient(135deg, #1e3c72, #2a5298)",
              }}
            >
              Commencer l&apos;évaluation
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {scores.map((player, index) => (
              <div
                key={`${player.pseudo}-${player.date}`}
                className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all hover:scale-[1.01] ${getRowBg(index)} animate-slide-up`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {/* Rank */}
                <div className="w-12 text-center shrink-0">
                  {index < 3 ? (
                    <span className="text-2xl">{MEDAL_EMOJIS[index]}</span>
                  ) : (
                    <span className="text-lg font-black text-[#1e3c72]/40">
                      #{index + 1}
                    </span>
                  )}
                </div>

                {/* Player info */}
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-purple-dark truncate">
                    {player.pseudo}
                  </div>
                  <div className="text-xs text-[#1e3c72]/40 font-medium">
                    {player.title}
                  </div>
                </div>

                {/* Score */}
                <div className="text-right shrink-0">
                  <div
                    className={`text-2xl font-black ${
                      player.score <= 10
                        ? "text-green-600"
                        : player.score <= 30
                          ? "text-[#1e3c72]"
                          : player.score <= 50
                            ? "text-orange"
                            : "text-red-600"
                    }`}
                  >
                    {player.score}
                  </div>
                  <div className="text-xs text-[#1e3c72]/30 font-medium">
                    jours
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Back button */}
        <div className="text-center mt-10">
          <Link href="/evasion" className="btn-secondary inline-block">
            Retour au jeu
          </Link>
        </div>
      </div>
    </div>
  );
}
