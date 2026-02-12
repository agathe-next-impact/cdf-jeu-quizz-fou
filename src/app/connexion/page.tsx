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

  // Reset password state
  const [showReset, setShowReset] = useState(false);
  const [resetPseudo, setResetPseudo] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [resetNewPassword, setResetNewPassword] = useState("");
  const [resetError, setResetError] = useState("");
  const [resetSuccess, setResetSuccess] = useState("");
  const [resetSubmitting, setResetSubmitting] = useState(false);

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

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setResetError("");
    setResetSuccess("");
    setResetSubmitting(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pseudo: resetPseudo.trim(),
          email: resetEmail.trim(),
          newPassword: resetNewPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setResetError(data.error || "Erreur lors de la réinitialisation");
      } else {
        setResetSuccess("Mot de passe mis à jour ! Tu peux te connecter.");
        setResetNewPassword("");
      }
    } catch {
      setResetError("Erreur réseau");
    }
    setResetSubmitting(false);
  }

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-4 py-12">
      <div className="animate-slide-up max-w-md w-full">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">{showReset ? "🧠" : "🔑"}</div>
          <h1 className="text-3xl font-black gradient-text mb-2">
            {showReset ? "Mot de passe oublié" : "Connexion"}
          </h1>
          <p className="text-sm text-purple-dark/60">
            {showReset
              ? "Renseigne ton pseudo et ton email pour réinitialiser"
              : "Retrouve ton profil et tes classements"}
          </p>
        </div>

        <div className="card">
          {!showReset ? (
            <>
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

              <div className="text-center mt-4 space-y-2">
                <button
                  onClick={() => {
                    setShowReset(true);
                    setResetPseudo(pseudo);
                    setResetError("");
                    setResetSuccess("");
                  }}
                  className="text-sm text-purple/50 hover:text-purple font-medium transition-colors"
                >
                  Mot de passe oublié ?
                </button>
                <p className="text-sm text-purple/50">
                  Pas encore de compte ?{" "}
                  <Link href="/inscription" className="text-purple font-semibold hover:underline">
                    S&apos;inscrire
                  </Link>
                </p>
              </div>
            </>
          ) : (
            <>
              <form onSubmit={handleReset} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-purple-dark mb-1">Pseudo</label>
                  <input
                    type="text"
                    value={resetPseudo}
                    onChange={(e) => setResetPseudo(e.target.value)}
                    placeholder="Ton pseudo..."
                    maxLength={20}
                    className="w-full px-4 py-3 rounded-xl border-2 border-purple/20 focus:border-purple focus:outline-none font-semibold transition-colors bg-cream placeholder:text-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-purple-dark mb-1">Email du compte</label>
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="ton@email.com"
                    className="w-full px-4 py-3 rounded-xl border-2 border-purple/20 focus:border-purple focus:outline-none font-semibold transition-colors bg-cream placeholder:text-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-purple-dark mb-1">Nouveau mot de passe</label>
                  <input
                    type="password"
                    value={resetNewPassword}
                    onChange={(e) => setResetNewPassword(e.target.value)}
                    placeholder="Nouveau mot de passe (4 car. min)"
                    className="w-full px-4 py-3 rounded-xl border-2 border-purple/20 focus:border-purple focus:outline-none font-semibold transition-colors bg-cream placeholder:text-gray-400"
                  />
                </div>

                {resetError && (
                  <p className="text-pink text-sm font-medium text-center">{resetError}</p>
                )}
                {resetSuccess && (
                  <p className="text-green-600 text-sm font-medium text-center">{resetSuccess}</p>
                )}

                <button
                  type="submit"
                  disabled={resetSubmitting}
                  className="btn-primary w-full disabled:opacity-50"
                >
                  {resetSubmitting ? "Réinitialisation..." : "Réinitialiser le mot de passe"}
                </button>
              </form>

              <div className="text-center mt-4">
                <button
                  onClick={() => {
                    setShowReset(false);
                    setResetError("");
                    setResetSuccess("");
                  }}
                  className="text-sm text-purple/50 hover:text-purple font-medium transition-colors"
                >
                  Retour à la connexion
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
