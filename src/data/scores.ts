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

function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readScores(): PlayerScore[] {
  ensureDataDir();
  if (!fs.existsSync(SCORES_FILE)) {
    return [];
  }
  const raw = fs.readFileSync(SCORES_FILE, "utf-8");
  return JSON.parse(raw);
}

function writeScores(scores: PlayerScore[]): void {
  ensureDataDir();
  fs.writeFileSync(SCORES_FILE, JSON.stringify(scores, null, 2), "utf-8");
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
