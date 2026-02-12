export interface EvaluationAnswer {
  text: string;
  points: number;
  diagnosis: string;
  severity: string;
  explanation: string;
}

export interface EvaluationQuestion {
  id: number;
  emoji: string;
  question: string;
  answers: EvaluationAnswer[];
}

export const evaluationQuestions: EvaluationQuestion[] = [
  {
    id: 1,
    emoji: "smile",
    question: "Que ressentez-vous en voyant cette émotion ?",
    answers: [
      {
        text: "De la joie",
        points: 30,
        diagnosis: "Syndrome de Positivité Toxique Aiguë",
        severity: "CRITIQUE",
        explanation:
          "Votre incapacité à percevoir la tristesse sous-jacente de ce sourire révèle un déni pathologique de la complexité émotionnelle. Vous fuyez probablement vos vraies émotions.",
      },
      {
        text: "De l'indifférence",
        points: 20,
        diagnosis: "Anhédonie Sociale Sévère",
        severity: "ALARMANT",
        explanation:
          "Ne rien ressentir face à un sourire indique un détachement émotionnel préoccupant. Vous êtes probablement incapable de connexion humaine authentique.",
      },
      {
        text: "De la suspicion",
        points: 25,
        diagnosis: "Paranoïa Affective Chronique",
        severity: "INQUIÉTANT",
        explanation:
          "Vous voyez de la menace dans un simple sourire. Cela révèle une profonde méfiance pathologique envers autrui. Vous ne pouvez faire confiance à personne.",
      },
      {
        text: "De la tristesse",
        points: 15,
        diagnosis: "Projection Dépressive Inversée",
        severity: "SÉVÈRE",
        explanation:
          "Voir de la tristesse dans un sourire démontre une projection massive de votre propre détresse psychologique. Vous transformez tout en miroir de votre désespoir.",
      },
    ],
  },
  {
    id: 2,
    emoji: "frown",
    question: "Comment interprétez-vous cette expression ?",
    answers: [
      {
        text: "Tristesse profonde",
        points: 25,
        diagnosis: "Hyper-empathie Pathologique",
        severity: "DANGEREUX",
        explanation:
          "Votre capacité à identifier correctement la tristesse cache en fait une fusion émotionnelle malsaine. Vous absorbez les émotions d'autrui jusqu'à perdre votre propre identité.",
      },
      {
        text: "Manipulation émotionnelle",
        points: 30,
        diagnosis: "Cynisme Défensif Compulsif",
        severity: "GRAVE",
        explanation:
          "Voir de la manipulation dans les larmes révèle votre incapacité à accepter la vulnérabilité. Vous êtes enfermé dans une forteresse émotionnelle toxique.",
      },
      {
        text: "Faiblesse",
        points: 20,
        diagnosis: "Alexithymie Méprisante",
        severity: "PRÉOCCUPANT",
        explanation:
          "Associer les pleurs à la faiblesse démontre une rigidité émotionnelle pathologique. Vous avez probablement construit un moi-idéal inatteignable et destructeur.",
      },
      {
        text: "Catharsis normale",
        points: 10,
        diagnosis: "Rationalisation Émotionnelle Excessive",
        severity: "MODÉRÉ",
        explanation:
          "Votre besoin de normaliser et intellectualiser les émotions révèle une peur panique de l'intensité affective. Vous contrôlez tout pour ne rien ressentir.",
      },
    ],
  },
  {
    id: 3,
    emoji: "angry",
    question: "Que vous inspire cette émotion ?",
    answers: [
      {
        text: "De la colère également",
        points: 30,
        diagnosis: "Contagion Émotionnelle Agressive",
        severity: "EXPLOSIF",
        explanation:
          "Votre réaction miroir immédiate révèle une absence totale de régulation émotionnelle. Vous êtes une bombe à retardement sociale.",
      },
      {
        text: "De la peur",
        points: 15,
        diagnosis: "Anxiété Anticipatoire Paralysante",
        severity: "HANDICAPANT",
        explanation:
          "Craindre la colère d'autrui indique un traumatisme relationnel profond. Vous vivez probablement dans la terreur constante du conflit.",
      },
      {
        text: "De la curiosité",
        points: 25,
        diagnosis: "Détachement Sociopathique Émergent",
        severity: "ALARMANT",
        explanation:
          "Observer la colère avec curiosité plutôt qu'empathie suggère un manque de connexion émotionnelle normale. Votre froideur affective est préoccupante.",
      },
      {
        text: "De la compassion",
        points: 20,
        diagnosis: "Syndrome du Sauveur Narcissique",
        severity: "PATHOLOGIQUE",
        explanation:
          "Votre compassion automatique cache un besoin maladif de réparer les autres pour fuir vos propres blessures. Vous êtes dépendant à la souffrance d'autrui.",
      },
    ],
  },
  {
    id: 4,
    emoji: "meh",
    question: "Cette expression neutre vous évoque quoi ?",
    answers: [
      {
        text: "Le calme",
        points: 15,
        diagnosis: "Déni d'Intensité Affective",
        severity: "SOURNOIS",
        explanation:
          "Confondre neutralité et calme révèle votre peur de l'ambiguïté émotionnelle. Vous créez des certitudes là où il n'y en a pas, signe d'anxiété chronique.",
      },
      {
        text: "L'ennui",
        points: 20,
        diagnosis: "Anhédonie par Projection",
        severity: "INSIDIEUX",
        explanation:
          "Projeter votre propre ennui sur une expression neutre démontre votre incapacité à tolérer le vide. Vous êtes probablement dépendant à la stimulation constante.",
      },
      {
        text: "Le jugement",
        points: 30,
        diagnosis: "Paranoïa Interprétative Sévère",
        severity: "AIGU",
        explanation:
          "Voir du jugement dans la neutralité révèle une profonde insécurité. Vous projetez votre propre critique interne sur le monde entier.",
      },
      {
        text: "Rien",
        points: 25,
        diagnosis: "Alexithymie Nihiliste",
        severity: "PRÉOCCUPANT",
        explanation:
          "Ne rien ressentir face à la neutralité suggère un vide émotionnel inquiétant. Vous êtes peut-être déconnecté de votre propre humanité.",
      },
    ],
  },
  {
    id: 5,
    emoji: "circle-help",
    question: "Comment décririez-vous cette émotion ?",
    answers: [
      {
        text: "Réflexion profonde",
        points: 20,
        diagnosis: "Intellectualisation Compulsive",
        severity: "CHRONIQUE",
        explanation:
          "Votre besoin de tout analyser révèle une fuite du ressenti pur. Vous vivez dans votre tête pour éviter votre corps et vos émotions.",
      },
      {
        text: "Confusion",
        points: 15,
        diagnosis: "Intolérance à l'Ambiguïté Pathologique",
        severity: "RIGIDE",
        explanation:
          "Interpréter la réflexion comme de la confusion montre votre besoin maladif de certitude. Vous ne supportez pas le doute, même sain.",
      },
      {
        text: "Doute de soi",
        points: 25,
        diagnosis: "Projection d'Insécurité Massive",
        severity: "ENVAHISSANT",
        explanation:
          "Voir du doute partout révèle votre propre manque de confiance chronique. Vous habitez un monde de remise en question perpétuelle et épuisante.",
      },
      {
        text: "Manipulation calculée",
        points: 30,
        diagnosis: "Méfiance Paranoïaque Généralisée",
        severity: "TOXIQUE",
        explanation:
          "Interpréter chaque réflexion comme manipulation démontre une vision du monde profondément cynique et isolante. Vous ne pouvez plus croire en l'authenticité.",
      },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Psychiatric profiles — based on total score percentage             */
/* ------------------------------------------------------------------ */
export interface EvaluationProfile {
  title: string;
  subtitle: string;
  emoji: string;
  description: string;
  minPercent: number;
}

export const evaluationProfiles: EvaluationProfile[] = [
  {
    minPercent: 90,
    emoji: "siren",
    title: "Internement Recommandé",
    subtitle: "Dossier classé « Urgence Absolue »",
    description:
      "Votre combinaison de pathologies est si rare qu'elle porte désormais votre nom dans la littérature scientifique imaginaire. Félicitations, vous êtes un cas d'école.",
  },
  {
    minPercent: 75,
    emoji: "hospital",
    title: "Sujet à Risque Majeur",
    subtitle: "Surveillance psychiatrique 24/7 requise",
    description:
      "Le comité d'éthique hésite entre vous étudier et vous fuir. Vos réponses ont déclenché 3 alertes dans notre système de diagnostic fictif.",
  },
  {
    minPercent: 60,
    emoji: "flask-conical",
    title: "Personnalité Cliniquement Fascinante",
    subtitle: "Plusieurs syndromes en compétition",
    description:
      "Vos troubles se battent entre eux pour savoir lequel dominera. C'est un véritable battle royale psychologique dans votre tête.",
  },
  {
    minPercent: 45,
    emoji: "clipboard-list",
    title: "Déviance Émotionnelle Confirmée",
    subtitle: "Rapport en cours de rédaction",
    description:
      "Vous présentez suffisamment de symptômes pour remplir un formulaire d'admission, mais pas assez pour qu'on vous prenne au sérieux. Le pire des deux mondes.",
  },
  {
    minPercent: 30,
    emoji: "microscope",
    title: "Légèrement Perturbé(e)",
    subtitle: "Sous observation passive",
    description:
      "Quelques dysfonctionnements bénins, rien de spectaculaire. Vous êtes la version « light » d'un vrai cas clinique. Revenez quand vous aurez empiré.",
  },
  {
    minPercent: 15,
    emoji: "paperclip",
    title: "Suspicieusement Équilibré(e)",
    subtitle: "Le calme avant la tempête ?",
    description:
      "Votre apparente normalité est le symptôme le plus inquiétant. Les plus grands déséquilibrés semblent parfaitement sains. On vous surveille.",
  },
  {
    minPercent: 0,
    emoji: "check",
    title: "Dangereusement Sain(e) d'Esprit",
    subtitle: "ALERTE : Anomalie détectée",
    description:
      "Être émotionnellement stable dans ce monde est la preuve ultime que quelque chose ne va pas chez vous. Consultez immédiatement un professionnel imaginaire.",
  },
];

export function getEvaluationProfile(
  score: number,
  maxScore: number
): EvaluationProfile {
  const percentage = (score / maxScore) * 100;
  return (
    evaluationProfiles.find((p) => percentage >= p.minPercent) ??
    evaluationProfiles[evaluationProfiles.length - 1]
  );
}
