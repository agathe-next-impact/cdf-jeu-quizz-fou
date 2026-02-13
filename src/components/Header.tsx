"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePlayer } from "@/context/PlayerContext";
import { ThemeToggle } from "./ThemeToggle";
import { Laugh, Trophy } from "lucide-react";
import GameIcon from "./GameIcon";
import { DecodeFr } from "./decode-fr";

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
                : "Centre expert en auto-diagnostic de folie furieuse";

  const title = "Comme des Fous";
  const textSize =
    title.length > 30
      ? "text-2xl md:text-[3.5vw]"
      : title.length > 23
        ? "text-2xl md:text-[5.7vw]"
        : title.length > 19
          ? "text-2xl md:text-[6.2vw]"
          : title.length > 15
            ? "text-3xl md:text-[7.7vw]"
            : "text-3xl md:text-[9.5vw]";

  const classementHref = isDSM6
    ? "/dsm6/classement"
    : isRorschach
      ? "/rorschach/classement"
      : isEvaluation
        ? "/evaluation/classement"
        : isEvasion
          ? "/evasion/classement"
          : isMotricite
            ? "/motricite/classement"
            : isCognitif
              ? "/cognitif/classement"
              : null;

  const isOnClassement = pathname.endsWith("/classement");
  const isOnHallOfFame = pathname === "/hall-of-fame";
  const isOnProfil = pathname === "/profil";
  const isOnConnexion = pathname === "/connexion";

  const linkClass = "w-full px-2 md:px-4 md:pl-4 border-l border-black/20 font-normal transition-colors flex items-center h-full";

  const isActiveColor = isOnClassement || isOnHallOfFame || isOnProfil || isOnConnexion;

  const heroBg = isOnClassement
    ? "bg-blue"
    : isOnHallOfFame
      ? "bg-yellow"
      : isOnProfil
        ? "bg-red"
        : isOnConnexion
          ? "bg-blue"
          : "bg-white";

  const heroText = isActiveColor && !isOnHallOfFame ? "text-white" : "text-black";

  return (
    <header className="bg-white text-black">
      {/* Top bar */}
      <nav className="w-full h-10 bg-white flex justify-between items-center text-sm md:text-base font-sans">
        <Link
          href="/"
          className="w-full px-2 md:px-4 md:pl-4 font-normal text-black tracking-tight transition-colors flex items-center h-full border-l border-black/20"
        >
          <span className="block md:hidden font-bold">CdF</span>
          <span className="hidden md:block">Comme des Fous</span>
        </Link>

        {classementHref && (
          <Link
            href={classementHref}
            className={`${linkClass} ${isOnClassement ? "bg-blue text-white" : "text-black"}`}
          >
            <span className="block md:hidden text-xs">Class.</span>
            <span className="hidden md:block">Classement</span>
          </Link>
        )}

        {isGame ? (
          <Link
            href="/"
            className={`${linkClass} text-black`}
          >
            <span className="block md:hidden text-xs">Jeux</span>
            <span className="hidden md:block">Tous les jeux</span>
          </Link>
        ) : (
          <Link
            href="/hall-of-fame"
            className={`${linkClass} ${isOnHallOfFame ? "bg-yellow text-black" : "text-black"}`}
          >
            <Trophy size={14} className="mr-1.5 hidden md:block" />
            <span>Hall of Fame</span>
          </Link>
        )}

        {player ? (
          <Link
            href="/profil"
            className={`${linkClass} gap-1.5 ${isOnProfil ? "bg-red text-white" : "text-black"}`}
          >
            <span className="w-5 h-5 flex items-center justify-center shrink-0">
              <GameIcon name={player.avatar || player.pseudo.charAt(0).toUpperCase()} size={16} />
            </span>
            <span className="truncate max-w-[80px] sm:max-w-none text-xs sm:text-sm">{player.pseudo}</span>
            {player.badgeEmoji && (
              <span className="hidden md:inline shrink-0" title={player.badgeName}>
                <GameIcon name={player.badgeEmoji} size={12} />
              </span>
            )}
          </Link>
        ) : (
          <Link
            href="/connexion"
            className={`${linkClass} ${isOnConnexion ? "bg-blue text-white" : "text-black"}`}
          >
            <span className="text-xs sm:text-sm">Connexion</span>
          </Link>
        )}

        <div className="flex items-center justify-end px-2 h-full border-l border-black/20 shrink-0">
          <ThemeToggle />
        </div>
      </nav>

      {/* Hero title area */}
      <Link href="/" className={`flex items-start md:items-center px-4 md:px-6 pb-4 md:pb-6 pt-4 ${heroBg}`}>
        <div className="mr-4 md:mr-8 shrink-0">
          <Laugh className={`w-12 h-12 md:w-28 md:h-28 ${heroText}`} />
        </div>
        <div className="flex flex-col">
          <h1 className={`w-full max-w-[100vw] font-heading font-semibold ${textSize} tracking-tight leading-none uppercase ${heroText}`}>
            <DecodeFr>{title}</DecodeFr>
          </h1>
          <div className="mt-1 md:ml-1">
            <h2 className={`font-heading font-normal text-sm md:text-2xl ${heroText}`}>
              <DecodeFr>{subtitle}</DecodeFr>
            </h2>
          </div>
        </div>
      </Link>
    </header>
  );
}
