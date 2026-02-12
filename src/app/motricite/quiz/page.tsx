"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  motriciteLevels,
  getLevelDiagnosis,
  type MotriciteLevel,
} from "@/data/motricite-questions";

/* ------------------------------------------------------------------ */
/*  Target type                                                        */
/* ------------------------------------------------------------------ */
interface Target {
  id: number;
  x: number;
  y: number;
  size: number;
  hit: boolean;
  /** Moving targets: velocity */
  vx: number;
  vy: number;
  /** Jittery targets: offset */
  jitterX: number;
  jitterY: number;
  /** Shrinking targets: remaining ratio (1 → 0) */
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
  total: number;
  successRate: number;
  diagnosis: { condition: string; severity: string; explanation: string };
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */
const ARENA_W = 600;
const ARENA_H = 400;
const TICK_MS = 16; // ~60fps

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function MotriciteQuizPage() {
  const router = useRouter();
  const pseudoRef = useRef<string>("");

  /* Game state */
  const [phase, setPhase] = useState<Phase>("level-intro");
  const [currentLevel, setCurrentLevel] = useState(0);
  const [targets, setTargets] = useState<Target[]>([]);
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [levelResults, setLevelResults] = useState<LevelResult[]>([]);

  /* Refs for animation loop */
  const targetsRef = useRef<Target[]>([]);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hitsRef = useRef(0);
  const levelRef = useRef<MotriciteLevel>(motriciteLevels[0]);
  const startTimeRef = useRef(0);

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
  const spawnTargets = useCallback((level: MotriciteLevel): Target[] => {
    const tgts: Target[] = [];
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

      const level = motriciteLevels[levelIndex];
      const h = hitsRef.current;
      const total = level.targetCount;
      const successRate = total > 0 ? Math.round((h / total) * 100) : 0;
      const diagnosis = getLevelDiagnosis(levelIndex, successRate);

      const result: LevelResult = {
        levelIndex,
        levelName: level.name,
        hits: h,
        total,
        successRate,
        diagnosis,
      };

      setLevelResults((prev) => [...prev, result]);
      setPhase("level-result");
    },
    []
  );

  /* ---------------------------------------------------------------- */
  /*  Handle target click                                              */
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

    // Check if all targets hit
    if (cur.every((t) => t.hit)) {
      endLevel(currentLevel);
    }
  }

  /* ---------------------------------------------------------------- */
  /*  Handle arena miss-click                                          */
  /* ---------------------------------------------------------------- */
  function handleArenaMiss(e: React.MouseEvent<HTMLDivElement>) {
    if (phase !== "playing") return;
    // Only count as miss if clicked on the arena background, not a target
    if ((e.target as HTMLElement).dataset.arena === "true") {
      setMisses((prev) => prev + 1);
    }
  }

