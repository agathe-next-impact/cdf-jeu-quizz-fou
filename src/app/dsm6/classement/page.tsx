"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Medal, Hospital, ClipboardList } from "lucide-react";

interface PlayerScore {
  pseudo: string;
  score: number;
  title: string;
  date: string;
}

const MEDAL_COLORS = ["text-yellow", "text-black/60", "text-yellow/70"];

function getRowBg(index: number): string {
  if (index === 0) return "border-red";
  if (index === 1) return "border-black";
  if (index === 2) return "border-yellow";
  return "bg-white border-blue";
}

export default function DSM6ClassementPage() {
  const [scores, setScores] = useState<PlayerScore[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dsm6-scores")
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
          <div className="flex justify-center mb-4"><Hospital size={48} className="text-black" /></div>
          <h1 className="text-4xl md:text-5xl font-black mb-2 text-foreground">
            Classement DSM-6
          </h1>
          <p className="text-black font-medium">
            Les cas les plus remarquables du service
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-xl text-black animate-pulse">
              Consultation des dossiers...
            </div>
          </div>
        ) : scores.length === 0 ? (
          <div className="card text-center py-12 animate-slide-up">
            <div className="flex justify-center mb-4"><ClipboardList size={48} className="text-black" /></div>
            <h2 className="text-xl font-bold text-black mb-2">
              Aucun patient enregistré
            </h2>
            <p className="text-black mb-6">
              Soyez le premier cas clinique du registre
            </p>
            <Link href="/dsm6" className="btn-primary inline-block">
              Passer le diagnostic
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
                  <div className="text-2xl font-black text-black">
                    {player.score}
                  </div>
                  <div className="text-xs text-black font-medium">pts</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Back button */}
        <div className="text-center mt-10">
          <Link href="/dsm6" className="btn-secondary inline-block">
            Retour au diagnostic
          </Link>
        </div>
      </div>
    </div>
  );
}
