"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePlayer } from "@/context/PlayerContext";
import { Brain, Eye, Feather, Palette, PenTool, FlaskConical, Trophy } from "lucide-react";

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
      <div className="absolute top-32 left-10 animate-float select-none">
        <Brain size={56} className="text-black/20" />
      </div>
      <div
        className="absolute top-48 right-10 animate-float select-none"
        style={{ animationDelay: "1s" }}
      >
        <Eye size={48} className="text-black/20" />
      </div>
      <div
        className="absolute bottom-20 left-20 animate-float select-none"
        style={{ animationDelay: "2s" }}
      >
        <Feather size={48} className="text-black/20" />
      </div>

      <div className="animate-slide-up max-w-lg w-full text-center relative z-10">
        {/* Title */}
        <div className="mb-8">
          <div className="inline-block text-blue text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4">
            Évaluation Psychologique Officieuse&trade;
          </div>
          <h1
            className="text-4xl md:text-5xl font-black mb-3 leading-tight text-black"
          >
            Test de Rorschach
          </h1>
          <p className="text-base text-black font-medium leading-relaxed">
            10 taches d&apos;encre. 3 choix. Zéro chance d&apos;être
            diagnostiqué(e) sain(e) d&apos;esprit.
          </p>
        </div>

        {/* Card */}
        <div className="card max-w-md mx-auto border border-blue">
          <div className="flex justify-center mb-4"><Palette size={36} className="text-black" /></div>
          <h2 className="text-xl font-bold mb-2 text-black">
            Séance gratuite
          </h2>
          <p className="text-sm text-black mb-6">
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
                className="w-full px-5 py-3 rounded-full border border-blue focus:border-blue focus:outline-none text-center text-lg font-semibold transition-colors bg-white placeholder:text-black"
              />
              {error && (
                <p className="text-red text-sm mt-2 font-medium">{error}</p>
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
            <div className="flex justify-center mb-2"><PenTool size={28} className="text-black" /></div>
            <p className="text-xs font-semibold text-black">
              10 taches d&apos;encre
            </p>
          </div>
          <div className="animate-slide-up" style={{ animationDelay: "0.4s" }}>
            <div className="flex justify-center mb-2"><FlaskConical size={28} className="text-black" /></div>
            <p className="text-xs font-semibold text-black">
              Profil psychologique
            </p>
          </div>
          <div className="animate-slide-up" style={{ animationDelay: "0.6s" }}>
            <div className="flex justify-center mb-2"><Trophy size={28} className="text-black" /></div>
            <p className="text-xs font-semibold text-black">
              Classement des sujets
            </p>
          </div>
        </div>

        <p className="mt-8 text-xs text-blue italic">
          Avertissement : toute réponse sera utilisée contre votre
          santé mentale. Il n&apos;y a pas de bonne réponse.
        </p>
      </div>
    </div>
  );
}
