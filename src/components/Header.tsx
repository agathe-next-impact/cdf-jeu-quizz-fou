"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const isQuizFou = pathname.startsWith("/quiz-fou");

  return (
    <header className="gradient-bg text-white py-4 px-6 shadow-lg">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
          <span className="text-3xl">🤪</span>
          <div>
            <h1 className="text-xl font-bold leading-tight">Comme des Fous</h1>
            <p className="text-xs text-purple-200 tracking-wide">
              {isQuizFou ? "Le Quizz le plus fou !" : "Les jeux les plus fous !"}
            </p>
          </div>
        </Link>
        <nav className="flex gap-3">
          {isQuizFou ? (
            <>
              <Link
                href="/quiz-fou/classement"
                className="text-sm font-semibold bg-white/15 hover:bg-white/25 px-4 py-2 rounded-full transition-all"
              >
                Classement
              </Link>
              <Link
                href="/"
                className="text-sm font-semibold bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full transition-all"
              >
                Tous les jeux
              </Link>
            </>
          ) : (
            <Link
              href="/quiz-fou"
              className="text-sm font-semibold bg-white/15 hover:bg-white/25 px-4 py-2 rounded-full transition-all"
            >
              Quizz Fou
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
