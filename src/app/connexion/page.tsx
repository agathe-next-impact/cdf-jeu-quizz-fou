"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { usePlayer } from "@/context/PlayerContext";
import { Key, Brain, Mail } from "lucide-react";

type ResetMode = "login" | "request" | "new-password";

function ConnexionContent() {
  const { login } = usePlayer();
  const router = useRouter();
  const searchParams = useSearchParams();

  const resetToken = searchParams.get("reset_token");

  const [mode, setMode] = useState<ResetMode>(resetToken ? "new-password" : "login");

  // Login state
  const [pseudo, setPseudo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Request reset state
  const [resetEmail, setResetEmail] = useState("");
  const [requestError, setRequestError] = useState("");
  const [requestSuccess, setRequestSuccess] = useState("");
  const [requestSubmitting, setRequestSubmitting] = useState(false);

  // New password state (token-based)
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetError, setResetError] = useState("");
  const [resetSuccess, setResetSuccess] = useState("");
  const [resetSubmitting, setResetSubmitting] = useState(false);

  useEffect(() => {
    if (resetToken) setMode("new-password");
  }, [resetToken]);

  async function handleLogin(e: React.FormEvent) {
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

  async function handleRequestReset(e: React.FormEvent) {
    e.preventDefault();
    setRequestError("");
    setRequestSuccess("");
    setRequestSubmitting(true);

    try {
      const res = await fetch("/api/auth/request-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setRequestError(data.error || "Erreur lors de la demande");
      } else {
        setRequestSuccess(
          "Si un compte existe avec cet email, un lien de réinitialisation a été envoyé. Vérifie ta boîte mail (et tes spams)."
        );
        setResetEmail("");
      }
    } catch {
      setRequestError("Erreur réseau");
    }
    setRequestSubmitting(false);
  }

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    setResetError("");
    setResetSuccess("");

    if (newPassword !== confirmPassword) {
      setResetError("Les mots de passe ne correspondent pas");
      return;
    }

    if (newPassword.length < 4) {
      setResetError("Le mot de passe doit faire au moins 4 caractères");
      return;
    }

    setResetSubmitting(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: resetToken, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setResetError(data.error || "Erreur lors de la réinitialisation");
      } else {
        setResetSuccess("Mot de passe mis à jour ! Tu peux te connecter.");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch {
      setResetError("Erreur réseau");
    }
    setResetSubmitting(false);
  }

  const titles: Record<ResetMode, { icon: React.ReactNode; title: string; subtitle: string }> = {
    login: {
      icon: <Key size={48} className="text-black" />,
      title: "Connexion",
      subtitle: "Retrouve ton profil et tes classements",
    },
    request: {
      icon: <Mail size={48} className="text-black" />,
      title: "Mot de passe oublié",
      subtitle: "Entre ton email pour recevoir un lien de réinitialisation",
    },
    "new-password": {
      icon: <Brain size={48} className="text-black" />,
      title: "Nouveau mot de passe",
      subtitle: "Choisis ton nouveau mot de passe",
    },
  };

  const { icon, title, subtitle } = titles[mode];

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-4 py-12">
      <div className="animate-slide-up max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">{icon}</div>
          <h1 className="text-3xl font-black text-black mb-2">{title}</h1>
          <p className="text-sm text-black">{subtitle}</p>
        </div>

        <div className="card">
          {mode === "login" && (
            <>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-black mb-1">Pseudo</label>
                  <input
                    type="text"
                    value={pseudo}
                    onChange={(e) => setPseudo(e.target.value)}
                    placeholder="Ton pseudo..."
                    maxLength={20}
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

                <button type="submit" disabled={submitting} className="btn-primary w-full">
                  {submitting ? "Connexion..." : "Se connecter"}
                </button>
              </form>

              <div className="text-center mt-4 space-y-2">
                <button
                  onClick={() => {
                    setMode("request");
                    setRequestError("");
                    setRequestSuccess("");
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
          )}

          {mode === "request" && (
            <>
              <form onSubmit={handleRequestReset} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-black mb-1">Adresse email</label>
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="ton@email.com"
                    className="w-full px-4 py-3 rounded-xl border border-white focus:border-white focus:outline-none font-semibold transition-colors bg-white placeholder:text-black"
                  />
                </div>

                {requestError && (
                  <p className="text-red text-sm font-medium text-center">{requestError}</p>
                )}
                {requestSuccess && (
                  <p className="text-blue text-sm font-medium text-center">{requestSuccess}</p>
                )}

                <button type="submit" disabled={requestSubmitting} className="btn-primary w-full">
                  {requestSubmitting ? "Envoi en cours..." : "Envoyer le lien"}
                </button>
              </form>

              <div className="text-center mt-4">
                <button
                  onClick={() => {
                    setMode("login");
                    setRequestError("");
                    setRequestSuccess("");
                  }}
                  className="text-sm text-black hover:text-black font-medium transition-colors"
                >
                  Retour à la connexion
                </button>
              </div>
            </>
          )}

          {mode === "new-password" && (
            <>
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-black mb-1">Nouveau mot de passe</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Nouveau mot de passe (4 car. min)"
                    className="w-full px-4 py-3 rounded-xl border border-white focus:border-white focus:outline-none font-semibold transition-colors bg-white placeholder:text-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-black mb-1">Confirmer le mot de passe</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirme ton mot de passe"
                    className="w-full px-4 py-3 rounded-xl border border-white focus:border-white focus:outline-none font-semibold transition-colors bg-white placeholder:text-black"
                  />
                </div>

                {resetError && (
                  <p className="text-red text-sm font-medium text-center">{resetError}</p>
                )}
                {resetSuccess && (
                  <p className="text-blue text-sm font-medium text-center">{resetSuccess}</p>
                )}

                <button type="submit" disabled={resetSubmitting} className="btn-primary w-full">
                  {resetSubmitting ? "Réinitialisation..." : "Réinitialiser le mot de passe"}
                </button>
              </form>

              <div className="text-center mt-4">
                {resetSuccess ? (
                  <button
                    onClick={() => {
                      router.push("/connexion");
                      setMode("login");
                      setResetError("");
                      setResetSuccess("");
                    }}
                    className="text-sm text-black hover:text-black font-medium transition-colors"
                  >
                    Se connecter
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setMode("request");
                      setResetError("");
                    }}
                    className="text-sm text-black hover:text-black font-medium transition-colors"
                  >
                    Demander un nouveau lien
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ConnexionPage() {
  return (
    <Suspense>
      <ConnexionContent />
    </Suspense>
  );
}
