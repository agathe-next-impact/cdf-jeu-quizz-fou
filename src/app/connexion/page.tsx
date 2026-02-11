"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePlayer } from "@/context/PlayerContext";

export default function ConnexionPage() {
  const { login } = usePlayer();
  const router = useRouter();
  const [pseudo, setPseudo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const err = await login(pseudo.trim(), password);
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
          <div className="text-5xl mb-4">🔑</div>
          <h1 className="text-3xl font-black gradient-text mb-2">Connexion</h1>
          <p className="text-sm text-purple-dark/60">
            Retrouve ton profil et tes classements
          </p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-purple-dark mb-1">Pseudo</label>
              <input
                type="text"
                value={pseudo}
                onChange={(e) => setPseudo(e.target.value)}
                placeholder="Ton pseudo..."
                maxLength={20}
                className="w-full px-4 py-3 rounded-xl border-2 border-purple/20 focus:border-purple focus:outline-none font-semibold transition-colors bg-cream placeholder:text-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-purple-dark mb-1">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ton mot de passe"
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
              {submitting ? "Connexion..." : "Se connecter"}
            </button>
          </form>

          <p className="text-center text-sm text-purple/50 mt-4">
            Pas encore de compte ?{" "}
            <Link href="/inscription" className="text-purple font-semibold hover:underline">
              S&apos;inscrire
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
