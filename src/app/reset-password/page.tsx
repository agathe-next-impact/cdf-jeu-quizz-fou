"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Key } from "lucide-react";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const isPasswordValid =
    password.length >= 8 &&
    /[a-zA-Z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[^a-zA-Z0-9]/.test(password);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Erreur lors de la réinitialisation");
      } else {
        setSuccess(true);
      }
    } catch {
      setError("Erreur réseau");
    }
    setSubmitting(false);
  }

  if (!token) {
    return (
      <div className="max-w-md w-full text-center">
        <div className="card">
          <p className="text-red font-semibold mb-4">
            Lien invalide. Aucun token de réinitialisation trouvé.
          </p>
          <Link href="/connexion" className="btn-primary inline-block">
            Retour à la connexion
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="animate-slide-up max-w-md w-full text-center">
        <div className="card">
          <div className="flex justify-center mb-4">
            <Key size={48} className="text-black" />
          </div>
          <h2 className="text-2xl font-black text-black mb-2">
            Mot de passe mis à jour !
          </h2>
          <p className="text-sm text-black mb-6">
            Tu peux maintenant te connecter avec ton nouveau mot de passe.
          </p>
          <Link href="/connexion" className="btn-primary inline-block">
            Se connecter
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-slide-up max-w-md w-full">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <Key size={48} className="text-black" />
        </div>
        <h1 className="text-3xl font-black text-black mb-2">
          Nouveau mot de passe
        </h1>
        <p className="text-sm text-black">
          Choisis un nouveau mot de passe pour ton compte
        </p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-black mb-1">
              Nouveau mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="8 caractères minimum"
              className="w-full px-4 py-3 rounded-xl border border-white focus:border-white focus:outline-none font-semibold transition-colors bg-white placeholder:text-black"
            />
            {password.length > 0 && (
              <ul className="mt-2 space-y-0.5 text-xs">
                <li className={password.length >= 8 ? "text-green" : "text-red"}>
                  {password.length >= 8 ? "\u2713" : "\u2717"} 8 caractères minimum
                </li>
                <li className={/[a-zA-Z]/.test(password) ? "text-green" : "text-red"}>
                  {/[a-zA-Z]/.test(password) ? "\u2713" : "\u2717"} Au moins une lettre
                </li>
                <li className={/[0-9]/.test(password) ? "text-green" : "text-red"}>
                  {/[0-9]/.test(password) ? "\u2713" : "\u2717"} Au moins un chiffre
                </li>
                <li className={/[^a-zA-Z0-9]/.test(password) ? "text-green" : "text-red"}>
                  {/[^a-zA-Z0-9]/.test(password) ? "\u2713" : "\u2717"} Au moins un caractère spécial (!@#$...)
                </li>
              </ul>
            )}
          </div>

          {error && (
            <p className="text-red text-sm font-medium text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting || !isPasswordValid}
            className="btn-primary w-full"
          >
            {submitting ? "Mise à jour..." : "Mettre à jour le mot de passe"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-4 py-12">
      <Suspense>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
