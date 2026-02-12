import {
  wpGetScores,
  wpAddScore,
  isWordPressConfigured,
} from "@/lib/wordpress";
import type { WPPlayerAnswer, WPPlayerScore } from "@/lib/wordpress";

export type EvasionPlayerAnswer = WPPlayerAnswer;
export type EvasionPlayerScore = WPPlayerScore;

const WP_REST_BASE = "evasion-scores";

const memoryScores: EvasionPlayerScore[] = [];

export async function addEvasionScore(entry: EvasionPlayerScore): Promise<void> {
  if (isWordPressConfigured()) {
    await wpAddScore(WP_REST_BASE, entry);
    return;
  }
  memoryScores.push(entry);
  memoryScores.sort((a, b) => b.score - a.score);
  if (memoryScores.length > 100) memoryScores.length = 100;
}

export async function getEvasionScores(): Promise<EvasionPlayerScore[]> {
  if (isWordPressConfigured()) {
    return wpGetScores(WP_REST_BASE);
  }
  return [...memoryScores];
}
