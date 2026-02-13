"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import GameIcon from "@/components/GameIcon";
import { Trophy, Ghost, Medal } from "lucide-react";

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

interface GameLeaderboardEntry {
  pseudo: string;
  score: number;
  title: string;
}

interface GameLeaderboard {
  game: string;
  emoji: string;
  slug: string;
  entries: GameLeaderboardEntry[];
}

const MEDAL_COLORS = ["text-yellow", "text-black/60", "text-yellow/70"];

function getRowBg(index: number): string {
  if (index === 0) return "border-yellow";
  if (index === 1) return "border-black";
  if (index === 2) return "border-yellow";
  return "bg-white border-blue";
}

function getGameRowBg(index: number): string {
  if (index === 0) return "border-yellow";
  if (index === 1) return "border-black";
  if (index === 2) return "border-yellow";
  return "border-blue";
}

export default function HallOfFamePage() {
  const [entries, setEntries] = useState<HallEntry[]>([]);
  const [perGame, setPerGame] = useState<GameLeaderboard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/hall-of-fame")
      .then((res) => res.json())
      .then((data: { global: HallEntry[]; perGame: GameLeaderboard[] }) => {
        setEntries(data.global);
        setPerGame(data.perGame);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center px-4 py-12">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-10 animate-slide-up">
          <div className="flex justify-center mb-4"><Trophy size={48} className="text-black" /></div>
          <h1
            className="text-4xl md:text-5xl font-black text-black mb-2"
          >
            Hall of Fame
          </h1>
          <p className="text-black font-medium">
            Les patients les plus fous de l&apos;asile
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-xl text-black animate-pulse">
              Consultation des archives...
            </div>
          </div>
        ) : entries.length === 0 && perGame.every((g) => g.entries.length === 0) ? (
          <div className="card text-center py-12 animate-slide-up">
            <div className="flex justify-center mb-4"><Ghost size={48} className="text-black" /></div>
            <h2 className="text-xl font-bold text-black mb-2">
              L&apos;asile est vide
            </h2>
            <p className="text-black mb-6">
              Aucun patient n&apos;a encore joué. Sois le premier !
            </p>
            <Link href="/" className="btn-primary inline-block">
              Choisir un jeu
            </Link>
          </div>
        ) : (
          <>
            {/* ======== GLOBAL TOP 10 ======== */}
            {entries.length > 0 && (
              <section className="mb-14">
                <h2 className="text-2xl font-black text-black mb-5 text-center animate-slide-up">
                  Classement Global
                </h2>
                <div className="space-y-3">
                  {entries.map((entry, index) => (
                    <div
                      key={entry.pseudo}
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

                      {/* Avatar */}
                      <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center shrink-0">
                        <GameIcon name={entry.avatar} size={22} />
                      </div>

                      {/* Player info */}
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-black truncate">
                          {entry.pseudo}
                        </div>
                        <div className={`inline-flex items-center gap-1 text-xs font-semibold ${entry.badge.color}`}>
                          <span><GameIcon name={entry.badge.emoji} size={16} /></span>
                          <span>{entry.badge.name}</span>
                        </div>
                        <div className="text-xs text-black mt-0.5">
                          {entry.gamesPlayed} {entry.gamesPlayed === 1 ? "jeu" : "jeux"}
                        </div>
                      </div>

                      {/* Score */}
                      <div className="text-right shrink-0">
                        <div className="text-2xl font-black text-black">
                          {entry.globalScore}<span className="text-sm font-bold text-black">/100</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ======== PER-GAME TOP 5 ======== */}
            <section>
              <h2 className="text-2xl font-black text-black mb-6 text-center animate-slide-up">
                Hall of Fame par jeu
              </h2>
              <div className="grid sm:grid-cols-2 gap-6">
                {perGame.map((game, gi) => (
                  <div
                    key={game.slug}
                    className="card border border-blue animate-slide-up"
                    style={{ animationDelay: `${gi * 0.08}s` }}
                  >
                    {/* Game header */}
                    <div className="flex items-center gap-2 mb-4">
                      <span className="flex items-center"><GameIcon name={game.emoji} size={24} /></span>
                      <h3 className="text-lg font-black text-black leading-tight">
                        {game.game}
                      </h3>
                    </div>

                    {game.entries.length === 0 ? (
                      <p className="text-sm text-black italic">
                        Aucun score enregistré
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {game.entries.map((entry, index) => (
                          <div
                            key={entry.pseudo}
                            className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all ${getGameRowBg(index)}`}
                          >
                            {/* Rank */}
                            <div className="w-8 text-center shrink-0">
                              {index < 3 ? (
                                <Medal size={20} className={MEDAL_COLORS[index]} />
                              ) : (
                                <span className="text-sm font-black text-black">
                                  #{index + 1}
                                </span>
                              )}
                            </div>

                            {/* Player info */}
                            <div className="flex-1 min-w-0">
                              <div className="font-bold text-sm text-black truncate">
                                {entry.pseudo}
                              </div>
                              <div className="text-xs text-black truncate">
                                {entry.title}
                              </div>
                            </div>

                            {/* Score */}
                            <div className="text-right shrink-0">
                              <div className="text-lg font-black text-black">
                                {entry.score}
                              </div>
                              <div className="text-[10px] text-black font-medium">pts</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Link to full leaderboard */}
                    <div className="mt-3 text-center">
                      <Link
                        href={`${game.slug}/classement`}
                        className="text-xs font-semibold text-blue hover:text-blue transition-colors"
                      >
                        Voir le classement complet &rarr;
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
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
