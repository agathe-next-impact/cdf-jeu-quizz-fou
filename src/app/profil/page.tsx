"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePlayer } from "@/context/PlayerContext";

interface GameStats {
  game: string;
  slug: string;
  bestScore: number;
  bestTitle: string;
  totalPlays: number;
  lastPlayed: string;
}

interface ProfileData {
  player: { id: string; pseudo: string; email: string; avatar: string; createdAt: string };
  games: GameStats[];
}

const AVATARS = [
  "🤪", "😎", "🧠", "👻", "🦊", "🐱", "🐸", "🎃",
  "🤖", "👽", "🦄", "🐧", "🎭", "🔥", "💀", "🫠",
];

const GAME_EMOJIS: Record<string, string> = {
  "DSM-6 Version Beta": "🏥",
  "Test de Rorschach": "🫠",
  "Évaluation Émotionnelle": "🧠",
  "Évasion Psychiatrique": "🏥",
  "Test de Motricité Fine": "🎯",
  "Test Cognitif Absurde": "🧠",
};

export default function ProfilPage() {
  const { player, loading: authLoading, logout, updateAvatar } = usePlayer();
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!player) {
      router.push("/connexion");
      return;
    }

    fetch(`/api/auth/profile?pseudo=${encodeURIComponent(player.pseudo)}`)
      .then((res) => res.json())
      .then((data: ProfileData) => {
        setProfile(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [player, authLoading, router]);

  if (authLoading || loading || !profile) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
        <div className="text-xl text-purple animate-pulse">Chargement du profil...</div>
      </div>
    );
  }

  const totalPlays = profile.games.reduce((sum, g) => sum + g.totalPlays, 0);
  const memberSince = new Date(profile.player.createdAt).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-[calc(100vh-80px)] px-4 py-12">
      <div className="max-w-2xl mx-auto">
        {/* Profile header */}
        <div className="card text-center mb-8 animate-slide-up">
          <div className="relative inline-block mx-auto mb-4">
            <button
              onClick={() => setShowAvatarPicker(!showAvatarPicker)}
              className="w-20 h-20 rounded-full gradient-bg flex items-center justify-center text-4xl mx-auto hover:scale-105 transition-transform"
              title="Changer d'avatar"
            >
              {profile.player.avatar || profile.player.pseudo.charAt(0).toUpperCase()}
            </button>
            <span className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center text-xs shadow border border-purple/20">
              ✏️
            </span>
          </div>
          {showAvatarPicker && (
            <div className="flex flex-wrap gap-2 justify-center mb-4 animate-slide-up">
              {AVATARS.map((a) => (
                <button
                  key={a}
                  onClick={async () => {
                    await updateAvatar(a);
                    setProfile((prev) =>
                      prev ? { ...prev, player: { ...prev.player, avatar: a } } : prev
                    );
                    setShowAvatarPicker(false);
                  }}
                  className={`text-2xl w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    profile.player.avatar === a
                      ? "bg-purple/20 ring-2 ring-purple scale-110"
                      : "bg-purple/5 hover:bg-purple/10"
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          )}
          <h1 className="text-3xl font-black gradient-text mb-1">
            {profile.player.pseudo}
          </h1>
          <p className="text-sm text-purple/50 mb-4">
            Membre depuis le {memberSince}
          </p>
          <div className="flex justify-center gap-6">
            <div className="text-center">
              <div className="text-2xl font-black text-purple">{profile.games.length}</div>
              <div className="text-xs text-purple/50 font-medium">
                {profile.games.length === 1 ? "jeu" : "jeux"}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-black text-purple">{totalPlays}</div>
              <div className="text-xs text-purple/50 font-medium">
                {totalPlays === 1 ? "partie" : "parties"}
              </div>
            </div>
          </div>
        </div>

        {/* Game stats */}
        <h2 className="text-xl font-black text-purple-dark mb-4 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          Mes classements
        </h2>

        {profile.games.length === 0 ? (
          <div className="card text-center py-10 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <div className="text-5xl mb-4">🎮</div>
            <p className="text-purple-dark/60 font-medium mb-4">
              Tu n&apos;as pas encore jou&eacute; !
            </p>
            <Link href="/" className="btn-primary inline-block">
              Choisir un jeu
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {profile.games.map((game, i) => (
              <Link
                key={game.slug}
                href={game.slug}
                className="card border-2 border-purple/10 hover:border-purple/30 flex items-center gap-4 animate-slide-up group"
                style={{ animationDelay: `${(i + 1) * 0.1}s` }}
              >
                <div className="text-4xl">{GAME_EMOJIS[game.game] ?? "🎮"}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-purple-dark group-hover:text-purple transition-colors">
                    {game.game}
                  </div>
                  <div className="text-xs text-purple/40 font-medium">
                    {game.bestTitle}
                  </div>
                  <div className="text-xs text-purple/30 mt-1">
                    {game.totalPlays} {game.totalPlays === 1 ? "partie" : "parties"} &middot; Derni&egrave;re le{" "}
                    {new Date(game.lastPlayed).toLocaleDateString("fr-FR")}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-2xl font-black text-purple">{game.bestScore}</div>
                  <div className="text-xs text-purple/30 font-medium">meilleur score</div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-center gap-4 mt-10 animate-slide-up" style={{ animationDelay: "0.4s" }}>
          <Link href="/" className="btn-secondary">
            Jouer
          </Link>
          <button
            onClick={() => {
              logout();
              router.push("/");
            }}
            className="text-sm font-semibold text-purple/50 hover:text-purple px-4 py-2 transition-colors"
          >
            Se d&eacute;connecter
          </button>
        </div>
      </div>
    </div>
  );
}
