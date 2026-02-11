import {
  wpGetScores,
  wpAddScore,
  isWordPressConfigured,
} from "@/lib/wordpress";
import type { WPPlayerAnswer, WPPlayerScore } from "@/lib/wordpress";

// Re-export types so existing imports keep working
export type PlayerAnswer = WPPlayerAnswer;
export type PlayerScore = WPPlayerScore;

/**
 * Add a score.
 * - WordPress configured → persists in WP via REST API
 * - No WordPress        → in-memory fallback (dev / preview)
 */
export async function addScore(entry: PlayerScore): Promise<void> {
  if (isWordPressConfigured()) {
    await wpAddScore("quiz-scores", entry);
    return;
  }
  // Fallback: in-memory
  memoryScores.push(entry);
  memoryScores.sort((a, b) => b.score - a.score);
  if (memoryScores.length > 100) memoryScores.length = 100;
}

/**
 * Get all scores (top 100, sorted by score desc).
 */
export async function getScores(): Promise<PlayerScore[]> {
  if (isWordPressConfigured()) {
    return wpGetScores("quiz-scores");
  }
  return [...memoryScores];
}

/**
 * Compute the title based on the score percentage.
 */
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

// In-memory fallback for development without WordPress
const memoryScores: PlayerScore[] = [];
