import {
  wpGetScores,
  wpAddScore,
  isWordPressConfigured,
} from "@/lib/wordpress";
import type { WPPlayerAnswer, WPPlayerScore } from "@/lib/wordpress";

export type MotricitePlayerAnswer = WPPlayerAnswer;
export type MotricitePlayerScore = WPPlayerScore;

const WP_REST_BASE = "motricite-scores";

const memoryScores: MotricitePlayerScore[] = [];

export async function addMotriciteScore(entry: MotricitePlayerScore): Promise<void> {
  if (isWordPressConfigured()) {
    await wpAddScore(WP_REST_BASE, entry);
    return;
  }
  memoryScores.push(entry);
  memoryScores.sort((a, b) => b.score - a.score);
  if (memoryScores.length > 100) memoryScores.length = 100;
}

export async function getMotriciteScores(): Promise<MotricitePlayerScore[]> {
  if (isWordPressConfigured()) {
    return wpGetScores(WP_REST_BASE);
  }
  return [...memoryScores];
}
