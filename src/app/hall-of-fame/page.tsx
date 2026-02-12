"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface BadgeData {
  name: string;
  emoji: string;
  minScore: number;
  color: string;
}

interface HallEntry {
  pseudo: string;
  avatar: string;
  globalScore: number;
  gamesPlayed: number;
  badge: BadgeData;
}

const MEDAL_EMOJIS = ["🥇", "🥈", "🥉"];

function getRowBg(index: number): string {
  if (index === 0) return "bg-yellow-50 border-yellow-300";
  if (index === 1) return "bg-gray-50 border-gray-200";
  if (index === 2) return "bg-orange-50 border-orange-200";
  return "bg-white border-purple/5";
}

export default function HallOfFamePage() {
  const [entries, setEntries] = useState<HallEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/hall-of-fame")
      .then((res) => res.json())
      .then((data: HallEntry[]) => {
        setEntries(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center px-4 py-12">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-10 animate-slide-up">
          <div className="text-5xl mb-4">🏆</div>
          <h1
            className="text-4xl md:text-5xl font-black mb-2"
            style={{
              background: "linear-gradient(135deg, #d97706, #7c3aed)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Hall of Fame
          </h1>
          <p className="text-purple-dark/60 font-medium">
            Les 10 patients les plus fous de l&apos;asile
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-xl text-purple animate-pulse">
              Consultation des archives...
            </div>
          </div>
        ) : entries.length === 0 ? (
          <div className="card text-center py-12 animate-slide-up">
            <div className="text-5xl mb-4">👻</div>
            <h2 className="text-xl font-bold text-purple-dark mb-2">
              L&apos;asile est vide
            </h2>
            <p className="text-purple/50 mb-6">
              Aucun patient n&apos;a encore jou&eacute;. Sois le premier !
            </p>
            <Link href="/" className="btn-primary inline-block">
              Choisir un jeu
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {entries.map((entry, index) => (
              <div
                key={entry.pseudo}
                className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all hover:scale-[1.01] ${getRowBg(index)} animate-slide-up`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {/* Rank */}
                <div className="w-12 text-center shrink-0">
                  {index < 3 ? (
                    <span className="text-2xl">{MEDAL_EMOJIS[index]}</span>
                  ) : (
                    <span className="text-lg font-black text-purple/40">
                      #{index + 1}
                    </span>
                  )}
                </div>

                {/* Avatar */}
                <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center text-xl shrink-0">
                  {entry.avatar}
                </div>

                {/* Player info */}
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-purple-dark truncate">
                    {entry.pseudo}
                  </div>
                  <div className={`inline-flex items-center gap-1 text-xs font-semibold ${entry.badge.color}`}>
                    <span>{entry.badge.emoji}</span>
                    <span>{entry.badge.name}</span>
                  </div>
                  <div className="text-xs text-purple/30 mt-0.5">
                    {entry.gamesPlayed} {entry.gamesPlayed === 1 ? "jeu" : "jeux"}
                  </div>
                </div>

                {/* Score */}
                <div className="text-right shrink-0">
                  <div className="text-2xl font-black text-purple">
                    {entry.globalScore}
                  </div>
                  <div className="text-xs text-purple/30 font-medium">pts</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Back button */}
        <div className="text-center mt-10">
          <Link href="/" className="btn-secondary inline-block">
            Retour aux jeux
          </Link>
        </div>
      </div>
    </div>
  );
}
