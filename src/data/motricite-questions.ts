export interface MotriciteLevel {
  id: number;
  name: string;
  description: string;
  targetSize: number;
  targetCount: number;
  duration: number;
  behavior: "static" | "shrinking" | "moving" | "jittery" | "all";
}

export interface MotriciteDiagnosis {
  condition: string;
  severity: string;
  explanation: string;
}

export const motriciteLevels: MotriciteLevel[] = [
  {
    id: 1,
    name: "Cibles Standard",
    description: "Cliquez sur 5 cibles. Facile, n'est-ce pas ?",
    targetSize: 40,
    targetCount: 5,
    duration: 9,
    behavior: "static",
  },
  {
    id: 2,
    name: "Cibles Microscopiques",
    description:
      "Les cibles rétrécissent. Un vrai professionnel n'aura aucun mal.",
    targetSize: 15,
    targetCount: 5,
    duration: 9,
    behavior: "shrinking",
  },
  {
    id: 3,
    name: "Cibles Mobiles",
    description:
      "Elles bougent maintenant. Votre coordination va être testée.",
    targetSize: 30,
    targetCount: 5,
    duration: 9,
    behavior: "moving",
  },
  {
    id: 4,
    name: "Cibles Tremblantes",
    description:
      "Des micro-tremblements. Seule une main parfaitement stable réussira.",
    targetSize: 20,
    targetCount: 5,
    duration: 9,
    behavior: "jittery",
  },
  {
    id: 5,
    name: "L'Épreuve Ultime",
    description:
      "Cibles minuscules, mobiles ET tremblantes. Impossible pour un cerveau défaillant.",
    targetSize: 10,
    targetCount: 7,
    duration: 9,
    behavior: "all",
  },
];

