"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePlayer } from "@/context/PlayerContext";
import { Ticket } from "lucide-react";
import GameIcon from "@/components/GameIcon";

const AVATARS = [
  "laugh", "glasses", "brain", "ghost", "squirrel", "cat", "fish", "skull",
  "bot", "orbit", "sparkles", "bird", "palette", "flame", "bone", "droplets",
];

export default function InscriptionPage() {
  const { register } = usePlayer();
  const router = useRouter();
  const [pseudo, setPseudo] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState("laugh");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const err = await register(pseudo.trim(), email.trim(), password, avatar);
    if (err) {
      setError(err);
      setSubmitting(false);
      return;
    }

    router.push("/profil");
  }

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-4 py-12">
      <div className="animate-slide-up max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Ticket size={48} className="text-black" />
          </div>
          <h1 className="text-3xl font-black text-black mb-2">Inscription</h1>
          <p className="text-sm text-black">
            Crée ton profil pour sauvegarder tes classements
          </p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-black mb-2">Choisis ton avatar</label>
              <div className="flex flex-wrap gap-2 justify-center">
                {AVATARS.map((a) => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => setAvatar(a)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      avatar === a
                        ? "ring-2 ring-blue scale-110"
                        : ""
                    }`}
                  >
                    <GameIcon name={a} size={22} />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-black mb-1">Pseudo</label>
              <input
                type="text"
                value={pseudo}
                onChange={(e) => setPseudo(e.target.value)}
                placeholder="Ton pseudo unique..."
                maxLength={20}
                className="w-full px-4 py-3 rounded-xl border border-blue focus:border-blue focus:outline-none font-semibold transition-colors bg-white placeholder:text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-black mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ton@email.com"
                className="w-full px-4 py-3 rounded-xl border border-blue focus:border-blue focus:outline-none font-semibold transition-colors bg-white placeholder:text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-black mb-1">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="4 caractères minimum"
                className="w-full px-4 py-3 rounded-xl border border-blue focus:border-blue focus:outline-none font-semibold transition-colors bg-white placeholder:text-black"
              />
            </div>

            {error && (
              <p className="text-red text-sm font-medium text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full"
            >
              {submitting ? "Inscription..." : "S'inscrire"}
            </button>
          </form>

          <p className="text-center text-sm text-blue mt-4">
            Déjà inscrit ?{" "}
            <Link href="/connexion" className="text-blue font-semibold hover:underline">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
