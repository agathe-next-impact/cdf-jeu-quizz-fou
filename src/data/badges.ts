export interface Badge {
  name: string;
  emoji: string;
  minScore: number;
  color: string;
}

/** Thresholds are on a 0–100 normalized scale (average % across played games) */
export const BADGES: Badge[] = [
  { name: "Patient Admis",          emoji: "🏥", minScore: 0,   color: "text-gray-400" },
  { name: "Cas Intéressant",        emoji: "🔬", minScore: 10,  color: "text-blue-400" },
  { name: "Sujet Instable",         emoji: "⚡", minScore: 20,  color: "text-green-500" },
  { name: "Cobaye Prometteur",      emoji: "🧪", minScore: 35,  color: "text-teal-500" },
  { name: "Esprit Dérangé",         emoji: "🌀", minScore: 50,  color: "text-purple-500" },
  { name: "Cerveau Hyperactif",     emoji: "🧠", minScore: 65,  color: "text-pink-500" },
  { name: "Aliéné Confirmé",        emoji: "🔥", minScore: 75,  color: "text-orange-500" },
  { name: "Génie Incompris",        emoji: "💎", minScore: 85,  color: "text-cyan-400" },
  { name: "Légende de l'Asile",     emoji: "👑", minScore: 92,  color: "text-yellow-500" },
  { name: "Dieu de la Folie",       emoji: "⭐", minScore: 98,  color: "text-amber-400" },
];

export function getBadgeForScore(globalScore: number): Badge {
  let current = BADGES[0];
  for (const badge of BADGES) {
    if (globalScore >= badge.minScore) {
      current = badge;
    }
  }
  return current;
}

export function getNextBadge(globalScore: number): Badge | null {
  for (const badge of BADGES) {
    if (globalScore < badge.minScore) {
      return badge;
    }
  }
  return null;
}