/* Per-level diagnoses: [goodPerf ≥80%, midPerf ≥50%, badPerf <50%] */
export const levelDiagnoses: MotriciteDiagnosis[][] = [
  // Level 1 — Cibles statiques
  [
    {
      condition: "Hyperprécision Compulsive sur Cibles Statiques",
      severity: "SUSPECT",
      explanation:
        "Réussir des cibles statiques aussi facilement est anormalement banal. Votre cerveau sur-alloue ses ressources pour une tâche triviale — c'est le signe d'un cortex moteur qui ne sait pas doser son effort. Vous écrasez une mouche avec un marteau neuronal.",
    },
    {
      condition: "Déficit d'Attention Visuo-Motrice sur Cibles Fixes",
      severity: "MODÉRÉ",
      explanation:
        "Des cibles immobiles, de taille normale, et vous en ratez la moitié. Votre cerveau met un temps pathologique à convertir l'information visuelle « cible ici » en action « cliquer là ». La boucle sensori-motrice tourne au ralenti.",
    },
    {
      condition: "Incapacité de Coordination Basique Œil-Main",
      severity: "PRÉOCCUPANT",
      explanation:
        "Un enfant de 4 ans réussirait ce niveau. Des cibles fixes, grosses, immobiles — et vous échouez. Cela indique une rupture fondamentale dans la chaîne de commande entre cortex visuel et muscles de la main.",
    },
  ],
  // Level 2 — Cibles rétrécissantes
  [
    {
      condition: "Syndrome du Tireur d'Élite Obsessionnel",
      severity: "INQUIÉTANT",
      explanation:
        "Toucher des cibles qui rétrécissent avec cette précision révèle une focalisation anormale. Votre cortex préfrontal monopolise toute l'attention disponible sur un point microscopique — un comportement typique des personnalités obsessionnelles-compulsives à tendance maniaque.",
    },
    {
      condition: "Dysmétrie Digitale sur Cibles Rétrécissantes",
      severity: "GRAVE",
      explanation:
        "Quand la cible diminue, votre doigt ne suit plus. Votre cervelet échoue à recalibrer la trajectoire en temps réel. Chaque pixel perdu est un neurone qui a abandonné la partie.",
    },
    {
      condition: "Atrophie des Fibres Motrices Fines",
      severity: "CRITIQUE",
      explanation:
        "L'incapacité à viser des cibles qui rétrécissent confirme une dégénérescence des neurones responsables de la motricité fine. Vos doigts sont désormais aussi précis qu'une pelleteuse.",
    },
  ],
  // Level 3 — Cibles mobiles
  [
    {
      condition: "Instinct Prédateur Hyperactif",
      severity: "ANORMAL",
      explanation:
        "Votre capacité à traquer des cibles en mouvement est cliniquement anormale. Votre cortex pariétal postérieur fonctionne en mode « prédateur » : il anticipe les trajectoires avec une précision quasi-animale. Ce n'est pas un compliment — c'est une régression évolutive.",
    },
    {
      condition: "Apraxie Idéomotrice sur Cibles Mobiles",
      severity: "ALARMANT",
      explanation:
        "Vos mains veulent aller là où la cible était, pas là où elle va. C'est une désynchronisation classique entre l'intention motrice et l'exécution — votre cerveau a toujours un temps de retard sur la réalité.",
    },
    {
      condition: "Syndrome de Latence Motrice face au Mouvement",
      severity: "SÉVÈRE",
      explanation:
        "Votre temps de réaction face à des stimuli mobiles est celui d'un paresseux sous sédatif. La myélinisation de vos voies nerveuses motrices est probablement aussi fine qu'une feuille de papier.",
    },
  ],
  // Level 4 — Cibles tremblantes
  [
    {
      condition: "Stabilité de Main Pathologiquement Excessive",
      severity: "TROUBLANT",
      explanation:
        "Toucher des cibles tremblantes avec cette précision signifie que votre main ne tremble absolument pas. Or, un micro-tremblement physiologique est NORMAL chez l'être humain. Son absence totale est un signe de rigidité musculaire anormale — caractéristique d'un tonus de type parkinsonien inversé.",
    },
    {
      condition: "Résonance Pathologique Main-Cible Tremblante",
      severity: "SÉVÈRE",
      explanation:
        "Face à des cibles instables, votre propre instabilité entre en résonance avec celle du stimulus. Vos micro-tremblements et ceux de la cible se combinent en un chaos moteur ingérable pour votre cervelet.",
    },
    {
      condition: "Syndrome de Tremblement d'Action Amplifié",
      severity: "HANDICAPANT",
      explanation:
        "Les cibles tremblantes révèlent ce que la vie quotidienne masquait : vos mains tremblent. Beaucoup. Le stimulus instable agit comme un amplificateur de votre propre dysfonction motrice.",
    },
  ],
  // Level 5 — Tout combiné
  [
    {
      condition: "Suspicion Forte d'Assistance Robotique",
      severity: "IMPOSSIBLE",
      explanation:
        "Aucun système nerveux humain ne peut traiter simultanément des cibles minuscules, mobiles ET tremblantes avec ce taux de réussite. Soit vous êtes un cyborg, soit vous avez triché, soit votre cortex moteur a muté au-delà de la norme biologique. Dans les trois cas, c'est pathologique.",
    },
    {
      condition: "Surcharge Cognitivo-Motrice Multi-Variables",
      severity: "TERMINAL",
      explanation:
        "Quand tout bouge, tremble et rétrécit en même temps, votre cerveau ne peut plus prioriser. C'est un effondrement de la capacité d'intégration multi-sensorielle — votre CPU neuronal a atteint 100% et commence à supprimer des processus vitaux.",
    },
    {
      condition: "Dystonie Focale avec Effondrement Multi-Systémique",
      severity: "IRRÉVERSIBLE",
      explanation:
        "Face à la difficulté ultime, tous vos déficits se manifestent simultanément en cascade. Précision, vitesse, stabilité et anticipation — tout est hors-service. Vos mains ne sont plus que des décorateurs de bureau.",
    },
  ],
];

