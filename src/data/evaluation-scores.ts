import {
  wpGetScores,
  wpAddScore,
  isWordPressConfigured,
} from "@/lib/wordpress";
import type { WPPlayerAnswer, WPPlayerScore } from "@/lib/wordpress";

export type EvaluationPlayerAnswer = WPPlayerAnswer;
export type EvaluationPlayerScore = WPPlayerScore;

const WP_REST_BASE = "evaluation-scores";

const memoryScores: EvaluationPlayerScore[] = [];

export async function addEvaluationScore(entry: EvaluationPlayerScore): Promise<void> {
  if (isWordPressConfigured()) {
    await wpAddScore(WP_REST_BASE, entry);
    return;
  }
  memoryScores.push(entry);
  memoryScores.sort((a, b) => b.score - a.score);
  if (memoryScores.length > 100) memoryScores.length = 100;
}

export async function getEvaluationScores(): Promise<EvaluationPlayerScore[]> {
  if (isWordPressConfigured()) {
    return wpGetScores(WP_REST_BASE);
  }
  return [...memoryScores];
}
