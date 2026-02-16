"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePlayer } from "@/context/PlayerContext";
import { Brain, ClipboardList, Pill, Smile, Trophy } from "lucide-react";

export default function EvaluationHome() {
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
    sessionStorage.setItem("evaluation-pseudo", trimmed);
    router.push("/evaluation/quiz");
  }

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Decorative floaters */}
      <div className="absolute top-32 left-10 animate-float select-none">
        <Brain size={56} className="text-black/20" />
      </div>
      <div
        className="absolute top-48 right-10 animate-float select-none"
        style={{ animationDelay: "1s" }}
      >
        <ClipboardList size={48} className="text-black/20" />
      </div>
      <div
        className="absolute bottom-20 left-20 animate-float select-none"
        style={{ animationDelay: "2s" }}
      >
        <Pill size={48} className="text-black/20" />
      </div>

      <div className="animate-slide-up max-w-lg w-full text-center relative z-10">
        {/* Title */}
        <div className="mb-8">
          <div className="inline-block text-blue text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4">
            Certifié par l&apos;Institut Imaginaire de Pseudo-Psychologie
          </div>
          <h1
            className="text-4xl md:text-5xl font-black mb-3 leading-tight text-foreground"
          >
            Évaluation Émotionnelle
          </h1>
          <p className="text-base text-black font-medium leading-relaxed">
            5 émojis. 4 choix. Un rapport psychiatrique complet ajouté à votre
            profil pour toujours.
          </p>
        </div>

        {/* Card */}
        <div className="card max-w-md mx-auto border border-black">
          <div className="flex justify-center mb-4"><Brain size={36} className="text-black" /></div>
          <h2 className="text-xl font-bold mb-2 text-black">
            Consultation gratuite
          </h2>
          <p className="text-sm text-black mb-6">
            Répondez honnêtement. Chaque réponse révèle un trouble que vous
            ignoriez avoir.
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
                placeholder="Nom du patient..."
                maxLength={20}
                className="w-full px-5 py-3 rounded-full border border-black focus:border-black focus:outline-none text-center text-lg font-semibold transition-colors bg-white placeholder:text-black"
              />
              {error && (
                <p className="text-red text-sm mt-2 font-medium">{error}</p>
              )}
            </div>
            <button
              type="submit"
              className="w-full font-bold text-white py-3 px-6 rounded-full transition-all hover:scale-105 bg-blue"
            >
              Commencer l&apos;évaluation
            </button>
          </form>
        </div>

        {/* Features */}
        <div className="mt-10 grid grid-cols-3 gap-4 text-center">
          <div className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <div className="flex justify-center mb-2"><Smile size={28} className="text-black" /></div>
            <p className="text-xs font-semibold text-black">
              5 émojis analysés
            </p>
          </div>
          <div className="animate-slide-up" style={{ animationDelay: "0.4s" }}>
            <div className="flex justify-center mb-2"><ClipboardList size={28} className="text-black" /></div>
            <p className="text-xs font-semibold text-black">
              Rapport psychiatrique
            </p>
          </div>
          <div className="animate-slide-up" style={{ animationDelay: "0.6s" }}>
            <div className="flex justify-center mb-2"><Trophy size={28} className="text-black" /></div>
            <p className="text-xs font-semibold text-black">
              Classement des patients
            </p>
          </div>
        </div>

        <p className="mt-8 text-xs text-foreground italic">
          Ce test scientifique ultra-précis déterminera avec exactitude vos
          troubles psychologiques cachés. Toute ressemblance avec de vraies
          pathologies est purement intentionnelle.
        </p>
      </div>
    </div>
  );
}
