export interface PlayerScore {
  pseudo: string;
  score: number;
  title: string;
  date: string;
}

// In-memory store for scores (resets on server restart)
// For production, replace with a database
const scores: PlayerScore[] = [];

export function addScore(entry: PlayerScore): void {
  scores.push(entry);
  scores.sort((a, b) => b.score - a.score);
  // Keep only top 100
  if (scores.length > 100) {
    scores.length = 100;
  }
}

export function getScores(): PlayerScore[] {
  return [...scores];
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