export function getLevelDiagnosis(
  levelIndex: number,
  successRate: number
): MotriciteDiagnosis {
  const tier =
    successRate >= 80 ? 0 : successRate >= 50 ? 1 : 2;
  return levelDiagnoses[levelIndex][tier];
}

/* ------------------------------------------------------------------ */
/*  Final profiles — based on average success percentage               */
/* ------------------------------------------------------------------ */
export interface MotriciteProfile {
  title: string;
  subtitle: string;
  emoji: string;
  description: string;
  recommendation: string;
  minPercent: number;
}

export const motriciteProfiles: MotriciteProfile[] = [
  {
    minPercent: 90,
    emoji: "🤖",
    title: "Syndrome du Cyborg Non-Diagnostiqué",
    subtitle: "Performance humainement impossible",
    description:
      "Votre précision dépasse les capacités biologiques normales. Soit vos neurones moteurs ont subi une mutation génétique, soit vous êtes secrètement un robot. Dans les deux cas, votre obsession compulsive pour la performance cache un trouble profond : l'incapacité pathologique à accepter l'échec. Vous avez probablement sacrifié votre vie sociale pour développer cette compétence parfaitement inutile.",
    recommendation:
      "Test de Turing obligatoire pour confirmer que vous êtes bien humain. En attendant, thérapie cognitive-comportementale pour apprendre à accepter l'imperfection. Interdiction de jouer aux jeux de précision pendant 6 mois.",
  },
  {
    minPercent: 70,
    emoji: "📉",
    title: "Déclin Neuromoteur Compensé",
    subtitle: "Le cerveau triche pour cacher ses failles",
    description:
      "Votre score correct est un leurre. Votre cerveau mobilise des ressources cognitives disproportionnées pour compenser vos déficits moteurs réels. Vous sur-concentrez, vous sur-anticipez, vous sur-corrigez. Ce mécanisme de compensation est épuisant et ne tiendra pas dans le temps.",
    recommendation:
      "Rééducation motrice progressive. Évitez les tâches nécessitant de la précision fine (chirurgie, horlogerie, déminage). Envisagez un métier compatible avec vos capacités, comme gardien de phare.",
  },
  {
    minPercent: 50,
    emoji: "⚠️",
    title: "Dysfonction Sensori-Motrice Progressive",
    subtitle: "La déconnexion œil-main s'accélère",
    description:
      "Votre système nerveux montre des signes clairs de dégradation. Vos yeux voient la cible, votre cerveau la localise, mais vos doigts arrivent systématiquement trop tard ou à côté. Cette déconnexion ne fera qu'empirer. Dans 5 ans, vous aurez du mal à tenir une tasse de café sans la renverser.",
    recommendation:
      "Consultation urgente en neurologie. Commencez immédiatement des exercices de motricité adaptés : pâte à modeler, puzzles pour enfants, coloriage sans dépasser.",
  },
  {
    minPercent: 0,
    emoji: "🚨",
    title: "Atrophie Neuronale Sévère Généralisée",
    subtitle: "Pronostic fonctionnel défavorable",
    description:
      "Vos performances sont statistiquement comparables à celles d'un patient en état de conscience minimale. Chaque clic raté est le dernier soupir d'un neurone moteur. Votre cervelet — cette petite structure censée coordonner vos mouvements — est probablement en train de se liquéfier lentement.",
    recommendation:
      "Cessez immédiatement toute activité nécessitant de la coordination. Consultez d'urgence un neurologue, un ergothérapeute, un kinésithérapeute ET un prêtre. Envisagez de dicter vos emails plutôt que de les taper.",
  },
];

export const MOTRICITE_MAX_SCORE = 100; // percentage

export function getMotriciteProfile(scorePercent: number): MotriciteProfile {
  return (
    motriciteProfiles.find((p) => scorePercent >= p.minPercent) ??
    motriciteProfiles[motriciteProfiles.length - 1]
  );
}
