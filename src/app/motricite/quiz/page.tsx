"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Target, Meh, Skull } from "lucide-react";
import {
  motriciteLevels,
  getLevelDiagnosis,
  type MotriciteLevel,
} from "@/data/motricite-questions";

/* ------------------------------------------------------------------ */
/*  Target type                                                        */
/* ------------------------------------------------------------------ */
interface TargetObj {
  id: number;
  x: number;
  y: number;
  size: number;
  hit: boolean;
  vx: number;
  vy: number;
  jitterX: number;
  jitterY: number;
  shrinkRatio: number;
}

/* ------------------------------------------------------------------ */
/*  Game phases                                                        */
/* ------------------------------------------------------------------ */
type Phase = "level-intro" | "playing" | "level-result" | "done";

/* ------------------------------------------------------------------ */
/*  Per-level results stored for final report                          */
/* ------------------------------------------------------------------ */
interface LevelResult {
  levelIndex: number;
  levelName: string;
  hits: number;
  misses: number;
  total: number;
  successRate: number;
  diagnosis: { condition: string; severity: string; explanation: string };
}

/* ------------------------------------------------------------------ */
/*  Logical arena — all game physics run in this coordinate space      */
/* ------------------------------------------------------------------ */
const ARENA_W = 600;
const ARENA_H = 400;
const TICK_MS = 16; // ~60fps
const MIN_TAP_SIZE = 22; // minimum touch target radius in logical px

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function MotriciteQuizPage() {
  const router = useRouter();
  const pseudoRef = useRef<string>("");

  /* Game state */
  const [phase, setPhase] = useState<Phase>("level-intro");
  const [currentLevel, setCurrentLevel] = useState(0);
  const [targets, setTargets] = useState<TargetObj[]>([]);
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [levelResults, setLevelResults] = useState<LevelResult[]>([]);

  /* Responsive arena scaling */
  const arenaContainerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  /* Refs for animation loop */
  const targetsRef = useRef<TargetObj[]>([]);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hitsRef = useRef(0);
  const missesRef = useRef(0);
  const levelRef = useRef<MotriciteLevel>(motriciteLevels[0]);
  const startTimeRef = useRef(0);

  /* ---------------------------------------------------------------- */
  /*  Responsive: measure container and compute scale                  */
  /* ---------------------------------------------------------------- */
  useEffect(() => {
    function measure() {
      if (!arenaContainerRef.current) return;
      const maxW = arenaContainerRef.current.clientWidth;
      setScale(Math.min(1, maxW / ARENA_W));
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [phase]);

  /* ---------------------------------------------------------------- */
  /*  Bootstrap                                                        */
  /* ---------------------------------------------------------------- */
  useEffect(() => {
    const pseudo = sessionStorage.getItem("motricite-pseudo");
    if (!pseudo) {
      router.push("/motricite");
      return;
    }
    pseudoRef.current = pseudo;
  }, [router]);

  /* ---------------------------------------------------------------- */
  /*  Cleanup on unmount                                               */
  /* ---------------------------------------------------------------- */
  useEffect(() => {
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  /* ---------------------------------------------------------------- */
  /*  Spawn targets for a level                                        */
  /* ---------------------------------------------------------------- */
  const spawnTargets = useCallback((level: MotriciteLevel): TargetObj[] => {
    const tgts: TargetObj[] = [];
    for (let i = 0; i < level.targetCount; i++) {
      const size = level.targetSize;
      tgts.push({
        id: i,
        x: Math.random() * (ARENA_W - size * 2) + size,
        y: Math.random() * (ARENA_H - size * 2) + size,
        size,
        hit: false,
        vx:
          level.behavior === "moving" || level.behavior === "all"
            ? (Math.random() - 0.5) * 3
            : 0,
        vy:
          level.behavior === "moving" || level.behavior === "all"
            ? (Math.random() - 0.5) * 3
            : 0,
        jitterX: 0,
        jitterY: 0,
        shrinkRatio: 1,
      });
    }
    return tgts;
  }, []);

  /* ---------------------------------------------------------------- */
  /*  Start level                                                      */
  /* ---------------------------------------------------------------- */
  const startLevel = useCallback(
    (levelIndex: number) => {
      const level = motriciteLevels[levelIndex];
      levelRef.current = level;
      hitsRef.current = 0;
      missesRef.current = 0;
      setHits(0);
      setMisses(0);
      setTimeLeft(level.duration);
      startTimeRef.current = Date.now();

      const tgts = spawnTargets(level);
      targetsRef.current = tgts;
      setTargets(tgts);
      setPhase("playing");

      // Countdown timer
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        const elapsed = (Date.now() - startTimeRef.current) / 1000;
        const remaining = Math.max(0, level.duration - elapsed);
        setTimeLeft(Math.ceil(remaining));
        if (remaining <= 0) {
          endLevel(levelIndex);
        }
      }, 200);

      // Tick loop for moving/jittery/shrinking
      if (tickRef.current) clearInterval(tickRef.current);
      tickRef.current = setInterval(() => {
        const cur = targetsRef.current;
        const elapsed = (Date.now() - startTimeRef.current) / 1000;
        const updated = cur.map((t) => {
          if (t.hit) return t;
          const next = { ...t };

          // Moving
          if (level.behavior === "moving" || level.behavior === "all") {
            next.x += next.vx;
            next.y += next.vy;
            if (next.x <= next.size || next.x >= ARENA_W - next.size)
              next.vx *= -1;
            if (next.y <= next.size || next.y >= ARENA_H - next.size)
              next.vy *= -1;
            next.x = Math.max(next.size, Math.min(ARENA_W - next.size, next.x));
            next.y = Math.max(next.size, Math.min(ARENA_H - next.size, next.y));
          }

          // Jittery
          if (level.behavior === "jittery" || level.behavior === "all") {
            next.jitterX = (Math.random() - 0.5) * 6;
            next.jitterY = (Math.random() - 0.5) * 6;
          }

          // Shrinking
          if (level.behavior === "shrinking" || level.behavior === "all") {
            next.shrinkRatio = Math.max(0.3, 1 - elapsed / level.duration * 0.7);
          }

          return next;
        });
        targetsRef.current = updated;
        setTargets([...updated]);
      }, TICK_MS);
    },
    [spawnTargets]
  );

  /* ---------------------------------------------------------------- */
  /*  End level                                                        */
  /* ---------------------------------------------------------------- */
  const endLevel = useCallback(
    (levelIndex: number) => {
      if (tickRef.current) {
        clearInterval(tickRef.current);
        tickRef.current = null;
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      const h = hitsRef.current;
      const m = missesRef.current;
      const totalClicks = h + m;
      const successRate = totalClicks > 0 ? Math.round((h / totalClicks) * 100) : 0;
      const diagnosis = getLevelDiagnosis(levelIndex, successRate);

      const result: LevelResult = {
        levelIndex,
        levelName: motriciteLevels[levelIndex].name,
        hits: h,
        misses: m,
        total: motriciteLevels[levelIndex].targetCount,
        successRate,
        diagnosis,
      };

      setLevelResults((prev) => [...prev, result]);
      setPhase("level-result");
    },
    []
  );

  /* ---------------------------------------------------------------- */
  /*  Handle target click / tap                                        */
  /* ---------------------------------------------------------------- */
  function handleTargetClick(targetId: number) {
    if (phase !== "playing") return;
    const cur = targetsRef.current;
    const idx = cur.findIndex((t) => t.id === targetId && !t.hit);
    if (idx === -1) return;

    cur[idx] = { ...cur[idx], hit: true };
    targetsRef.current = cur;
    setTargets([...cur]);

    hitsRef.current += 1;
    setHits(hitsRef.current);

    if (cur.every((t) => t.hit)) {
      endLevel(currentLevel);
    }
  }

  /* ---------------------------------------------------------------- */
  /*  Handle arena miss (mouse + touch)                                */
  /* ---------------------------------------------------------------- */
  function handleArenaMiss(e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) {
    if (phase !== "playing") return;
    if ((e.target as HTMLElement).dataset.arena === "true") {
      missesRef.current += 1;
      setMisses(missesRef.current);
    }
  }

  /* ---------------------------------------------------------------- */
  /*  Advance to next level or finish                                  */
  /* ---------------------------------------------------------------- */
  function handleNextLevel() {
    const next = currentLevel + 1;
    if (next >= motriciteLevels.length) {
      const allResults = [...levelResults];
      const avgSuccess =
        allResults.length > 0
          ? Math.round(
              allResults.reduce((s, r) => s + r.successRate, 0) /
                allResults.length
            )
          : 0;

      sessionStorage.setItem("motricite-score", String(avgSuccess));
      sessionStorage.setItem(
        "motricite-level-results",
        JSON.stringify(allResults)
      );

      setPhase("done");
      router.push("/motricite/results");
    } else {
      setCurrentLevel(next);
      setPhase("level-intro");
    }
  }

  /* ================================================================ */
  /*  Render: Level Intro                                              */
  /* ================================================================ */
  if (phase === "level-intro") {
    const level = motriciteLevels[currentLevel];
    return (
      <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-md w-full text-center animate-slide-up">
          <div className="flex justify-center mb-6"><Target size={60} /></div>

          <div className="inline-block text-blue text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
            Niveau {level.id} / {motriciteLevels.length}
          </div>

          <h1 className="text-3xl font-black mb-2 text-blue">
            {level.name}
          </h1>

          <p className="text-sm text-black mb-6 leading-relaxed">
            {level.description}
          </p>

          <div className="card mb-6 border border-black">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-black text-blue">
                  {level.targetCount}
                </div>
                <div className="text-xs text-black">cibles</div>
              </div>
              <div>
                <div className="text-2xl font-black text-blue">
                  {level.targetSize}px
                </div>
                <div className="text-xs text-black">taille</div>
              </div>
              <div>
                <div className="text-2xl font-black text-blue">
                  {level.duration}s
                </div>
                <div className="text-xs text-black">temps</div>
              </div>
            </div>
          </div>

          <button
            onClick={() => startLevel(currentLevel)}
            className="font-bold text-white py-3 px-8 rounded-full transition-all hover:scale-105 text-lg bg-blue"
          >
            Commencer
          </button>
        </div>
      </div>
    );
  }

  /* ================================================================ */
  /*  Render: Playing                                                  */
  /* ================================================================ */
  if (phase === "playing") {
    const level = motriciteLevels[currentLevel];
    const renderW = ARENA_W * scale;
    const renderH = ARENA_H * scale;

    return (
      <div className="min-h-[calc(100vh-80px)] flex flex-col items-center px-4 py-6">
        {/* HUD */}
        <div className="w-full flex items-center justify-between mb-4" style={{ maxWidth: renderW }}>
          <div className="text-xs sm:text-sm font-bold text-black truncate mr-2">
            Niv. {level.id} — {level.name}
          </div>
          <div className="flex gap-2 sm:gap-4 items-center shrink-0">
            <div className="text-xs sm:text-sm font-semibold text-blue">
              {hits}/{level.targetCount}
            </div>
            {misses > 0 && (
              <div className="text-xs sm:text-sm font-semibold text-red">
                {misses} raté{misses > 1 ? "s" : ""}
              </div>
            )}
            <div
              className={`text-sm sm:text-lg font-black px-2 sm:px-3 py-1 rounded-full ${
                timeLeft <= 5
                  ? "text-red animate-pulse"
                  : "text-blue"
              }`}
            >
              {timeLeft}s
            </div>
          </div>
        </div>

        {/* Arena container — measures available width */}
        <div ref={arenaContainerRef} className="w-full" style={{ maxWidth: ARENA_W }}>
          <div
            data-arena="true"
            onClick={handleArenaMiss}
            onTouchEnd={handleArenaMiss}
            className="relative border border-black overflow-hidden select-none"
            style={{
              width: renderW,
              height: renderH,
              touchAction: "none",
            }}
          >
            {targets.map((t) => {
              if (t.hit) return null;
              const displaySize = t.size * t.shrinkRatio;
              // Ensure minimum tap target on touch devices
              const tapRadius = Math.max(displaySize, MIN_TAP_SIZE);

              return (
                <button
                  key={t.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTargetClick(t.id);
                  }}
                  onTouchEnd={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    handleTargetClick(t.id);
                  }}
                  className="absolute rounded-full focus:outline-none"
                  style={{
                    /* Tap area: invisible larger zone */
                    width: tapRadius * 2 * scale,
                    height: tapRadius * 2 * scale,
                    left: (t.x + t.jitterX - tapRadius) * scale,
                    top: (t.y + t.jitterY - tapRadius) * scale,
                    /* Transparent — the visible circle is the inner span */
                    background: "transparent",
                  }}
                >
                  {/* Visible target circle */}
                  <span
                    className="absolute rounded-full"
                    style={{
                      width: displaySize * 2 * scale,
                      height: displaySize * 2 * scale,
                      left: (tapRadius - displaySize) * scale,
                      top: (tapRadius - displaySize) * scale,
                      backgroundColor: "var(--color-blue)",
                    }}
                  >
                    {/* Inner dot */}
                    <span
                      className="absolute rounded-full"
                      style={{
                        width: displaySize * 0.6 * 2 * scale,
                        height: displaySize * 0.6 * 2 * scale,
                        top: displaySize * 0.4 * scale,
                        left: displaySize * 0.4 * scale,
                        backgroundColor: "var(--color-blue)",
                        opacity: 0.5,
                      }}
                    />
                  </span>
                </button>
              );
            })}

            {/* Hit effects */}
            {targets
              .filter((t) => t.hit)
              .map((t) => (
                <div
                  key={`hit-${t.id}`}
                  className="absolute pointer-events-none animate-ping"
                  style={{
                    width: 20 * scale,
                    height: 20 * scale,
                    left: (t.x - 10) * scale,
                    top: (t.y - 10) * scale,
                    borderRadius: "50%",
                    backgroundColor: "var(--color-blue)",
                  }}
                />
              ))}
          </div>
        </div>

        {/* Miss counter */}
        {misses > 0 && (
          <div className="mt-3 text-sm font-medium text-red">
            {misses} clic{misses > 1 ? "s" : ""} raté{misses > 1 ? "s" : ""}
          </div>
        )}
      </div>
    );
  }

  /* ================================================================ */
  /*  Render: Level Result                                             */
  /* ================================================================ */
  if (phase === "level-result") {
    const lastResult = levelResults[levelResults.length - 1];
    if (!lastResult) return null;
    const diag = lastResult.diagnosis;
    const isLast = currentLevel >= motriciteLevels.length - 1;

    return (
      <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-md w-full text-center animate-slide-up">
          <div className="flex justify-center mb-4">
            {lastResult.successRate >= 80
              ? <Target size={60} />
              : lastResult.successRate >= 50
                ? <Meh size={60} />
                : <Skull size={60} />}
          </div>

          <div className="inline-block text-blue text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
            Résultat Niveau {currentLevel + 1}
          </div>

          <h2 className="text-2xl font-black text-black mb-1">
            {lastResult.hits} / {lastResult.total} cibles touchées
          </h2>
          {lastResult.misses > 0 && (
            <p className="text-sm font-medium text-red mb-1">
              {lastResult.misses} clic{lastResult.misses > 1 ? "s" : ""} raté{lastResult.misses > 1 ? "s" : ""}
            </p>
          )}

          <div
            className={`text-4xl font-black mb-4 ${
              lastResult.successRate >= 80
                ? "text-blue"
                : lastResult.successRate >= 50
                  ? "text-yellow"
                  : "text-red"
            }`}
          >
            {lastResult.successRate}%
          </div>

          {/* Diagnosis card */}
          <div className="card border border-black text-left mb-6">
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`text-xs font-black px-2 py-0.5 rounded-full uppercase ${
                  lastResult.successRate >= 80
                    ? "text-yellow"
                    : lastResult.successRate >= 50
                      ? "text-yellow"
                      : "text-red"
                }`}
              >
                {diag.severity}
              </span>
            </div>
            <h3 className="font-bold text-black mb-2">
              {diag.condition}
            </h3>
            <p className="text-sm text-black leading-relaxed italic">
              &laquo; {diag.explanation} &raquo;
            </p>
          </div>

          <button
            onClick={handleNextLevel}
            className="font-bold text-white py-3 px-8 rounded-full transition-all hover:scale-105 bg-blue"
          >
            {isLast ? "Voir le rapport complet" : "Niveau suivant"}
          </button>
        </div>
      </div>
    );
  }

  /* ================================================================ */
  /*  Render: Done (redirect)                                          */
  /* ================================================================ */
  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
      <div className="text-xl text-blue animate-pulse">
        Compilation du rapport neurologique...
      </div>
    </div>
  );
}
