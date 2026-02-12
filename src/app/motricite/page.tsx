"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePlayer } from "@/context/PlayerContext";
import { Target, MousePointer, Brain, Timer, Trophy } from "lucide-react";

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
      <div className="absolute top-32 left-10 animate-float select-none">
        <Target size={56} className="text-black/20" />
      </div>
      <div
        className="absolute top-48 right-10 animate-float select-none"
        style={{ animationDelay: "1s" }}
      >
        <MousePointer size={48} className="text-black/20" />
      </div>
      <div
        className="absolute bottom-20 left-20 animate-float select-none"
        style={{ animationDelay: "2s" }}
      >
        <Brain size={48} className="text-black/20" />
      </div>

      <div className="animate-slide-up max-w-lg w-full text-center relative z-10">
        {/* Title */}
        <div className="mb-8">
          <div className="inline-block text-blue text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4">
            Test neuromoteur officiel
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-3 leading-tight text-blue">
            Test de Motricité Fine
          </h1>
          <p className="text-base text-black font-medium leading-relaxed">
            Évaluation complète de votre coordination oeil-main
          </p>
        </div>

        {/* Intro card */}
        <div className="card max-w-md mx-auto border border-blue text-left mb-6">
          <div className="flex justify-center mb-4"><Target size={36} className="text-black" /></div>
          <p className="text-sm text-black leading-relaxed mb-4">
            Ce test scientifique mesure la précision de vos mouvements à travers
            <span className="font-bold text-blue"> 5 niveaux</span> de
            difficulté croissante. Cliquez sur les cibles le plus rapidement et
            précisément possible.
          </p>
          <p className="text-sm text-black leading-relaxed mb-4">
            Les cibles changent de comportement à chaque niveau : statiques,
            rétrécissantes, mobiles, tremblantes, puis tout à la fois.
          </p>
          <p className="text-sm font-bold text-blue text-center">
            Chaque clic raté sera analysé. Votre système nerveux sera jugé.
          </p>
        </div>

        {/* Pseudo form */}
        <div className="card max-w-md mx-auto border border-blue">
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
                className="w-full px-5 py-3 rounded-full border border-blue focus:border-blue focus:outline-none text-center text-lg font-semibold transition-colors bg-white placeholder:text-black"
              />
              {error && (
                <p className="text-red text-sm mt-2 font-medium">{error}</p>
              )}
            </div>
            <button
              type="submit"
              className="w-full font-bold text-white py-3 px-6 rounded-full transition-all hover:scale-105 bg-blue"
            >
              Commencer le test
            </button>
          </form>

          {!player && (
            <p className="text-xs text-blue mt-3 text-center">
              <Link href="/connexion" className="underline hover:text-blue">
                Connectez-vous
              </Link>{" "}
              pour sauvegarder vos résultats sur votre profil
            </p>
          )}
        </div>

        {/* Features */}
        <div className="mt-10 grid grid-cols-3 gap-4 text-center">
          <div className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <div className="flex justify-center mb-2"><Target size={28} className="text-black" /></div>
            <p className="text-xs font-semibold text-black">
              5 niveaux progressifs
            </p>
          </div>
          <div className="animate-slide-up" style={{ animationDelay: "0.4s" }}>
            <div className="flex justify-center mb-2"><Timer size={28} className="text-black" /></div>
            <p className="text-xs font-semibold text-black">
              Chronométré
            </p>
          </div>
          <div className="animate-slide-up" style={{ animationDelay: "0.6s" }}>
            <div className="flex justify-center mb-2"><Trophy size={28} className="text-black" /></div>
            <p className="text-xs font-semibold text-black">
              Classement des patients
            </p>
          </div>
        </div>

        <p className="mt-8 text-xs text-blue italic">
          Avertissement : ce test n&apos;est pas reconnu par la communauté
          médicale. Les diagnostics sont aussi fiables qu&apos;un horoscope.
        </p>
      </div>
    </div>
  );
}
