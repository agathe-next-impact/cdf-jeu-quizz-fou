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

// On Vercel the project directory is read-only.
// Use /tmp (the only writable directory) when running on Vercel,
// otherwise use the local data/ folder (development / self-hosted).
const DATA_DIR = process.env.VERCEL
  ? path.join("/tmp", "data")
  : path.join(process.cwd(), "data");
const SCORES_FILE = path.join(DATA_DIR, "scores.json");

// In-memory fallback if the filesystem is completely unavailable.
let memoryScores: PlayerScore[] = [];
let useMemory = false;

function ensureDataDir(): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch {
    useMemory = true;
  }
}

function readScores(): PlayerScore[] {
  if (useMemory) return memoryScores;
  ensureDataDir();
  try {
    if (!fs.existsSync(SCORES_FILE)) return [];
    const raw = fs.readFileSync(SCORES_FILE, "utf-8");
    if (!raw.trim()) return [];
    return JSON.parse(raw);
  } catch {
    return memoryScores;
  }
}

function writeScores(scores: PlayerScore[]): void {
  // Always keep the in-memory copy up to date
  memoryScores = scores;

  if (useMemory) return;

  ensureDataDir();
  try {
    const tmpFile = SCORES_FILE + ".tmp";
    fs.writeFileSync(tmpFile, JSON.stringify(scores, null, 2), "utf-8");
    fs.renameSync(tmpFile, SCORES_FILE);
  } catch {
    // Filesystem write failed — keep running with in-memory store
    useMemory = true;
  }
}

export function addScore(entry: PlayerScore): void {
  const scores = readScores();
  scores.push(entry);
  scores.sort((a, b) => b.score - a.score);
  if (scores.length > 100) {
    scores.length = 100;
  }
  writeScores(scores);
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
