"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePlayer } from "@/context/PlayerContext";

export default function RorschachHome() {
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
      setError("Votre nom de sujet doit faire au moins 2 caractères.");
      return;
    }
    if (trimmed.length > 20) {
      setError("Nom trop long (20 caractères max).");
      return;
    }
    sessionStorage.setItem("rorschach-pseudo", trimmed);
    router.push("/rorschach/quiz");
  }

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Decorative inkblots */}
      <div className="absolute top-32 left-10 text-6xl animate-float opacity-15 select-none">
        🧠
      </div>
      <div
        className="absolute top-48 right-10 text-5xl animate-float opacity-15 select-none"
        style={{ animationDelay: "1s" }}
      >
        👁️
      </div>
      <div
        className="absolute bottom-20 left-20 text-5xl animate-float opacity-15 select-none"
        style={{ animationDelay: "2s" }}
      >
        🪶
      </div>

      <div className="animate-slide-up max-w-lg w-full text-center relative z-10">
        {/* Title */}
        <div className="mb-8">
          <div className="inline-block bg-purple/10 text-purple text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4">
            Évaluation Psychologique Officieuse&trade;
          </div>
          <h1
            className="text-4xl md:text-5xl font-black mb-3 leading-tight"
            style={{
              background: "linear-gradient(135deg, #1a1a2e, #6b21a8, #1a1a2e)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Test de Rorschach
          </h1>
          <p className="text-base text-purple-dark/70 font-medium leading-relaxed">
            10 taches d&apos;encre. 3 choix. Zéro chance d&apos;être
            diagnostiqué(e) sain(e) d&apos;esprit.
          </p>
        </div>

        {/* Card */}
        <div className="card max-w-md mx-auto border-2 border-purple/10">
          <div className="text-4xl mb-4">🫠</div>
          <h2 className="text-xl font-bold mb-2 text-purple-dark">
            Séance gratuite
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Dites-nous ce que vous voyez. On vous dira ce que ça dit de
            vous.
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
                placeholder="Nom du sujet..."
                maxLength={20}
                className="w-full px-5 py-3 rounded-full border-2 border-purple/20 focus:border-purple focus:outline-none text-center text-lg font-semibold transition-colors bg-cream placeholder:text-gray-400"
              />
              {error && (
                <p className="text-pink text-sm mt-2 font-medium">{error}</p>
              )}
            </div>
            <button type="submit" className="btn-primary w-full">
              Débuter la séance
            </button>
          </form>
        </div>

        {/* Features */}
        <div className="mt-10 grid grid-cols-3 gap-4 text-center">
          <div className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <div className="text-3xl mb-2">🖋️</div>
            <p className="text-xs font-semibold text-purple-dark/60">
              10 taches d&apos;encre
            </p>
          </div>
          <div className="animate-slide-up" style={{ animationDelay: "0.4s" }}>
            <div className="text-3xl mb-2">🧪</div>
            <p className="text-xs font-semibold text-purple-dark/60">
              Profil psychologique
            </p>
          </div>
          <div className="animate-slide-up" style={{ animationDelay: "0.6s" }}>
            <div className="text-3xl mb-2">🏆</div>
            <p className="text-xs font-semibold text-purple-dark/60">
              Classement des sujets
            </p>
          </div>
        </div>

        <p className="mt-8 text-xs text-purple/30 italic">
          Avertissement : toute réponse sera utilisée contre votre
          santé mentale. Il n&apos;y a pas de bonne réponse.
        </p>
      </div>
    </div>
  );
}
