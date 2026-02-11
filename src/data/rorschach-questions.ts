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
          "Projection d'un d\u00e9sir de m\u00e9tamorphose impossible. Le sujet refuse sa condition actuelle.",
      },
      {
        text: "Une chauve-souris",
        points: 20,
        interpretation:
          "Association t\u00e9n\u00e9breuse r\u00e9v\u00e9latrice d'un refoulement nocturne profond.",
      },
      {
        text: "Deux mains qui se rejoignent",
        points: 30,
        interpretation:
          "D\u00e9pendance affective aigu\u00eb. Le sujet cherche d\u00e9sesp\u00e9r\u00e9ment le contact humain.",
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
          "Trouble de la projection sociale. Le sujet invente des interactions l\u00e0 o\u00f9 il n'y en a pas.",
      },
      {
        text: "Un masque de d\u00e9mon",
        points: 20,
        interpretation:
          "Le sujet externalise ses pulsions destructrices sous forme artistique. Inqui\u00e9tant.",
      },
      {
        text: "Un c\u0153ur qui saigne",
        points: 30,
        interpretation:
          "Trauma affectif non r\u00e9solu. Pr\u00e9voir 15 ans de th\u00e9rapie minimum.",
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
          "Obsession alimentaire masqu\u00e9e par un rituel social. Le sujet nourrit ses angoisses.",
      },
      {
        text: "Un n\u0153ud papillon g\u00e9ant",
        points: 20,
        interpretation:
          "Narcissisme vestimentaire. Le sujet compense un vide int\u00e9rieur par l'apparence.",
      },
      {
        text: "Des organes internes",
        points: 30,
        interpretation:
          "Le sujet se regarde litt\u00e9ralement de l'int\u00e9rieur. Introspection pathologique de stade 4.",
      },
    ],
  },
  {
    id: 4,
    blotSeed: 4,
    blotColors: ["#0d0d0d", "#3a3a3a"],
    answers: [
      {
        text: "Un g\u00e9ant assis sur un tr\u00f4ne",
        points: 20,
        interpretation:
          "M\u00e9galomanie de type pharaonique. Le sujet se croit au-dessus des lois de la gravit\u00e9.",
      },
      {
        text: "Un monstre poilu",
        points: 30,
        interpretation:
          "Projection des peurs enfantines non r\u00e9solues. L'enfant int\u00e9rieur crie au secours.",
      },
      {
        text: "Un arbre vu d'en bas",
        points: 10,
        interpretation:
          "Syndrome de la petitesse. Le sujet se sent \u00e9cras\u00e9 par absolument tout.",
      },
    ],
  },
  {
    id: 5,
    blotSeed: 5,
    blotColors: ["#1a1a2e", "#16213e"],
    answers: [
      {
        text: "Un ange aux ailes d\u00e9ploy\u00e9es",
        points: 30,
        interpretation:
          "Complexe messianique. Le sujet se croit investi d'une mission divine.",
      },
      {
        text: "Une chauve-souris en vol",
        points: 10,
        interpretation:
          "Le sujet s'identifie \u00e0 un animal nocturne solitaire. Isolement social confirm\u00e9.",
      },
      {
        text: "Un avion qui d\u00e9colle",
        points: 20,
        interpretation:
          "D\u00e9sir de fuite permanent. Le sujet ne supporte pas sa vie actuelle.",
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
          "R\u00e9gression vers des croyances primitives. Le sujet cherche un sens l\u00e0 o\u00f9 il n'y en a pas.",
      },
      {
        text: "Un violon",
        points: 10,
        interpretation:
          "Le sujet se sent comme un instrument : jou\u00e9 par les autres. Complexe du pantin.",
      },
      {
        text: "Une peau d'animal \u00e9tal\u00e9e",
        points: 30,
        interpretation:
          "Tendance \u00e0 la d\u00e9construction totale. Le sujet veut tout mettre \u00e0 plat, y compris ses \u00e9motions.",
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
          "Le sujet se d\u00e9double mentalement. D\u00e9but de dissociation identitaire.",
      },
      {
        text: "Des nuages",
        points: 10,
        interpretation:
          "Fuite dans l'imaginaire. Le sujet \u00e9vite syst\u00e9matiquement la r\u00e9alit\u00e9.",
      },
      {
        text: "Des cornes de b\u00e9lier",
        points: 30,
        interpretation:
          "Agressivit\u00e9 refoul\u00e9e pr\u00eate \u00e0 charger. Ne surtout pas contrarier le sujet.",
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
          "Le sujet projette sa propre lutte quotidienne. L'ascension sociale l'obs\u00e8de.",
      },
      {
        text: "Un blason royal",
        points: 20,
        interpretation:
          "M\u00e9galomanie aristocratique. Le sujet se croit secr\u00e8tement de sang noble.",
      },
      {
        text: "Un feu d'artifice",
        points: 30,
        interpretation:
          "Besoin d'attention explosive. Le sujet ne supporte pas l'indiff\u00e9rence.",
      },
    ],
  },
  {
    id: 9,
    blotSeed: 9,
    blotColors: ["#2e0854", "#6a0dad"],
    answers: [
      {
        text: "Deux sorciers face \u00e0 face",
        points: 20,
        interpretation:
          "Le sujet vit dans un monde parall\u00e8le peupl\u00e9 de forces mystiques. Alarmant.",
      },
      {
        text: "Une fontaine en \u00e9ruption",
        points: 10,
        interpretation:
          "\u00c9motions incontr\u00f4lables pr\u00eates \u00e0 d\u00e9border. Garder les mouchoirs \u00e0 port\u00e9e.",
      },
      {
        text: "Un b\u00e9b\u00e9 dans un berceau",
        points: 30,
        interpretation:
          "R\u00e9gression infantile totale. Le sujet veut retourner dans le ventre maternel.",
      },
    ],
  },
  {
    id: 10,
    blotSeed: 10,
    blotColors: ["#1a1a1a", "#4a0e0e"],
    answers: [
      {
        text: "Des crabes sur un r\u00e9cif",
        points: 20,
        interpretation:
          "Le sujet s'accroche d\u00e9sesp\u00e9r\u00e9ment \u00e0 tout ce qu'il trouve. Trouble de l'attachement maximal.",
      },
      {
        text: "Un jardin en fleurs",
        points: 10,
        interpretation:
          "D\u00e9ni de la r\u00e9alit\u00e9 par id\u00e9alisation syst\u00e9matique. Le sujet embellit tout pour ne rien voir.",
      },
      {
        text: "Une explosion de confettis",
        points: 30,
        interpretation:
          "Le sujet transforme le chaos en f\u00eate. M\u00e9canisme de d\u00e9fense festif, le plus dangereux qui soit.",
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
    emoji: "\ud83e\udde0",
    title: "Psych\u00e9 en \u00c9tat d'Urgence Absolue",
    subtitle: "Dossier class\u00e9 ROUGE",
    description:
      "On ne savait m\u00eame pas que ce profil existait. Vous l'avez d\u00e9bloqu\u00e9. Votre inconscient est un thriller en 47 saisons dont personne ne comprend la fin.",
  },
  {
    minPercent: 75,
    emoji: "\ud83c\udf0a",
    title: "Ab\u00eeme Psychologique Remarquable",
    subtitle: "Profondeur inqui\u00e9tante",
    description:
      "Votre inconscient est un roman de 12 tomes. Chaque tache d'encre est un chapitre et vous les avez tous lus \u00e0 l'envers.",
  },
  {
    minPercent: 60,
    emoji: "\ud83e\uddea",
    title: "Complexe Multi-Pathologique",
    subtitle: "Au moins 7 n\u00e9vroses d\u00e9tect\u00e9es",
    description:
      "Vous combinez narcissisme, m\u00e9galomanie et d\u00e9pendance affective avec une aisance d\u00e9concertante. C'est presque un talent.",
  },
  {
    minPercent: 45,
    emoji: "\ud83e\uddd0",
    title: "N\u00e9vrose Cr\u00e9ative Avanc\u00e9e",
    subtitle: "Le Minotaure est perdu dans votre t\u00eate",
    description:
      "Votre cerveau est un labyrinthe o\u00f9 le Minotaure lui-m\u00eame demande son chemin. Vous voyez des choses, et ce que vous voyez nous inqui\u00e8te.",
  },
  {
    minPercent: 30,
    emoji: "\ud83d\udd0d",
    title: "D\u00e9r\u00e8glement Perceptif Confirm\u00e9",
    subtitle: "Perception alt\u00e9r\u00e9e de la r\u00e9alit\u00e9",
    description:
      "Vous voyez ce que vous voulez voir, et franchement c'est rarement bon signe. Les taches d'encre ont port\u00e9 plainte.",
  },
  {
    minPercent: 15,
    emoji: "\ud83e\ude7a",
    title: "Refoulement Suspect",
    subtitle: "Trop calme pour \u00eatre honn\u00eate",
    description:
      "Choisir syst\u00e9matiquement les r\u00e9ponses les plus douces est en soi un sympt\u00f4me grave. Qu'essayez-vous de cacher ?",
  },
  {
    minPercent: 0,
    emoji: "\ud83d\udea8",
    title: "D\u00e9ni Clinique Total",
    subtitle: "ALERTE : CONSCIENCE D\u00c9CONNECT\u00c9E",
    description:
      "Voir les choses les plus inoffensives dans des taches d'encre est la forme la plus pure de psychopathologie selon notre \u00e9quipe. Votre cerveau censure tellement qu'il ne reste plus rien.",
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
