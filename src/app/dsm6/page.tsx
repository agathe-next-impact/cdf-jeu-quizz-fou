"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePlayer } from "@/context/PlayerContext";

export default function DSM6Home() {
  const { player } = usePlayer();
  const [pseudo, setPseudo] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (player?.pseudo && !pseudo) {
      setPseudo(player.pseudo);
    }
  }, [player]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = pseudo.trim();
    if (trimmed.length < 2) {
      setError("Votre identifiant patient doit faire au moins 2 caractères.");
      return;
    }
    if (trimmed.length > 20) {
      setError("Identifiant trop long (20 caractères max).");
      return;
    }
    sessionStorage.setItem("dsm6-pseudo", trimmed);
    router.push("/dsm6/quiz");
  }

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-32 left-10 text-6xl animate-float opacity-15 select-none">🧠</div>
      <div className="absolute top-48 right-10 text-5xl animate-float opacity-15 select-none" style={{ animationDelay: "1s" }}>📋</div>
      <div className="absolute bottom-20 left-20 text-5xl animate-float opacity-15 select-none" style={{ animationDelay: "2s" }}>🔬</div>

      <div className="animate-slide-up max-w-lg w-full text-center relative z-10">
        {/* Title */}
        <div className="mb-8">
          <div className="inline-block bg-red-100 text-red-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4">
            Version Beta — Totalement Officiel&#8482;
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-3 leading-tight" style={{ background: "linear-gradient(135deg, #1a365d, #e53e3e)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            DSM-6
          </h1>
          <p className="text-base text-purple-dark/70 font-medium leading-relaxed">
            Le manuel diagnostique qui n&apos;existe pas encore,
            ce qui le rend d&apos;autant plus l&eacute;gitime.
          </p>
        </div>

        {/* Card */}
        <div className="card max-w-md mx-auto border-2 border-purple/10">
          <div className="text-4xl mb-4">🏥</div>
          <h2 className="text-xl font-bold mb-2 text-purple-dark">
            Consultation gratuite
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            15 questions pour obtenir votre diagnostic officieux
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                value={pseudo}
                onChange={(e) => {
                  setPseudo(e.target.value);
                  setError("");
                }}
                placeholder="Identifiant patient..."
                maxLength={20}
                className="w-full px-5 py-3 rounded-full border-2 border-purple/20 focus:border-purple focus:outline-none text-center text-lg font-semibold transition-colors bg-cream placeholder:text-gray-400"
              />
              {error && (
                <p className="text-pink text-sm mt-2 font-medium">{error}</p>
              )}
            </div>
            <button type="submit" className="btn-primary w-full">
              Commencer le diagnostic
            </button>
          </form>
        </div>

        {/* Features */}
        <div className="mt-10 grid grid-cols-3 gap-4 text-center">
          <div className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <div className="text-3xl mb-2">📋</div>
            <p className="text-xs font-semibold text-purple-dark/60">
              15 questions cliniques
            </p>
          </div>
          <div className="animate-slide-up" style={{ animationDelay: "0.4s" }}>
            <div className="text-3xl mb-2">🧪</div>
            <p className="text-xs font-semibold text-purple-dark/60">
              Diagnostic personnalis&eacute;
            </p>
          </div>
          <div className="animate-slide-up" style={{ animationDelay: "0.6s" }}>
            <div className="text-3xl mb-2">🏆</div>
            <p className="text-xs font-semibold text-purple-dark/60">
              Classement des patients
            </p>
          </div>
        </div>

        <p className="mt-8 text-xs text-purple/30 italic">
          Note du comit&eacute; &eacute;ditorial : toute ressemblance avec votre vie quotidienne est absolument diagnostique.
        </p>
      </div>
    </div>
  );
}
