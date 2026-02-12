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

interface BadgeData {
  name: string;
  emoji: string;
  minScore: number;
  color: string;
}

interface ProfileData {
  player: { id: string; pseudo: string; email: string; avatar: string; createdAt: string; madnessSince: string; bio: string; autodiagnostic: string };
  games: GameStats[];
  globalScore: number;
  badge: BadgeData;
  nextBadge: BadgeData | null;
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
  const { player, loading: authLoading, logout, updateAvatar, updateProfile, updateBadge } = usePlayer();
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [editingBio, setEditingBio] = useState(false);
  const [editingMadness, setEditingMadness] = useState(false);
  const [editingDiag, setEditingDiag] = useState(false);
  const [bioValue, setBioValue] = useState("");
  const [madnessValue, setMadnessValue] = useState("");
  const [diagValue, setDiagValue] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!player) {
      router.push("/connexion");
      return;
    }

    fetch(`/api/auth/profile?pseudo=${encodeURIComponent(player.pseudo)}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Profile API ${res.status}`);
        return res.json();
      })
      .then((data: ProfileData) => {
        setProfile(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Profile fetch error:", err);
        // Fallback: build a minimal profile from context data so the page doesn't crash
        setProfile({
          player: {
            id: player.id ?? "",
            pseudo: player.pseudo,
            email: player.email,
            avatar: player.avatar,
            createdAt: player.createdAt,
            madnessSince: player.madnessSince ?? "",
            bio: player.bio ?? "",
            autodiagnostic: player.autodiagnostic ?? "",
          },
          games: [],
          globalScore: 0,
          badge: { name: "Patient Admis", emoji: "🏥", minScore: 0, color: "text-gray-400" },
          nextBadge: { name: "Cas Intéressant", emoji: "🔬", minScore: 50, color: "text-blue-400" },
        });
        setLoading(false);
      });
  }, [player, authLoading, router]);

  // Sync badge to context/localStorage when profile loads
  useEffect(() => {
    if (profile?.badge) {
      updateBadge(profile.badge.emoji, profile.badge.name);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.badge?.name]);

  const saveBio = async () => {
    setSaving(true);
    const err = await updateProfile({ bio: bioValue });
    if (!err) {
      setProfile((prev) =>
        prev ? { ...prev, player: { ...prev.player, bio: bioValue } } : prev
      );
      setEditingBio(false);
    }
    setSaving(false);
  };

  const saveDiag = async () => {
    setSaving(true);
    const err = await updateProfile({ autodiagnostic: diagValue });
    if (!err) {
      setProfile((prev) =>
        prev ? { ...prev, player: { ...prev.player, autodiagnostic: diagValue } } : prev
      );
      setEditingDiag(false);
    }
    setSaving(false);
  };

  const saveMadness = async () => {
    setSaving(true);
    const err = await updateProfile({ madnessSince: madnessValue });
    if (!err) {
      setProfile((prev) =>
        prev ? { ...prev, player: { ...prev.player, madnessSince: madnessValue } } : prev
      );
      setEditingMadness(false);
    }
    setSaving(false);
  };

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
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple/10 mb-2 ${profile.badge.color}`}>
            <span className="text-base">{profile.badge.emoji}</span>
            <span className="text-sm font-bold">{profile.badge.name}</span>
          </div>
          <p className="text-sm text-purple/50 mb-4">
            Membre depuis le {memberSince}
          </p>
          <div className="flex justify-center gap-6">
            <div className="text-center">
              <div className="text-2xl font-black text-purple">{profile.globalScore}</div>
              <div className="text-xs text-purple/50 font-medium">score global</div>
            </div>
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
          {profile.nextBadge && (
            <div className="mt-4">
              <div className="flex items-center justify-center gap-2 text-xs text-purple/40 mb-1.5">
                <span>Prochain badge : {profile.nextBadge.emoji} {profile.nextBadge.name}</span>
                <span className="font-bold">{profile.nextBadge.minScore - profile.globalScore} pts restants</span>
              </div>
              <div className="w-full max-w-xs mx-auto h-2 bg-purple/10 rounded-full overflow-hidden">
                <div
                  className="h-full gradient-bg rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(100, ((profile.globalScore - profile.badge.minScore) / (profile.nextBadge.minScore - profile.badge.minScore)) * 100)}%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Editable profile fields */}
        <div className="card mb-8 animate-slide-up" style={{ animationDelay: "0.05s" }}>
          <h2 className="text-lg font-black text-purple-dark mb-4">Mon dossier patient</h2>

          {/* Bio / Citation */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-purple/50 uppercase tracking-wide">
                Citation / Mini-bio
              </label>
              {!editingBio && (
                <button
                  onClick={() => {
                    setBioValue(profile.player.bio || "");
                    setEditingBio(true);
                  }}
                  className="text-xs text-purple/40 hover:text-purple transition-colors"
                >
                  Modifier
                </button>
              )}
            </div>
            {editingBio ? (
              <div>
                <textarea
                  value={bioValue}
                  onChange={(e) => setBioValue(e.target.value)}
                  maxLength={160}
                  rows={2}
                  placeholder="Une citation, une id&eacute;e folle, ta devise..."
                  className="w-full px-3 py-2 rounded-xl border-2 border-purple/20 focus:border-purple focus:outline-none bg-purple/5 text-purple-dark text-sm resize-none transition-colors"
                />
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-xs text-purple/30">{bioValue.length}/160</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingBio(false)}
                      className="text-xs font-semibold text-purple/40 hover:text-purple px-3 py-1 transition-colors"
                      disabled={saving}
                    >
                      Annuler
                    </button>
                    <button
                      onClick={saveBio}
                      disabled={saving}
                      className="text-xs font-bold text-white bg-purple hover:bg-purple-dark px-3 py-1 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {saving ? "..." : "Enregistrer"}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-purple-dark/70 italic">
                {profile.player.bio || "Aucune citation pour l\u2019instant..."}
              </p>
            )}
          </div>

          {/* Autodiagnostic */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-purple/50 uppercase tracking-wide">
                Autodiagnostic
              </label>
              {!editingDiag && (
                <button
                  onClick={() => {
                    setDiagValue(profile.player.autodiagnostic || "");
                    setEditingDiag(true);
                  }}
                  className="text-xs text-purple/40 hover:text-purple transition-colors"
                >
                  Modifier
                </button>
              )}
            </div>
            {editingDiag ? (
              <div>
                <textarea
                  value={diagValue}
                  onChange={(e) => setDiagValue(e.target.value)}
                  maxLength={200}
                  rows={2}
                  placeholder="Ton autodiagnostic totalement fiable..."
                  className="w-full px-3 py-2 rounded-xl border-2 border-purple/20 focus:border-purple focus:outline-none bg-purple/5 text-purple-dark text-sm resize-none transition-colors"
                />
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-xs text-purple/30">{diagValue.length}/200</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingDiag(false)}
                      className="text-xs font-semibold text-purple/40 hover:text-purple px-3 py-1 transition-colors"
                      disabled={saving}
                    >
                      Annuler
                    </button>
                    <button
                      onClick={saveDiag}
                      disabled={saving}
                      className="text-xs font-bold text-white bg-purple hover:bg-purple-dark px-3 py-1 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {saving ? "..." : "Enregistrer"}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-purple-dark/70 italic">
                {profile.player.autodiagnostic || "Aucun diagnostic pos\u00e9 pour l\u2019instant..."}
              </p>
            )}
          </div>

          {/* Date de d&eacute;but de folie */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-purple/50 uppercase tracking-wide">
                D&eacute;but de la folie
              </label>
              {!editingMadness && (
                <button
                  onClick={() => {
                    setMadnessValue(profile.player.madnessSince || "");
                    setEditingMadness(true);
                  }}
                  className="text-xs text-purple/40 hover:text-purple transition-colors"
                >
                  Modifier
                </button>
              )}
            </div>
            {editingMadness ? (
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={madnessValue}
                  onChange={(e) => setMadnessValue(e.target.value)}
                  max={new Date().toISOString().split("T")[0]}
                  className="flex-1 px-3 py-2 rounded-xl border-2 border-purple/20 focus:border-purple focus:outline-none bg-purple/5 text-purple-dark text-sm transition-colors"
                />
                <button
                  onClick={() => setEditingMadness(false)}
                  className="text-xs font-semibold text-purple/40 hover:text-purple px-3 py-1 transition-colors"
                  disabled={saving}
                >
                  Annuler
                </button>
                <button
                  onClick={saveMadness}
                  disabled={saving}
                  className="text-xs font-bold text-white bg-purple hover:bg-purple-dark px-3 py-1 rounded-lg transition-colors disabled:opacity-50"
                >
                  {saving ? "..." : "OK"}
                </button>
              </div>
            ) : (
              <p className="text-sm text-purple-dark/70">
                {profile.player.madnessSince
                  ? new Date(profile.player.madnessSince + "T00:00:00").toLocaleDateString("fr-FR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "Date inconnue"}
              </p>
            )}
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
