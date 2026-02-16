"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePlayer } from "@/context/PlayerContext";
import GameIcon from "@/components/GameIcon";
import { Pencil, Gamepad2 } from "lucide-react";

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
  "laugh", "glasses", "brain", "ghost", "squirrel", "cat", "fish", "skull",
  "bot", "orbit", "sparkles", "bird", "palette", "flame", "bone", "droplets",
];

const GAME_EMOJIS: Record<string, string> = {
  "DSM-6 Version Beta": "hospital",
  "Test de Rorschach": "palette",
  "Évaluation Émotionnelle": "brain",
  "Évasion Psychiatrique": "door-open",
  "Test de Motricité Fine": "target",
  "Test Cognitif Absurde": "brain",
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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [deleting, setDeleting] = useState(false);

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
          badge: { name: "Patient Admis", emoji: "hospital", minScore: 0, color: "text-black" },
          nextBadge: { name: "Cas Intéressant", emoji: "microscope", minScore: 50, color: "text-blue" },
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

  const handleDeleteAccount = async () => {
    if (!player) return;
    setDeleteError("");
    setDeleting(true);
    try {
      const res = await fetch("/api/auth/delete-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pseudo: player.pseudo, password: deletePassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setDeleteError(data.error || "Erreur lors de la suppression");
        setDeleting(false);
        return;
      }
      logout();
      router.push("/");
    } catch {
      setDeleteError("Erreur réseau");
      setDeleting(false);
    }
  };

  if (authLoading || loading || !profile) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
        <div className="text-xl text-blue animate-pulse">Chargement du profil...</div>
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
              className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mx-auto hover:scale-105 transition-transform"
              title="Changer d'avatar"
            >
              <GameIcon name={profile.player.avatar || profile.player.pseudo.charAt(0).toUpperCase()} size={36} />
            </button>
            <span className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center text-xs border border-blue">
              <Pencil size={12} />
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
                      ? "ring-2 ring-blue scale-110"
                      : ""
                  }`}
                >
                  <GameIcon name={a} size={22} />
                </button>
              ))}
            </div>
          )}
          <h1 className="text-3xl font-black text-black mb-1">
            {profile.player.pseudo}
          </h1>
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-2 ${profile.badge.color}`}>
            <span className="text-base"><GameIcon name={profile.badge.emoji} size={18} /></span>
            <span className="text-sm font-bold">{profile.badge.name}</span>
          </div>
          <p className="text-sm text-black mb-4">
            Membre depuis le {memberSince}
          </p>
          <div className="flex justify-center gap-6">
            <div className="text-center">
              <div className="text-2xl font-black text-black">{profile.globalScore}<span className="text-sm font-bold text-black">/100</span></div>
              <div className="text-xs text-black font-medium">score global</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-black text-black">{profile.games.length}</div>
              <div className="text-xs text-black font-medium">
                {profile.games.length === 1 ? "jeu" : "jeux"}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-black text-black">{totalPlays}</div>
              <div className="text-xs text-black font-medium">
                {totalPlays === 1 ? "partie" : "parties"}
              </div>
            </div>
          </div>
          {profile.nextBadge && (
            <div className="mt-4">
              <div className="flex items-center justify-center gap-2 text-xs text-black mb-1.5">
                <span className="inline-flex items-center gap-1">Prochain badge : <GameIcon name={profile.nextBadge.emoji} size={14} /> {profile.nextBadge.name}</span>
                <span className="font-bold">{profile.nextBadge.minScore - profile.globalScore} points restants</span>
              </div>
              <div className="w-full max-w-xs mx-auto h-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-black rounded-full transition-all duration-500"
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
          <h2 className="text-lg font-black text-black mb-4">Mon dossier patient</h2>

          {/* Bio / Citation */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-red uppercase tracking-wide">
                Citation / Mini-bio
              </label>
              {!editingBio && (
                <button
                  onClick={() => {
                    setBioValue(profile.player.bio || "");
                    setEditingBio(true);
                  }}
                  className="text-xs text-red hover:text-red transition-colors"
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
                  placeholder="Une citation, une idée folle, ta devise..."
                  className="w-full px-3 py-2 rounded-xl border border-red focus:border-red focus:outline-none text-black text-sm resize-none transition-colors"
                />
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-xs text-red">{bioValue.length}/160</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingBio(false)}
                      className="text-xs font-semibold text-red hover:text-red px-3 py-1 transition-colors"
                      disabled={saving}
                    >
                      Annuler
                    </button>
                    <button
                      onClick={saveBio}
                      disabled={saving}
                      className="text-xs font-bold text-white bg-red hover:bg-black px-3 py-1 rounded-lg transition-colors"
                    >
                      {saving ? "..." : "Enregistrer"}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-black italic">
                {profile.player.bio || "Aucune citation pour l\u2019instant..."}
              </p>
            )}
          </div>

          {/* Autodiagnostic */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-red uppercase tracking-wide">
                Autodiagnostic
              </label>
              {!editingDiag && (
                <button
                  onClick={() => {
                    setDiagValue(profile.player.autodiagnostic || "");
                    setEditingDiag(true);
                  }}
                  className="text-xs text-red hover:text-red transition-colors"
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
                  className="w-full px-3 py-2 rounded-xl border border-red focus:border-red focus:outline-none text-black text-sm resize-none transition-colors"
                />
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-xs text-red">{diagValue.length}/200</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingDiag(false)}
                      className="text-xs font-semibold text-red hover:text-red px-3 py-1 transition-colors"
                      disabled={saving}
                    >
                      Annuler
                    </button>
                    <button
                      onClick={saveDiag}
                      disabled={saving}
                      className="text-xs font-bold text-white bg-red hover:bg-black px-3 py-1 rounded-lg transition-colors"
                    >
                      {saving ? "..." : "Enregistrer"}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-black italic">
                {profile.player.autodiagnostic || "Aucun diagnostic posé pour l\u2019instant..."}
              </p>
            )}
          </div>

          {/* Date de début de folie */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-red uppercase tracking-wide">
                Début de la folie
              </label>
              {!editingMadness && (
                <button
                  onClick={() => {
                    setMadnessValue(profile.player.madnessSince || "");
                    setEditingMadness(true);
                  }}
                  className="text-xs text-red hover:text-red transition-colors"
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
                  className="flex-1 px-3 py-2 rounded-xl border border-red focus:border-red focus:outline-none text-black text-sm transition-colors"
                />
                <button
                  onClick={() => setEditingMadness(false)}
                  className="text-xs font-semibold text-red hover:text-red px-3 py-1 transition-colors"
                  disabled={saving}
                >
                  Annuler
                </button>
                <button
                  onClick={saveMadness}
                  disabled={saving}
                  className="text-xs font-bold text-white bg-red hover:bg-black px-3 py-1 rounded-lg transition-colors"
                >
                  {saving ? "..." : "OK"}
                </button>
              </div>
            ) : (
              <p className="text-sm text-black">
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
        <h2 className="text-xl font-black text-black mb-4 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          Mes classements
        </h2>

        {profile.games.length === 0 ? (
          <div className="card text-center py-10 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <div className="text-5xl mb-4"><Gamepad2 size={48} className="text-black" /></div>
            <p className="text-black font-medium mb-4">
              Tu n&apos;as pas encore joué !
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
                className="card border border-blue hover:border-blue flex items-center gap-4 animate-slide-up group"
                style={{ animationDelay: `${(i + 1) * 0.1}s` }}
              >
                <div className="text-4xl text-red"><GameIcon name={GAME_EMOJIS[game.game] ?? "gamepad-2"} size={36} /></div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-black group-hover:text-blue transition-colors">
                    {game.game}
                  </div>
                  <div className="text-xs text-foreground font-medium">
                    {game.bestTitle}
                  </div>
                  <div className="text-xs text-foreground mt-1">
                    {game.totalPlays} {game.totalPlays === 1 ? "partie" : "parties"} &middot; Dernière le{" "}
                    {new Date(game.lastPlayed).toLocaleDateString("fr-FR")}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-2xl font-black text-yellow">{game.bestScore}</div>
                  <div className="text-xs text-foreground font-medium">meilleur score</div>
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
            className="text-sm font-semibold text-black hover:text-black px-4 py-2 transition-colors"
          >
            Se déconnecter
          </button>
        </div>

        {/* Danger zone */}
        <div className="mt-12 animate-slide-up" style={{ animationDelay: "0.5s" }}>
          {!showDeleteConfirm ? (
            <div className="text-center">
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="text-xs text-red hover:text-red font-medium transition-colors"
              >
                Supprimer mon compte
              </button>
            </div>
          ) : (
            <div className="card border border-red">
              <h3 className="text-sm font-bold text-red mb-2">
                Supprimer le compte
              </h3>
              <p className="text-xs text-red mb-4">
                Cette action est irréversible. Ton compte et tes données de profil seront supprimés.
              </p>
              <div className="mb-3">
                <input
                  type="password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  placeholder="Confirme avec ton mot de passe"
                  className="w-full px-3 py-2 rounded-xl border border-red focus:border-red focus:outline-none bg-white text-black text-sm transition-colors"
                />
              </div>
              {deleteError && (
                <p className="text-red text-xs font-medium mb-3">{deleteError}</p>
              )}
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeletePassword("");
                    setDeleteError("");
                  }}
                  className="text-xs font-semibold text-blue hover:text-blue px-3 py-1.5 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleting || !deletePassword}
                  className="text-xs font-bold text-white bg-red hover:bg-red px-4 py-1.5 rounded-lg transition-colors"
                >
                  {deleting ? "Suppression..." : "Supprimer définitivement"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
