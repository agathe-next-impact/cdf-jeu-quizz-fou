export interface CognitifQuestion {
  id: number;
  question: string;
  hint: string;
  correctAnswer: string;
  acceptableAnswers: string[];
  points: number;
}

export interface CognitifProfile {
  title: string;
  subtitle: string;
  emoji: string;
  description: string;
  recommendation: string;
  minIQ: number;
}

export const cognitifQuestions: CognitifQuestion[] = [
  {
    id: 1,
    question:
      "Si un train part de Paris à 8h et roule à 200km/h, et qu'un escargot part de Lyon à 6h à 0.05km/h, qui arrivera en premier à Marseille ?",
    hint: "Paris-Marseille ≈ 775km, Lyon-Marseille ≈ 315km",
    correctAnswer: "le train",
    acceptableAnswers: ["le train", "train", "le tgv", "tgv"],
    points: 18,
  },
  {
    id: 2,
    question:
      "Un psychiatre a 12 patients. Chacun pense être Napoléon. Combien de Napoléon y a-t-il dans la salle d'attente ?",
    hint: "Question piège sur l'identité...",
    correctAnswer: "0",
    acceptableAnswers: ["0", "zero", "zéro", "aucun"],
    points: 22,
  },
  {
    id: 3,
    question:
      "Complétez la suite : 2, 6, 14, 30, ?",
    hint: "Chaque nombre est multiplié par 2 puis on ajoute 2",
    correctAnswer: "62",
    acceptableAnswers: ["62"],
    points: 25,
  },
  {
    id: 4,
    question:
      "Si le mot FOLIE s'écrit 6-15-12-9-5 (A=1), que donne 14-15-18-13-1-12 ?",
    hint: "Convertissez chaque nombre en lettre de l'alphabet",
    correctAnswer: "normal",
    acceptableAnswers: ["normal"],
    points: 20,
  },
  {
    id: 5,
    question:
      "Un homme entre dans un bar et demande un verre d'eau. Le barman sort un pistolet. L'homme dit merci et s'en va. Pourquoi ?",
    hint: "L'homme avait un problème physique involontaire...",
    correctAnswer: "il avait le hoquet",
    acceptableAnswers: [
      "il avait le hoquet",
      "le hoquet",
      "hoquet",
      "il a le hoquet",
    ],
    points: 18,
  },
  {
    id: 6,
    question:
      "Dans un hôpital psychiatrique, il y a 3 fois plus de patients que de médecins. Si on ajoute 5 médecins, il n'y a plus que 2 fois plus de patients. Combien y a-t-il de patients ?",
    hint: "Posez l'équation : 3m = p et 2(m+5) = p",
    correctAnswer: "30",
    acceptableAnswers: ["30"],
    points: 28,
  },
  {
    id: 7,
    question:
      "Quel est le prochain nombre premier après 97 ?",
    hint: "Un nombre premier n'est divisible que par 1 et lui-même",
    correctAnswer: "101",
    acceptableAnswers: ["101"],
    points: 8,
  },
  {
    id: 8,
    question:
      "Si hier était demain, aujourd'hui serait vendredi. Quel jour sommes-nous réellement ?",
    hint: "Si hier ÉTAIT demain, alors demain = hier... quel jour a « vendredi » comme surlendemain ?",
    correctAnswer: "mercredi",
    acceptableAnswers: ["mercredi"],
    points: 30,
  },
];

export const COGNITIF_TIME_PER_QUESTION = 30; // seconds

export const COGNITIF_MAX_RAW_SCORE = cognitifQuestions.reduce(
  (sum, q) => sum + q.points,
  0
);

export function calculateIQ(rawScore: number): number {
  return Math.min(160, Math.max(60, 85 + Math.floor(rawScore / 2)));
}

