import fs from "node:fs";
import path from "node:path";

export interface PlayerAnswer {
  questionId: number;
  question: string;
  answerIndex: number;
  answerText: string;
  points: number;
}

export interface PlayerScore {
  pseudo: string;
  score: number;
  title: string;
  date: string;
  answers: PlayerAnswer[];
}

const DATA_DIR = path.join(process.cwd(), "data");
const SCORES_FILE = path.join(DATA_DIR, "scores.json");
const LOCK_FILE = path.join(DATA_DIR, "scores.lock");

function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function acquireLock(retries = 10, delay = 50): void {
  ensureDataDir();
  for (let i = 0; i < retries; i++) {
    try {
      fs.writeFileSync(LOCK_FILE, String(process.pid), { flag: "wx" });
      return;
    } catch {
      // Lock file exists, wait and retry
      const start = Date.now();
      while (Date.now() - start < delay) {
        /* busy wait */
      }
    }
  }
  // Force acquire after all retries (stale lock protection)
  fs.writeFileSync(LOCK_FILE, String(process.pid));
}

function releaseLock(): void {
  try {
    fs.unlinkSync(LOCK_FILE);
  } catch {
    /* ignore */
  }
}

function readScores(): PlayerScore[] {
  ensureDataDir();
  if (!fs.existsSync(SCORES_FILE)) {
    return [];
  }
  const raw = fs.readFileSync(SCORES_FILE, "utf-8");
  if (!raw.trim()) return [];
  return JSON.parse(raw);
}

function writeScores(scores: PlayerScore[]): void {
  ensureDataDir();
  const tmpFile = SCORES_FILE + ".tmp";
  fs.writeFileSync(tmpFile, JSON.stringify(scores, null, 2), "utf-8");
  fs.renameSync(tmpFile, SCORES_FILE);
}

export function addScore(entry: PlayerScore): void {
  acquireLock();
  try {
    const scores = readScores();
    scores.push(entry);
    scores.sort((a, b) => b.score - a.score);
    if (scores.length > 100) {
      scores.length = 100;
    }
    writeScores(scores);
  } finally {
    releaseLock();
  }
}

export function getScores(): PlayerScore[] {
  return readScores();
}

export function getTitle(score: number, maxScore: number): string {
  const percentage = (score / maxScore) * 100;
  if (percentage >= 90) return "Complètement Fou / Folle !";
  if (percentage >= 75) return "Sacrément Barré(e) !";
  if (percentage >= 60) return "Bien Allumé(e) !";
  if (percentage >= 45) return "Un Peu Fêlé(e)";
  if (percentage >= 30) return "Légèrement Toqué(e)";
  if (percentage >= 15) return "Presque Sage";
  return "Trop Sage !";
}
