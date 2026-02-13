"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePlayer } from "@/context/PlayerContext";
import { Hospital, Lock, KeyRound, BookOpen, Timer, Trophy } from "lucide-react";

export default function EvasionHome() {
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
    sessionStorage.setItem("evasion-pseudo", trimmed);
    router.push("/evasion/quiz");
  }

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Decorative floaters */}
      <div className="absolute top-32 left-10 animate-float select-none">
        <Hospital size={56} className="text-black/20" />
      </div>
      <div
        className="absolute top-48 right-10 animate-float select-none"
        style={{ animationDelay: "1s" }}
      >
        <Lock size={48} className="text-black/20" />
      </div>
      <div
        className="absolute bottom-20 left-20 animate-float select-none"
        style={{ animationDelay: "2s" }}
      >
        <KeyRound size={48} className="text-black/20" />
      </div>

      <div className="animate-slide-up max-w-lg w-full text-center relative z-10">
        {/* Title */}
        <div className="mb-8">
          <div className="inline-block text-blue text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4">
            Un jeu dont vous êtes le héros
          </div>
          <h1
            className="text-4xl md:text-5xl font-black mb-3 leading-tight text-blue"
          >
            Évasion Psychiatrique
          </h1>
          <p className="text-base text-black font-medium leading-relaxed">
            Votre destin entre les mains du Dr. Moreau
          </p>
        </div>

        {/* Story intro card */}
        <div className="card max-w-md mx-auto border border-black text-left mb-6">
          <div className="flex justify-center mb-4"><Hospital size={36} className="text-black" /></div>
          <p className="text-sm text-black leading-relaxed mb-4">
            Vous vous réveillez dans une chambre blanche aseptisée de
            l&apos;Institut Sainte-Marie. Les souvenirs sont flous... Comment
            êtes-vous arrivé ici ?
          </p>
          <p className="text-sm text-black leading-relaxed mb-4">
            Une infirmière vous informe que le{" "}
            <span className="font-bold text-blue">Dr. Moreau</span>,
            psychiatre en chef, va vous évaluer pour déterminer votre date de
            sortie.
          </p>
          <p className="text-sm font-bold text-blue text-center">
            Chaque réponse compte. Saurez-vous convaincre le docteur de votre
            stabilité mentale ?
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
            <div className="flex justify-center mb-2"><BookOpen size={28} className="text-black" /></div>
            <p className="text-xs font-semibold text-black">
              6 scènes narratives
            </p>
          </div>
          <div className="animate-slide-up" style={{ animationDelay: "0.4s" }}>
            <div className="flex justify-center mb-2"><Timer size={28} className="text-black" /></div>
            <p className="text-xs font-semibold text-black">
              Compteur de jours
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
          Avertissement : le Dr. Moreau n&apos;est pas un vrai psychiatre.
          Aucun patient n&apos;a été maltraité durant la conception de ce jeu.
        </p>
      </div>
    </div>
  );
}
