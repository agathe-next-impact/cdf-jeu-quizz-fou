import {
  wpGetScores,
  wpAddScore,
  isWordPressConfigured,
} from "@/lib/wordpress";
import type { WPPlayerAnswer, WPPlayerScore } from "@/lib/wordpress";

export type DSM6PlayerAnswer = WPPlayerAnswer;
export type DSM6PlayerScore = WPPlayerScore;

const WP_REST_BASE = "dsm6-scores";

const memoryScores: DSM6PlayerScore[] = [];

export async function addDSM6Score(entry: DSM6PlayerScore): Promise<void> {
  if (isWordPressConfigured()) {
    await wpAddScore(WP_REST_BASE, entry);
    return;
  }
  memoryScores.push(entry);
  memoryScores.sort((a, b) => b.score - a.score);
  if (memoryScores.length > 100) memoryScores.length = 100;
}

export async function getDSM6Scores(): Promise<DSM6PlayerScore[]> {
  if (isWordPressConfigured()) {
    return wpGetScores(WP_REST_BASE);
  }
  return [...memoryScores];
}
