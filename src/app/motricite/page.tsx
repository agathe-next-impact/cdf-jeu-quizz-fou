"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePlayer } from "@/context/PlayerContext";

export default function MotriciteHome() {
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
      setError("Votre nom de patient doit faire au moins 2 caractères.");
      return;
    }
    if (trimmed.length > 20) {
      setError("Nom trop long (20 caractères max).");
      return;
    }
    sessionStorage.setItem("motricite-pseudo", trimmed);
    router.push("/motricite/quiz");
  }

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Decorative floaters */}
      <div className="absolute top-32 left-10 text-6xl animate-float opacity-15 select-none">
        🎯
      </div>
      <div
        className="absolute top-48 right-10 text-5xl animate-float opacity-15 select-none"
        style={{ animationDelay: "1s" }}
      >
        🖱️
      </div>
      <div
        className="absolute bottom-20 left-20 text-5xl animate-float opacity-15 select-none"
        style={{ animationDelay: "2s" }}
      >
        🧠
      </div>

      <div className="animate-slide-up max-w-lg w-full text-center relative z-10">
        {/* Title */}
        <div className="mb-8">
          <div className="inline-block bg-[#0d9488]/10 text-[#0d9488] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4">
            Test neuromoteur officiel
          </div>
          <h1
            className="text-4xl md:text-5xl font-black mb-3 leading-tight"
            style={{
              background: "linear-gradient(135deg, #0d9488, #14b8a6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Test de Motricité Fine
          </h1>
          <p className="text-base text-purple-dark/70 font-medium leading-relaxed">
            Évaluation complète de votre coordination œil-main
          </p>
        </div>

        {/* Intro card */}
        <div className="card max-w-md mx-auto border-2 border-[#0d9488]/10 text-left mb-6">
          <div className="text-4xl mb-4 text-center">🎯</div>
          <p className="text-sm text-purple-dark/70 leading-relaxed mb-4">
            Ce test scientifique mesure la précision de vos mouvements à travers
            <span className="font-bold text-[#0d9488]"> 5 niveaux</span> de
            difficulté croissante. Cliquez sur les cibles le plus rapidement et
            précisément possible.
          </p>
          <p className="text-sm text-purple-dark/70 leading-relaxed mb-4">
            Les cibles changent de comportement à chaque niveau : statiques,
            rétrécissantes, mobiles, tremblantes, puis tout à la fois.
          </p>
          <p className="text-sm font-bold text-[#0d9488] text-center">
            Chaque clic raté sera analysé. Votre système nerveux sera jugé.
          </p>
        </div>

        {/* Pseudo form */}
        <div className="card max-w-md mx-auto border-2 border-[#0d9488]/10">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                value={pseudo}
                onChange={(e) => {
                  setPseudo(e.target.value);
                  setError("");
                }}
                placeholder="Nom du patient..."
                maxLength={20}
                className="w-full px-5 py-3 rounded-full border-2 border-[#0d9488]/20 focus:border-[#0d9488] focus:outline-none text-center text-lg font-semibold transition-colors bg-cream placeholder:text-gray-400"
              />
              {error && (
                <p className="text-pink text-sm mt-2 font-medium">{error}</p>
              )}
            </div>
            <button
              type="submit"
              className="w-full font-bold text-white py-3 px-6 rounded-full transition-all hover:scale-105 hover:shadow-lg"
              style={{
                background: "linear-gradient(135deg, #0d9488, #14b8a6)",
              }}
            >
              Commencer le test
            </button>
          </form>

          {!player && (
            <p className="text-xs text-purple/40 mt-3 text-center">
              <Link href="/connexion" className="underline hover:text-purple">
                Connectez-vous
              </Link>{" "}
              pour sauvegarder vos résultats sur votre profil
            </p>
          )}
        </div>

        {/* Features */}
        <div className="mt-10 grid grid-cols-3 gap-4 text-center">
          <div className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <div className="text-3xl mb-2">🎯</div>
            <p className="text-xs font-semibold text-purple-dark/60">
              5 niveaux progressifs
            </p>
          </div>
          <div className="animate-slide-up" style={{ animationDelay: "0.4s" }}>
            <div className="text-3xl mb-2">⏱️</div>
            <p className="text-xs font-semibold text-purple-dark/60">
              Chronométré
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
          Avertissement : ce test n&apos;est pas reconnu par la communauté
          médicale. Les diagnostics sont aussi fiables qu&apos;un horoscope.
        </p>
      </div>
    </div>
  );
}
