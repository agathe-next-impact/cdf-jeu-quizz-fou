"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePlayer } from "@/context/PlayerContext";

export default function Header() {
  const pathname = usePathname();
  const { player } = usePlayer();
  const isDSM6 = pathname.startsWith("/dsm6");
  const isRorschach = pathname.startsWith("/rorschach");
  const isEvaluation = pathname.startsWith("/evaluation");
  const isEvasion = pathname.startsWith("/evasion");
  const isMotricite = pathname.startsWith("/motricite");
  const isCognitif = pathname.startsWith("/cognitif");
  const isGame = isDSM6 || isRorschach || isEvaluation || isEvasion || isMotricite || isCognitif;

  const subtitle = isDSM6
      ? "DSM-6 — Version Beta"
      : isRorschach
        ? "Test de Rorschach"
        : isEvaluation
          ? "Évaluation Émotionnelle"
          : isEvasion
            ? "Évasion Psychiatrique"
            : isMotricite
              ? "Test de Motricité Fine"
              : isCognitif
                ? "Test Cognitif Absurde"
                : "Les jeux les plus fous !";

  return (
    <header className="gradient-bg text-white py-4 px-6 shadow-lg">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
          <span className="text-3xl">🤪</span>
          <div>
            <h1 className="text-xl font-bold leading-tight">Comme des Fous</h1>
            <p className="text-xs text-purple-200 tracking-wide">{subtitle}</p>
          </div>
        </Link>
        <nav className="flex gap-3 items-center">
          {isDSM6 && (
            <Link
              href="/dsm6/classement"
              className="text-sm font-semibold bg-white/15 hover:bg-white/25 px-4 py-2 rounded-full transition-all"
            >
              Classement
            </Link>
          )}
          {isRorschach && (
            <Link
              href="/rorschach/classement"
              className="text-sm font-semibold bg-white/15 hover:bg-white/25 px-4 py-2 rounded-full transition-all"
            >
              Classement
            </Link>
          )}
          {isEvaluation && (
            <Link
              href="/evaluation/classement"
              className="text-sm font-semibold bg-white/15 hover:bg-white/25 px-4 py-2 rounded-full transition-all"
            >
              Classement
            </Link>
          )}
          {isEvasion && (
            <Link
              href="/evasion/classement"
              className="text-sm font-semibold bg-white/15 hover:bg-white/25 px-4 py-2 rounded-full transition-all"
            >
              Classement
            </Link>
          )}
          {isMotricite && (
            <Link
              href="/motricite/classement"
              className="text-sm font-semibold bg-white/15 hover:bg-white/25 px-4 py-2 rounded-full transition-all"
            >
              Classement
            </Link>
          )}
          {isCognitif && (
            <Link
              href="/cognitif/classement"
              className="text-sm font-semibold bg-white/15 hover:bg-white/25 px-4 py-2 rounded-full transition-all"
            >
              Classement
            </Link>
          )}
          {isGame ? (
            <Link
              href="/"
              className="text-sm font-semibold bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full transition-all"
            >
              Tous les jeux
            </Link>
          ) : (
            <>
              <Link
                href="/dsm6"
                className="text-sm font-semibold bg-white/15 hover:bg-white/25 px-4 py-2 rounded-full transition-all hidden sm:inline-block"
              >
                DSM-6
              </Link>
            </>
          )}

          {/* Profile / Auth */}
          {player ? (
            <Link
              href="/profil"
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full transition-all"
            >
              <span className="w-6 h-6 rounded-full bg-white/30 flex items-center justify-center text-sm">
                {player.avatar || player.pseudo.charAt(0).toUpperCase()}
              </span>
              <span className="text-sm font-semibold hidden sm:inline">
                {player.pseudo}
              </span>
            </Link>
          ) : (
            <Link
              href="/connexion"
              className="text-sm font-semibold bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full transition-all"
            >
              Connexion
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
