"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePlayer } from "@/context/PlayerContext";
import { Key, Brain } from "lucide-react";

export default function ConnexionPage() {
  const { login } = usePlayer();
  const router = useRouter();
  const [pseudo, setPseudo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Forgot password state
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
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

  async function handleForgot(e: React.FormEvent) {
    e.preventDefault();
    setResetError("");
    setResetSuccess("");
    setResetSubmitting(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setResetError(data.error || "Erreur");
      } else {
        setResetSuccess(
          data.message ||
            "Si un compte existe avec cet email, un lien de réinitialisation a été envoyé."
        );
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
          <div className="flex justify-center mb-4">
            {showReset ? <Brain size={48} className="text-black" /> : <Key size={48} className="text-black" />}
          </div>
          <h1 className="text-3xl font-black text-black mb-2">
            {showReset ? "Mot de passe oublié" : "Connexion"}
          </h1>
          <p className="text-sm text-black">
            {showReset
              ? "Renseigne ton email pour recevoir un lien de réinitialisation"
              : "Retrouve ton profil et tes classements"}
          </p>
        </div>

        <div className="card">
          {!showReset ? (
            <>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-black mb-1">Pseudo ou email</label>
                  <input
                    type="text"
                    value={pseudo}
                    onChange={(e) => setPseudo(e.target.value)}
                    placeholder="Ton pseudo ou email..."
                    maxLength={100}
                    autoComplete="username"
                    className="w-full px-4 py-3 rounded-xl border border-white focus:border-white focus:outline-none font-semibold transition-colors bg-white placeholder:text-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-black mb-1">Mot de passe</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Ton mot de passe"
                    className="w-full px-4 py-3 rounded-xl border border-white focus:border-white focus:outline-none font-semibold transition-colors bg-white placeholder:text-black"
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
                  {submitting ? "Connexion..." : "Se connecter"}
                </button>
              </form>

              <div className="text-center mt-4 space-y-2">
                <button
                  onClick={() => {
                    setShowReset(true);
                    setResetError("");
                    setResetSuccess("");
                  }}
                  className="text-sm text-black hover:text-black font-medium transition-colors"
                >
                  Mot de passe oublié ?
                </button>
                <p className="text-sm text-black">
                  Pas encore de compte ?{" "}
                  <Link href="/inscription" className="text-black font-semibold hover:underline">
                    S&apos;inscrire
                  </Link>
                </p>
              </div>
            </>
          ) : (
            <>
              <form onSubmit={handleForgot} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-black mb-1">Email du compte</label>
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="ton@email.com"
                    className="w-full px-4 py-3 rounded-xl border border-white focus:border-white focus:outline-none font-semibold transition-colors bg-white placeholder:text-black"
                  />
                </div>

                {resetError && (
                  <p className="text-red text-sm font-medium text-center">{resetError}</p>
                )}
                {resetSuccess && (
                  <p className="text-blue text-sm font-medium text-center">{resetSuccess}</p>
                )}

                <button
                  type="submit"
                  disabled={resetSubmitting}
                  className="btn-primary w-full"
                >
                  {resetSubmitting ? "Envoi en cours..." : "Envoyer le lien de réinitialisation"}
                </button>
              </form>

              <div className="text-center mt-4">
                <button
                  onClick={() => {
                    setShowReset(false);
                    setResetError("");
                    setResetSuccess("");
                  }}
                  className="text-sm text-black hover:text-black font-medium transition-colors"
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
