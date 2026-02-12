"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePlayer } from "@/context/PlayerContext";

const AVATARS = [
  "🤪", "😎", "🧠", "👻", "🦊", "🐱", "🐸", "🎃",
  "🤖", "👽", "🦄", "🐧", "🎭", "🔥", "💀", "🫠",
];

export default function InscriptionPage() {
  const { register } = usePlayer();
  const router = useRouter();
  const [pseudo, setPseudo] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState("🤪");
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
          <div className="text-5xl mb-4">🎫</div>
          <h1 className="text-3xl font-black gradient-text mb-2">Inscription</h1>
          <p className="text-sm text-purple-dark/60">
            Cr&eacute;e ton profil pour sauvegarder tes classements
          </p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-purple-dark mb-2">Choisis ton avatar</label>
              <div className="flex flex-wrap gap-2 justify-center">
                {AVATARS.map((a) => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => setAvatar(a)}
                    className={`text-2xl w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      avatar === a
                        ? "bg-purple/20 ring-2 ring-purple scale-110"
                        : "bg-purple/5 hover:bg-purple/10"
                    }`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-purple-dark mb-1">Pseudo</label>
              <input
                type="text"
                value={pseudo}
                onChange={(e) => setPseudo(e.target.value)}
                placeholder="Ton pseudo unique..."
                maxLength={20}
                className="w-full px-4 py-3 rounded-xl border-2 border-purple/20 focus:border-purple focus:outline-none font-semibold transition-colors bg-cream placeholder:text-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-purple-dark mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ton@email.com"
                className="w-full px-4 py-3 rounded-xl border-2 border-purple/20 focus:border-purple focus:outline-none font-semibold transition-colors bg-cream placeholder:text-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-purple-dark mb-1">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="4 caract\u00e8res minimum"
                className="w-full px-4 py-3 rounded-xl border-2 border-purple/20 focus:border-purple focus:outline-none font-semibold transition-colors bg-cream placeholder:text-gray-400"
              />
            </div>

            {error && (
              <p className="text-pink text-sm font-medium text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full disabled:opacity-50"
            >
              {submitting ? "Inscription..." : "S'inscrire"}
            </button>
          </form>

          <p className="text-center text-sm text-purple/50 mt-4">
            D&eacute;j&agrave; inscrit ?{" "}
            <Link href="/connexion" className="text-purple font-semibold hover:underline">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
