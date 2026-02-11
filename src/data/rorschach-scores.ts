import {
  wpGetScores,
  wpAddScore,
  isWordPressConfigured,
} from "@/lib/wordpress";
import type { WPPlayerAnswer, WPPlayerScore } from "@/lib/wordpress";

export type RorschachPlayerAnswer = WPPlayerAnswer;
export type RorschachPlayerScore = WPPlayerScore;

const WP_REST_BASE = "rorschach-scores";

const memoryScores: RorschachPlayerScore[] = [];

export async function addRorschachScore(entry: RorschachPlayerScore): Promise<void> {
  if (isWordPressConfigured()) {
    await wpAddScore(WP_REST_BASE, entry);
    return;
  }
  memoryScores.push(entry);
  memoryScores.sort((a, b) => b.score - a.score);
  if (memoryScores.length > 100) memoryScores.length = 100;
}

export async function getRorschachScores(): Promise<RorschachPlayerScore[]> {
  if (isWordPressConfigured()) {
    return wpGetScores(WP_REST_BASE);
  }
  return [...memoryScores];
}
