"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePlayer } from "@/context/PlayerContext";
import { Brain, FlaskConical, BarChart3, PenLine, Timer } from "lucide-react";

export default function CognitifHome() {
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
      setError("Votre identifiant de cobaye doit faire au moins 2 caractères.");
      return;
    }
    if (trimmed.length > 20) {
      setError("Identifiant trop long (20 caractères max).");
      return;
    }
    sessionStorage.setItem("cognitif-pseudo", trimmed);
    router.push("/cognitif/quiz");
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
        <FlaskConical size={48} className="text-black/20" />
      </div>
      <div
        className="absolute bottom-20 left-20 animate-float select-none"
        style={{ animationDelay: "2s" }}
      >
        <BarChart3 size={48} className="text-black/20" />
      </div>

      <div className="animate-slide-up max-w-lg w-full text-center relative z-10">
        {/* Title */}
        <div className="mb-8">
          <div className="inline-block text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4">
            Évaluation cognitive non-homologuée
          </div>
          <h1
            className="text-4xl md:text-5xl font-black mb-3 leading-tight text-red"
          >
            Test Cognitif Absurde
          </h1>
          <p className="text-base text-black font-medium leading-relaxed">
            8 questions de logique pour calculer votre QI (non-officiel)
          </p>
        </div>

        {/* Intro card */}
        <div className="card max-w-md mx-auto border border-black text-left mb-6">
          <div className="flex justify-center mb-4"><Brain size={36} className="text-black" /></div>
          <p className="text-sm text-black leading-relaxed mb-4">
            Ce test a été élaboré par un comité de neuroscientifiques
            autoproclamés après 72 heures sans dormir. Il mesure vos capacités
            de raisonnement logique, mathématique et latéral.
          </p>
          <p className="text-sm text-black leading-relaxed mb-4">
            Chaque question est chronométrée :{" "}
            <span className="font-bold text-red">30 secondes</span> pour
            répondre. Pas de QCM — vous devez taper votre réponse.
          </p>
          <p className="text-sm font-bold text-black text-center">
            Votre QI sera calculé avec une précision toute relative.
          </p>
        </div>

        {/* Pseudo form */}
        <div className="card max-w-md mx-auto border border-black">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                value={pseudo}
                onChange={(e) => {
                  setPseudo(e.target.value);
                  setError("");
                }}
                placeholder="Identifiant du cobaye..."
                maxLength={20}
                className="w-full px-5 py-3 rounded-full border border-black focus:border-black focus:outline-none text-center text-lg font-semibold transition-colors bg-white placeholder:text-black"
              />
              {error && (
                <p className="text-red text-sm mt-2 font-medium">{error}</p>
              )}
            </div>
            <button
              type="submit"
              className="w-full font-bold text-white py-3 px-6 rounded-full transition-all hover:scale-105 bg-red"
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
            <div className="flex justify-center mb-2"><PenLine size={28} className="text-black" /></div>
            <p className="text-xs font-semibold text-black">
              8 questions libres
            </p>
          </div>
          <div className="animate-slide-up" style={{ animationDelay: "0.4s" }}>
            <div className="flex justify-center mb-2"><Timer size={28} className="text-black" /></div>
            <p className="text-xs font-semibold text-black">
              30s par question
            </p>
          </div>
          <div className="animate-slide-up" style={{ animationDelay: "0.6s" }}>
            <div className="flex justify-center mb-2"><FlaskConical size={28} className="text-black" /></div>
            <p className="text-xs font-semibold text-black">
              QI calculé en direct
            </p>
          </div>
        </div>

        <p className="mt-8 text-xs text-blue italic">
          Avertissement : ce test n&apos;a aucune valeur scientifique. Votre vrai QI
          est probablement différent. Probablement.
        </p>
      </div>
    </div>
  );
}
