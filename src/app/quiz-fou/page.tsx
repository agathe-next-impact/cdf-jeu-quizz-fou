"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function QuizFouHome() {
  const [pseudo, setPseudo] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = pseudo.trim();
    if (trimmed.length < 2) {
      setError("Ton pseudo doit faire au moins 2 caractères !");
      return;
    }
    if (trimmed.length > 20) {
      setError("Ton pseudo est trop long (20 caractères max) !");
      return;
    }
    sessionStorage.setItem("pseudo", trimmed);
    router.push("/quiz-fou/quiz");
  }

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-32 left-10 text-6xl animate-float opacity-20 select-none">
        🤪
      </div>
      <div
        className="absolute top-48 right-10 text-5xl animate-float opacity-20 select-none"
        style={{ animationDelay: "1s" }}
      >
        🎭
      </div>
      <div
        className="absolute bottom-20 left-20 text-5xl animate-float opacity-20 select-none"
        style={{ animationDelay: "2s" }}
      >
        🎪
      </div>

      <div className="animate-slide-up max-w-lg w-full text-center relative z-10">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-5xl md:text-6xl font-black mb-4 gradient-text leading-tight">
            Qui est le plus fou ?
          </h1>
          <p className="text-lg text-purple-dark/70 font-medium">
            15 questions pour mesurer ton niveau de folie !
          </p>
        </div>

        {/* Card */}
        <div className="card max-w-md mx-auto">
          <div className="text-4xl mb-4">🎯</div>
          <h2 className="text-xl font-bold mb-2 text-purple-dark">
            Prêt(e) à jouer ?
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Entre ton pseudo pour commencer le quizz
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
                placeholder="Ton pseudo..."
                maxLength={20}
                className="w-full px-5 py-3 rounded-full border-2 border-purple/20 focus:border-purple focus:outline-none text-center text-lg font-semibold transition-colors bg-cream placeholder:text-gray-400"
              />
              {error && (
                <p className="text-pink text-sm mt-2 font-medium">{error}</p>
              )}
            </div>
            <button type="submit" className="btn-primary w-full">
              C&apos;est parti !
            </button>
          </form>
        </div>

        {/* Features */}
        <div className="mt-10 grid grid-cols-3 gap-4 text-center">
          <div className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <div className="text-3xl mb-2">🏆</div>
            <p className="text-xs font-semibold text-purple-dark/60">
              Classement en direct
            </p>
          </div>
          <div className="animate-slide-up" style={{ animationDelay: "0.4s" }}>
            <div className="text-3xl mb-2">🎯</div>
            <p className="text-xs font-semibold text-purple-dark/60">
              15 questions folles
            </p>
          </div>
          <div className="animate-slide-up" style={{ animationDelay: "0.6s" }}>
            <div className="text-3xl mb-2">⚡</div>
            <p className="text-xs font-semibold text-purple-dark/60">
              Score instantané
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
