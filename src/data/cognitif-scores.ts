import {
  wpGetScores,
  wpAddScore,
  isWordPressConfigured,
} from "@/lib/wordpress";
import type { WPPlayerAnswer, WPPlayerScore } from "@/lib/wordpress";

export type CognitifPlayerAnswer = WPPlayerAnswer;
export type CognitifPlayerScore = WPPlayerScore;

const WP_REST_BASE = "cognitif-scores";

const memoryScores: CognitifPlayerScore[] = [];

export async function addCognitifScore(entry: CognitifPlayerScore): Promise<void> {
  if (isWordPressConfigured()) {
    await wpAddScore(WP_REST_BASE, entry);
    return;
  }
  memoryScores.push(entry);
  memoryScores.sort((a, b) => b.score - a.score);
  if (memoryScores.length > 100) memoryScores.length = 100;
}

export async function getCognitifScores(): Promise<CognitifPlayerScore[]> {
  if (isWordPressConfigured()) {
    return wpGetScores(WP_REST_BASE);
  }
  return [...memoryScores];
}
