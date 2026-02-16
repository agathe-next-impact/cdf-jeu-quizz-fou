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
  if (index === 0) return "border-black";
  if (index === 1) return "border-black";
  if (index === 2) return "border-black";
  return "bg-white border-black";
}

export default function CognitifClassementPage() {
  const [scores, setScores] = useState<PlayerScore[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/cognitif-scores")
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
            className="text-4xl md:text-5xl font-black mb-2 text-foreground"
          >
            Classement des QI
          </h1>
          <p className="text-black font-medium">
            Les cerveaux les plus (dys)fonctionnels
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-xl text-black animate-pulse">
              Compilation des résultats cérébraux...
            </div>
          </div>
        ) : scores.length === 0 ? (
          <div className="card text-center py-12 animate-slide-up">
            <div className="flex justify-center mb-4"><ClipboardList size={48} className="text-black" /></div>
            <h2 className="text-xl font-bold text-black mb-2">
              Aucun cobaye testé
            </h2>
            <p className="text-black mb-6">
              Soyez le premier à mesurer votre QI absurde
            </p>
            <Link
              href="/cognitif"
              className="inline-block font-bold text-white py-3 px-6 rounded-full transition-all hover:scale-105 bg-red"
            >
              Passer le test
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
                    <span className="text-lg font-black text-black">
                      #{index + 1}
                    </span>
                  )}
                </div>

                {/* Player info */}
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-black truncate">
                    {player.pseudo}
                  </div>
                  <div className="text-xs text-black font-medium">
                    {player.title}
                  </div>
                </div>

                {/* Score */}
                <div className="text-right shrink-0">
                  <div
                    className={`text-2xl font-black ${
                      player.score >= 145
                        ? "text-red"
                        : player.score >= 130
                          ? "text-blue"
                          : player.score >= 115
                            ? "text-blue"
                            : player.score >= 100
                              ? "text-black"
                              : "text-yellow"
                    }`}
                  >
                    QI {player.score}
                  </div>
                  <div className="text-xs text-black font-medium">
                    points
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Back button */}
        <div className="text-center mt-10">
          <Link href="/cognitif" className="btn-secondary inline-block">
            Retour au jeu
          </Link>
        </div>
      </div>
    </div>
  );
}
