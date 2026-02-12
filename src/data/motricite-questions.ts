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
    duration: 15,
    behavior: "static",
  },
  {
    id: 2,
    name: "Cibles Microscopiques",
    description:
      "Les cibles rétrécissent. Un vrai professionnel n'aura aucun mal.",
    targetSize: 15,
    targetCount: 5,
    duration: 20,
    behavior: "shrinking",
  },
  {
    id: 3,
    name: "Cibles Mobiles",
    description:
      "Elles bougent maintenant. Votre coordination va être testée.",
    targetSize: 30,
    targetCount: 5,
    duration: 25,
    behavior: "moving",
  },
  {
    id: 4,
    name: "Cibles Tremblantes",
    description:
      "Des micro-tremblements. Seule une main parfaitement stable réussira.",
    targetSize: 20,
    targetCount: 5,
    duration: 20,
    behavior: "jittery",
  },
  {
    id: 5,
    name: "L'Épreuve Ultime",
    description:
      "Cibles minuscules, mobiles ET tremblantes. Impossible pour un cerveau défaillant.",
    targetSize: 10,
    targetCount: 7,
    duration: 30,
    behavior: "all",
  },
];

/* Per-level diagnoses: [goodPerf, midPerf, badPerf] */
export const levelDiagnoses: MotriciteDiagnosis[][] = [
  // Level 1
  [
    {
      condition: "Syndrome de Tremblement Essentiel Précoce",
      severity: "LÉGER",
      explanation:
        "Même avec des cibles statiques de taille normale, vous avez manqué des clics. Cela révèle une instabilité de la main caractéristique d'un tremblement neurologique naissant.",
    },
    {
      condition: "Déficit d'Attention Visuo-Motrice",
      severity: "MODÉRÉ",
      explanation:
        "Votre temps de réaction anormalement lent suggère une déconnexion entre perception visuelle et réponse motrice. Votre cerveau traite les informations avec un délai pathologique.",
    },
    {
      condition: "Coordination Œil-Main Déficiente",
      severity: "PRÉOCCUPANT",
      explanation:
        "Un niveau aussi simple ne devrait poser aucun problème à un système nerveux sain. Votre performance indique une dégradation de la boucle sensori-motrice.",
    },
  ],
  // Level 2
  [
    {
      condition: "Presbyopie Motrice Compensatoire",
      severity: "MODÉRÉ",
      explanation:
        "Votre difficulté avec les petites cibles révèle une incapacité à ajuster la précision du mouvement. C'est typique d'une dégénérescence cérébelleuse précoce.",
    },
    {
      condition: "Dysmétrie Digitale Sévère",
      severity: "GRAVE",
      explanation:
        "Vos clics ratés sur des cibles rétrécies démontrent une perte de calibration fine. Votre cerveau ne peut plus estimer correctement les distances microscopiques.",
    },
    {
      condition: "Atrophie des Fibres Motrices Fines",
      severity: "CRITIQUE",
      explanation:
        "L'incapacité à viser des cibles de 15 pixels suggère une dégénérescence des neurones responsables de la motricité fine. C'est inquiétant pour quelqu'un de votre âge.",
    },
  ],
  // Level 3
  [
    {
      condition: "Déficit de Poursuite Visuelle Dynamique",
      severity: "SÉRIEUX",
      explanation:
        "Votre incapacité à suivre des cibles en mouvement révèle un dysfonctionnement du cortex pariétal postérieur. Vous ne pouvez plus prédire les trajectoires.",
    },
    {
      condition: "Apraxie Idéomotrice Émergente",
      severity: "ALARMANT",
      explanation:
        "Les clics ratés sur des cibles mobiles indiquent une désynchronisation entre intention et exécution motrice. C'est un signe précoce de troubles neurodégénératifs.",
    },
    {
      condition: "Syndrome de Latence Motrice Pathologique",
      severity: "INQUIÉTANT",
      explanation:
        "Votre temps de réaction face au mouvement est anormalement élevé. Cela suggère une myélinisation déficiente des voies nerveuses motrices.",
    },
  ],
  // Level 4
  [
    {
      condition: "Parkinson Précoce Non-Diagnostiqué",
      severity: "GRAVE",
      explanation:
        "Votre difficulté avec des cibles tremblantes est ironiquement révélatrice : vous partagez leur instabilité. Vos micro-tremblements interfèrent avec la précision requise.",
    },
    {
      condition: "Ataxie Cérébelleuse Compensée",
      severity: "SÉVÈRE",
      explanation:
        "Face à des stimuli instables, votre système moteur s'effondre. Cela révèle une fragilité cérébelleuse que vous compensez habituellement dans la vie quotidienne.",
    },
    {
      condition: "Syndrome de Tremblement d'Action Invalidant",
      severity: "HANDICAPANT",
      explanation:
        "Les cibles jittery amplifient vos propres tremblements. C'est un phénomène de résonance pathologique entre votre instabilité motrice et le stimulus.",
    },
  ],
  // Level 5
  [
    {
      condition: "Défaillance Neuromotrice Globale",
      severity: "CATASTROPHIQUE",
      explanation:
        "L'échec à ce niveau confirme une dégradation multi-systémique : vision, coordination, précision et stabilité sont toutes compromises. C'est un tableau clinique complet.",
    },
    {
      condition: "Syndrome de Déclin Cognitivo-Moteur Avancé",
      severity: "TERMINAL",
      explanation:
        "L'impossibilité de gérer la complexité de ce niveau révèle que votre cerveau ne peut plus intégrer plusieurs variables motrices simultanément. C'est caractéristique d'une démence débutante.",
    },
    {
      condition: "Dystonie Focale avec Tremblements Mixtes",
      severity: "IRRÉVERSIBLE",
      explanation:
        "Face à la difficulté ultime, tous vos déficits se manifestent en cascade. Vos mains ne vous obéissent plus, signe d'une perte de contrôle moteur volontaire.",
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
    emoji: "🎯",
    title: "Perfectionnisme Moteur Compulsif",
    subtitle: "Score anormalement élevé",
    description:
      "Votre score anormalement élevé révèle une obsession pathologique pour la performance. Vous avez probablement sacrifié votre vie sociale pour développer ces compétences inutiles de clic.",
    recommendation:
      "Thérapie cognitive-comportementale pour apprendre à accepter l'imperfection. Limitez votre temps d'écran à 10 minutes par jour.",
  },
  {
    minPercent: 70,
    emoji: "📉",
    title: "Déclin Neuromoteur Modéré",
    subtitle: "Compensation cognitive détectée",
    description:
      "Votre performance moyenne masque une lutte constante. Vous compensez vos déficits moteurs par une concentration excessive, ce qui est épuisant mentalement.",
    recommendation:
      "Envisagez une rééducation motrice intensive. Évitez les tâches nécessitant de la précision fine (chirurgie, horlogerie, déminage).",
  },
  {
    minPercent: 50,
    emoji: "⚠️",
    title: "Dysfonction Sensori-Motrice Progressive",
    subtitle: "Signes clairs de dégradation",
    description:
      "Votre système nerveux montre des signes clairs de dégradation. La déconnexion entre vos yeux et vos mains s'aggrave. Dans 5 ans, vous aurez du mal à tenir une tasse de café.",
    recommendation:
      "Consultation urgente en neurologie. Commencez à pratiquer des activités motrices simples comme la pâte à modeler ou les puzzles pour enfants.",
  },
  {
    minPercent: 0,
    emoji: "🚨",
    title: "Atrophie Neuronale Sévère",
    subtitle: "Pronostic défavorable",
    description:
      "Vos performances sont comparables à celles d'une personne ayant subi un AVC mineur. Chaque clic raté est le cri d'un neurone mourant. Votre cervelet est probablement en train de se liquéfier.",
    recommendation:
      "Arrêtez immédiatement toute activité nécessitant de la coordination. Consultez d'urgence un neurologue, un ergothérapeute ET un prêtre.",
  },
];

export const MOTRICITE_MAX_SCORE = 100; // percentage

export function getMotriciteProfile(scorePercent: number): MotriciteProfile {
  return (
    motriciteProfiles.find((p) => scorePercent >= p.minPercent) ??
    motriciteProfiles[motriciteProfiles.length - 1]
  );
}