  /* ---------------------------------------------------------------- */
  /*  Advance to next level or finish                                  */
  /* ---------------------------------------------------------------- */
  function handleNextLevel() {
    const next = currentLevel + 1;
    if (next >= motriciteLevels.length) {
      // Calculate overall score and go to results
      const allResults = [...levelResults];
      // The latest result was just pushed by endLevel
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

  /* ---------------------------------------------------------------- */
  /*  Render: Level Intro                                              */
  /* ---------------------------------------------------------------- */
  if (phase === "level-intro") {
    const level = motriciteLevels[currentLevel];
    return (
      <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-md w-full text-center animate-slide-up">
          <div className="text-6xl mb-6">🎯</div>

          <div className="inline-block bg-[#0d9488]/10 text-[#0d9488] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
            Niveau {level.id} / {motriciteLevels.length}
          </div>

          <h1
            className="text-3xl font-black mb-2"
            style={{
              background: "linear-gradient(135deg, #0d9488, #14b8a6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {level.name}
          </h1>

          <p className="text-sm text-purple-dark/70 mb-6 leading-relaxed">
            {level.description}
          </p>

          <div className="card mb-6 border-2 border-[#0d9488]/10">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-black text-[#0d9488]">
                  {level.targetCount}
                </div>
                <div className="text-xs text-purple-dark/50">cibles</div>
              </div>
              <div>
                <div className="text-2xl font-black text-[#0d9488]">
                  {level.targetSize}px
                </div>
                <div className="text-xs text-purple-dark/50">taille</div>
              </div>
              <div>
                <div className="text-2xl font-black text-[#0d9488]">
                  {level.duration}s
                </div>
                <div className="text-xs text-purple-dark/50">temps</div>
              </div>
            </div>
          </div>

          <button
            onClick={() => startLevel(currentLevel)}
            className="font-bold text-white py-3 px-8 rounded-full transition-all hover:scale-105 hover:shadow-lg text-lg"
            style={{
              background: "linear-gradient(135deg, #0d9488, #14b8a6)",
            }}
          >
            Commencer
          </button>
        </div>
      </div>
    );
  }

  /* ---------------------------------------------------------------- */
  /*  Render: Playing                                                  */
  /* ---------------------------------------------------------------- */
  if (phase === "playing") {
    const level = motriciteLevels[currentLevel];
    return (
      <div className="min-h-[calc(100vh-80px)] flex flex-col items-center px-4 py-6">
        {/* HUD */}
        <div className="w-full max-w-[640px] flex items-center justify-between mb-4">
          <div className="text-sm font-bold text-purple-dark/60">
            Niveau {level.id} — {level.name}
          </div>
          <div className="flex gap-4 items-center">
            <div className="text-sm font-semibold text-[#0d9488]">
              {hits}/{level.targetCount}
            </div>
            <div
              className={`text-lg font-black px-3 py-1 rounded-full ${
                timeLeft <= 5
                  ? "bg-red-100 text-red-600 animate-pulse"
                  : "bg-[#0d9488]/10 text-[#0d9488]"
              }`}
            >
              {timeLeft}s
            </div>
          </div>
        </div>

        {/* Arena */}
        <div
          data-arena="true"
          onClick={handleArenaMiss}
          className="relative border-2 border-[#0d9488]/20 rounded-2xl overflow-hidden cursor-crosshair select-none"
          style={{
            width: ARENA_W,
            maxWidth: "100%",
            height: ARENA_H,
            background:
              "radial-gradient(circle at 50% 50%, rgba(13,148,136,0.03), rgba(13,148,136,0.08))",
          }}
        >
          {targets.map((t) => {
            if (t.hit) return null;
            const displaySize = t.size * t.shrinkRatio;
            return (
              <button
                key={t.id}
                onClick={(e) => {
                  e.stopPropagation();
                  handleTargetClick(t.id);
                }}
                className="absolute rounded-full transition-shadow hover:shadow-lg focus:outline-none"
                style={{
                  width: displaySize * 2,
                  height: displaySize * 2,
                  left: t.x + t.jitterX - displaySize,
                  top: t.y + t.jitterY - displaySize,
                  background:
                    "radial-gradient(circle at 35% 35%, #14b8a6, #0d9488, #065f5b)",
                  boxShadow: "0 0 10px rgba(13,148,136,0.4)",
                }}
              >
                <span
                  className="absolute rounded-full bg-white/30"
                  style={{
                    width: displaySize * 0.6,
                    height: displaySize * 0.6,
                    top: displaySize * 0.3,
                    left: displaySize * 0.3,
                  }}
                />
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
                  width: 20,
                  height: 20,
                  left: t.x - 10,
                  top: t.y - 10,
                  borderRadius: "50%",
                  background: "rgba(13,148,136,0.4)",
                }}
              />
            ))}
        </div>

        {/* Miss counter */}
        {misses > 0 && (
          <div className="mt-3 text-sm font-medium text-red-400">
            {misses} clic{misses > 1 ? "s" : ""} raté{misses > 1 ? "s" : ""}
          </div>
        )}
      </div>
    );
  }

  /* ---------------------------------------------------------------- */
  /*  Render: Level Result                                             */
  /* ---------------------------------------------------------------- */
  if (phase === "level-result") {
    const lastResult = levelResults[levelResults.length - 1];
    if (!lastResult) return null;
    const diag = lastResult.diagnosis;
    const isLast = currentLevel >= motriciteLevels.length - 1;

    return (
      <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-md w-full text-center animate-slide-up">
          <div className="text-6xl mb-4">
            {lastResult.successRate >= 80
              ? "🎯"
              : lastResult.successRate >= 50
                ? "😬"
                : "💀"}
          </div>

          <div className="inline-block bg-[#0d9488]/10 text-[#0d9488] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
            Résultat Niveau {currentLevel + 1}
          </div>

          <h2 className="text-2xl font-black text-purple-dark mb-2">
            {lastResult.hits} / {lastResult.total} cibles touchées
          </h2>

          <div
            className={`text-4xl font-black mb-4 ${
              lastResult.successRate >= 80
                ? "text-green-600"
                : lastResult.successRate >= 50
                  ? "text-orange"
                  : "text-red-600"
            }`}
          >
            {lastResult.successRate}%
          </div>

          {/* Diagnosis card */}
          <div className="card border-2 border-[#0d9488]/10 text-left mb-6">
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`text-xs font-black px-2 py-0.5 rounded-full uppercase ${
                  lastResult.successRate >= 80
                    ? "bg-amber-100 text-amber-700"
                    : lastResult.successRate >= 50
                      ? "bg-orange/10 text-orange"
                      : "bg-red-100 text-red-600"
                }`}
              >
                {diag.severity}
              </span>
            </div>
            <h3 className="font-bold text-purple-dark mb-2">
              {diag.condition}
            </h3>
            <p className="text-sm text-purple-dark/70 leading-relaxed italic">
              &laquo; {diag.explanation} &raquo;
            </p>
          </div>

          <button
            onClick={handleNextLevel}
            className="font-bold text-white py-3 px-8 rounded-full transition-all hover:scale-105 hover:shadow-lg"
            style={{
              background: "linear-gradient(135deg, #0d9488, #14b8a6)",
            }}
          >
            {isLast ? "Voir le rapport complet" : "Niveau suivant"}
          </button>
        </div>
      </div>
    );
  }

  /* ---------------------------------------------------------------- */
  /*  Render: Done (redirect)                                          */
  /* ---------------------------------------------------------------- */
  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
      <div className="text-xl text-[#0d9488] animate-pulse">
        Compilation du rapport neurologique...
      </div>
    </div>
  );
}
