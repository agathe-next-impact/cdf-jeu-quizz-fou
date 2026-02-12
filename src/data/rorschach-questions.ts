export interface RorschachAnswer {
  text: string;
  points: number;
  interpretation: string;
}

export interface RorschachQuestion {
  id: number;
  blotSeed: number;
  blotColors: [string, string];
  answers: RorschachAnswer[];
}

export const rorschachQuestions: RorschachQuestion[] = [
  {
    id: 1,
    blotSeed: 1,
    blotColors: ["#1a1a2e", "#4a4a6a"],
    answers: [
      {
        text: "Un papillon",
        points: 10,
        interpretation:
          "Projection d'un désir de métamorphose impossible. Le sujet refuse sa condition actuelle.",
      },
      {
        text: "Une chauve-souris",
        points: 20,
        interpretation:
          "Association ténébreuse révélatrice d'un refoulement nocturne profond.",
      },
      {
        text: "Deux mains qui se rejoignent",
        points: 30,
        interpretation:
          "Dépendance affective aiguë. Le sujet cherche désespérément le contact humain.",
      },
    ],
  },
  {
    id: 2,
    blotSeed: 2,
    blotColors: ["#8b0000", "#2d0000"],
    answers: [
      {
        text: "Deux personnes qui discutent",
        points: 10,
        interpretation:
          "Trouble de la projection sociale. Le sujet invente des interactions là où il n'y en a pas.",
      },
      {
        text: "Un masque de démon",
        points: 20,
        interpretation:
          "Le sujet externalise ses pulsions destructrices sous forme artistique. Inquiétant.",
      },
      {
        text: "Un cœur qui saigne",
        points: 30,
        interpretation:
          "Trauma affectif non résolu. Prévoir 15 ans de thérapie minimum.",
      },
    ],
  },
  {
    id: 3,
    blotSeed: 3,
    blotColors: ["#2d2d2d", "#6b4423"],
    answers: [
      {
        text: "Deux personnes qui font la cuisine",
        points: 10,
        interpretation:
          "Obsession alimentaire masquée par un rituel social. Le sujet nourrit ses angoisses.",
      },
      {
        text: "Un nœud papillon géant",
        points: 20,
        interpretation:
          "Narcissisme vestimentaire. Le sujet compense un vide intérieur par l'apparence.",
      },
      {
        text: "Des organes internes",
        points: 30,
        interpretation:
          "Le sujet se regarde littéralement de l'intérieur. Introspection pathologique de stade 4.",
      },
    ],
  },
  {
    id: 4,
    blotSeed: 4,
    blotColors: ["#0d0d0d", "#3a3a3a"],
    answers: [
      {
        text: "Un géant assis sur un trône",
        points: 20,
        interpretation:
          "Mégalomanie de type pharaonique. Le sujet se croit au-dessus des lois de la gravité.",
      },
      {
        text: "Un monstre poilu",
        points: 30,
        interpretation:
          "Projection des peurs enfantines non résolues. L'enfant intérieur crie au secours.",
      },
      {
        text: "Un arbre vu d'en bas",
        points: 10,
        interpretation:
          "Syndrome de la petitesse. Le sujet se sent écrasé par absolument tout.",
      },
    ],
  },
  {
    id: 5,
    blotSeed: 5,
    blotColors: ["#1a1a2e", "#16213e"],
    answers: [
      {
        text: "Un ange aux ailes déployées",
        points: 30,
        interpretation:
          "Complexe messianique. Le sujet se croit investi d'une mission divine.",
      },
      {
        text: "Une chauve-souris en vol",
        points: 10,
        interpretation:
          "Le sujet s'identifie à un animal nocturne solitaire. Isolement social confirmé.",
      },
      {
        text: "Un avion qui décolle",
        points: 20,
        interpretation:
          "Désir de fuite permanent. Le sujet ne supporte pas sa vie actuelle.",
      },
    ],
  },
  {
    id: 6,
    blotSeed: 6,
    blotColors: ["#4a2c2a", "#2d1b1b"],
    answers: [
      {
        text: "Un totem ancestral",
        points: 20,
        interpretation:
          "Régression vers des croyances primitives. Le sujet cherche un sens là où il n'y en a pas.",
      },
      {
        text: "Un violon",
        points: 10,
        interpretation:
          "Le sujet se sent comme un instrument : joué par les autres. Complexe du pantin.",
      },
      {
        text: "Une peau d'animal étalée",
        points: 30,
        interpretation:
          "Tendance à la déconstruction totale. Le sujet veut tout mettre à plat, y compris ses émotions.",
      },
    ],
  },
  {
    id: 7,
    blotSeed: 7,
    blotColors: ["#3d3d3d", "#5a5a7a"],
    answers: [
      {
        text: "Deux visages qui se regardent",
        points: 20,
        interpretation:
          "Le sujet se dédouble mentalement. Début de dissociation identitaire.",
      },
      {
        text: "Des nuages",
        points: 10,
        interpretation:
          "Fuite dans l'imaginaire. Le sujet évite systématiquement la réalité.",
      },
      {
        text: "Des cornes de bélier",
        points: 30,
        interpretation:
          "Agressivité refoulée prête à charger. Ne surtout pas contrarier le sujet.",
      },
    ],
  },
  {
    id: 8,
    blotSeed: 8,
    blotColors: ["#8b4513", "#d2691e"],
    answers: [
      {
        text: "Deux animaux qui grimpent",
        points: 10,
        interpretation:
          "Le sujet projette sa propre lutte quotidienne. L'ascension sociale l'obsède.",
      },
      {
        text: "Un blason royal",
        points: 20,
        interpretation:
          "Mégalomanie aristocratique. Le sujet se croit secrètement de sang noble.",
      },
      {
        text: "Un feu d'artifice",
        points: 30,
        interpretation:
          "Besoin d'attention explosive. Le sujet ne supporte pas l'indifférence.",
      },
    ],
  },
  {
    id: 9,
    blotSeed: 9,
    blotColors: ["#2e0854", "#6a0dad"],
    answers: [
      {
        text: "Deux sorciers face à face",
        points: 20,
        interpretation:
          "Le sujet vit dans un monde parallèle peuplé de forces mystiques. Alarmant.",
      },
      {
        text: "Une fontaine en éruption",
        points: 10,
        interpretation:
          "Émotions incontrôlables prêtes à déborder. Garder les mouchoirs à portée.",
      },
      {
        text: "Un bébé dans un berceau",
        points: 30,
        interpretation:
          "Régression infantile totale. Le sujet veut retourner dans le ventre maternel.",
      },
    ],
  },
  {
    id: 10,
    blotSeed: 10,
    blotColors: ["#1a1a1a", "#4a0e0e"],
    answers: [
      {
        text: "Des crabes sur un récif",
        points: 20,
        interpretation:
          "Le sujet s'accroche désespérément à tout ce qu'il trouve. Trouble de l'attachement maximal.",
      },
      {
        text: "Un jardin en fleurs",
        points: 10,
        interpretation:
          "Déni de la réalité par idéalisation systématique. Le sujet embellit tout pour ne rien voir.",
      },
      {
        text: "Une explosion de confettis",
        points: 30,
        interpretation:
          "Le sujet transforme le chaos en fête. Mécanisme de défense festif, le plus dangereux qui soit.",
      },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Profiles                                                           */
/* ------------------------------------------------------------------ */
export interface RorschachProfile {
  title: string;
  subtitle: string;
  emoji: string;
  description: string;
  minPercent: number;
}

export const rorschachProfiles: RorschachProfile[] = [
  {
    minPercent: 90,
    emoji: "brain",
    title: "Psyché en État d'Urgence Absolue",
    subtitle: "Dossier classé ROUGE",
    description:
      "On ne savait même pas que ce profil existait. Vous l'avez débloqué. Votre inconscient est un thriller en 47 saisons dont personne ne comprend la fin.",
  },
  {
    minPercent: 75,
    emoji: "waves",
    title: "Abîme Psychologique Remarquable",
    subtitle: "Profondeur inquiétante",
    description:
      "Votre inconscient est un roman de 12 tomes. Chaque tache d'encre est un chapitre et vous les avez tous lus à l'envers.",
  },
  {
    minPercent: 60,
    emoji: "flask-conical",
    title: "Complexe Multi-Pathologique",
    subtitle: "Au moins 7 névroses détectées",
    description:
      "Vous combinez narcissisme, mégalomanie et dépendance affective avec une aisance déconcertante. C'est presque un talent.",
  },
  {
    minPercent: 45,
    emoji: "circle-help",
    title: "Névrose Créative Avancée",
    subtitle: "Le Minotaure est perdu dans votre tête",
    description:
      "Votre cerveau est un labyrinthe où le Minotaure lui-même demande son chemin. Vous voyez des choses, et ce que vous voyez nous inquiète.",
  },
  {
    minPercent: 30,
    emoji: "search",
    title: "Dérèglement Perceptif Confirmé",
    subtitle: "Perception altérée de la réalité",
    description:
      "Vous voyez ce que vous voulez voir, et franchement c'est rarement bon signe. Les taches d'encre ont porté plainte.",
  },
  {
    minPercent: 15,
    emoji: "stethoscope",
    title: "Refoulement Suspect",
    subtitle: "Trop calme pour être honnête",
    description:
      "Choisir systématiquement les réponses les plus douces est en soi un symptôme grave. Qu'essayez-vous de cacher ?",
  },
  {
    minPercent: 0,
    emoji: "siren",
    title: "Déni Clinique Total",
    subtitle: "ALERTE : CONSCIENCE DÉCONNECTÉE",
    description:
      "Voir les choses les plus inoffensives dans des taches d'encre est la forme la plus pure de psychopathologie selon notre équipe. Votre cerveau censure tellement qu'il ne reste plus rien.",
  },
];

export function getRorschachProfile(
  score: number,
  maxScore: number
): RorschachProfile {
  const percentage = (score / maxScore) * 100;
  return (
    rorschachProfiles.find((p) => percentage >= p.minPercent) ??
    rorschachProfiles[rorschachProfiles.length - 1]
  );
}