export const cognitifProfiles: CognitifProfile[] = [
  {
    minIQ: 145,
    emoji: "flask-conical",
    title: "Génie Transcendantal Non-Identifié",
    subtitle: "Probable anomalie génétique cérébrale",
    description:
      "Votre QI dépasse le seuil de compréhension de ce test. Votre cortex préfrontal fonctionne à une fréquence que nos instruments ne peuvent calibrer. Deux hypothèses : soit vous êtes le prochain stade de l'évolution humaine, soit vous avez triché avec un talent qui relève lui-même du génie. Dans les deux cas, vous êtes cliniquement inclassable — ce qui est en soi un diagnostic préoccupant.",
    recommendation:
      "Surveillance neurologique immédiate. Interdiction de participer à des concours de mathématiques pour éviter l'humiliation des autres participants. Envisagez de donner votre cerveau à la science de votre vivant.",
  },
  {
    minIQ: 130,
    emoji: "bar-chart-3",
    title: "Intelligence Supérieure Dysfonctionnelle",
    subtitle: "Surinvestissement cognitif pathologique",
    description:
      "Votre score élevé masque un problème grave : votre cerveau consomme trop de ressources pour des problèmes absurdes. Là où un esprit sain aurait ri et répondu au hasard, vous avez mobilisé votre lobe pariétal, votre mémoire de travail ET votre cortex cingulaire pour résoudre des énigmes sans intérêt. Cette sur-allocation cognitive est le premier symptôme du Syndrome du Surdoué Anxieux.",
    recommendation:
      "Thérapie de décélération cognitive. Interdiction de résoudre des sudokus pendant 3 mois. Prescrivons des activités à faible stimulation intellectuelle : regarder des émissions de télé-réalité, lire des horoscopes.",
  },
  {
    minIQ: 115,
    emoji: "trending-up",
    title: "Au-dessus de la Moyenne (Dangereusement)",
    subtitle: "Zone de risque cognitif intermédiaire",
    description:
      "Vous êtes dans la zone la plus dangereuse : assez intelligent pour comprendre les questions, pas assez pour toutes les résoudre. Ce décalage entre vos ambitions cognitives et vos capacités réelles crée une frustration chronique qui, à terme, mène au Syndrome de l'Imposteur Intellectuel — vous savez que vous savez, mais vous ne savez pas assez pour savoir ce que vous ne savez pas.",
    recommendation:
      "Acceptation thérapeutique de vos limites. Évitez les quiz de culture générale en soirée — le risque de blessure narcissique est élevé. Inscrivez-vous à un club de mots croisés niveau intermédiaire.",
  },
  {
    minIQ: 100,
    emoji: "trending-down",
    title: "Parfaitement Moyen (Cliniquement Banal)",
    subtitle: "Normalité statistique confirmée",
    description:
      "Félicitations : vous êtes exactement comme tout le monde. Votre cerveau fonctionne dans les paramètres normaux, ce qui est paradoxalement la chose la plus terrifiante qui puisse être diagnostiquée. Vous ne vous distinguez en rien. Vos connexions neuronales sont d'une banalité affligeante. Votre pensée est prédictible, votre logique est conventionnelle, votre créativité est dans la norme.",
    recommendation:
      "Aucun traitement nécessaire — votre cerveau est déjà en mode économie d'énergie par défaut. Si vous souhaitez stimuler vos neurones, essayez de lire les conditions générales d'utilisation de vos applications.",
  },
  {
    minIQ: 85,
    emoji: "alert-triangle",
    title: "Cognition Alternative Détectée",
    subtitle: "Votre cerveau emprunte des chemins... créatifs",
    description:
      "Votre cerveau ne dysfonctionne pas — il fonctionne différemment. Là où la logique classique dit A→B→C, votre cerveau fait A→canard→pizza→C. Ce n'est pas de la stupidité, c'est de la pensée latérale non-consensuelle. Votre cortex a simplement décidé que les mathématiques et la logique formelle sont des constructions sociales arbitraires.",
    recommendation:
      "Rééducation logique progressive : commencez par compter vos doigts chaque matin (si le résultat est constant pendant 7 jours, passez à l'étape suivante). Évitez les décisions importantes avant 14h.",
  },
  {
    minIQ: 0,
    emoji: "siren",
    title: "Libre Penseur Absolu",
    subtitle: "Affranchissement total des contraintes cognitives",
    description:
      "Votre cerveau a atteint un état que la neuroscience n'a jamais observé : l'indépendance totale vis-à-vis de la logique, des mathématiques et du raisonnement séquentiel. Chaque synapse tire dans une direction aléatoire, créant un magnifique chaos neuronal. Vos réponses ne sont pas fausses — elles appartiennent à un système de vérité parallèle que notre test ne peut évaluer.",
    recommendation:
      "Ne prenez plus aucune décision sans consulter au moins trois personnes et un moteur de recherche. Étiquetez vos chaussures « gauche » et « droite ». Considérez sérieusement la carrière de philosophe absurde.",
  },
];

export function getCognitifProfile(iq: number): CognitifProfile {
  return (
    cognitifProfiles.find((p) => iq >= p.minIQ) ??
    cognitifProfiles[cognitifProfiles.length - 1]
  );
}
