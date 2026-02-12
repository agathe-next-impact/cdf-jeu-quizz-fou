export interface Badge {
  name: string;
  emoji: string;
  minScore: number;
  color: string;
}

/** Thresholds are on a 0–100 normalized scale (average % across played games) */
export const BADGES: Badge[] = [
  { name: "Patient Admis",          emoji: "hospital", minScore: 0,   color: "text-black/40" },
  { name: "Cas Intéressant",        emoji: "microscope", minScore: 10,  color: "text-blue" },
  { name: "Sujet Instable",         emoji: "zap", minScore: 20,  color: "text-blue" },
  { name: "Cobaye Prometteur",      emoji: "flask-conical", minScore: 35,  color: "text-blue" },
  { name: "Esprit Dérangé",         emoji: "rotate-ccw", minScore: 50,  color: "text-blue" },
  { name: "Cerveau Hyperactif",     emoji: "brain", minScore: 65,  color: "text-red" },
  { name: "Aliéné Confirmé",        emoji: "flame", minScore: 75,  color: "text-yellow" },
  { name: "Génie Incompris",        emoji: "gem", minScore: 85,  color: "text-blue" },
  { name: "Légende de l'Asile",     emoji: "crown", minScore: 92,  color: "text-yellow" },
  { name: "Dieu de la Folie",       emoji: "star", minScore: 98,  color: "text-yellow" },
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
