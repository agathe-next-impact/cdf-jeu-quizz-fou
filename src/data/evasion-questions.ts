export interface EvasionChoice {
  text: string;
  points: number;
}

export interface EvasionQuestion {
  id: number;
  story: string;
  question: string;
  choices: EvasionChoice[];
}

export const evasionQuestions: EvasionQuestion[] = [
  {
    id: 1,
    story:
      "Le Dr. Moreau entre dans la salle d'évaluation. C'est un homme d'une cinquantaine d'années, aux lunettes rondes et au regard perçant. Il s'assoit calmement et ouvre son dossier.",
    question:
      "Bonjour. Commençons par une question simple : Comment vous sentez-vous aujourd'hui ?",
    choices: [
      { text: "Je me sens bien, docteur. Prêt à rentrer chez moi.", points: -3 },
      { text: "Confus... Je ne comprends pas vraiment pourquoi je suis ici.", points: 5 },
      { text: "Fatigué, mais je réalise que j'ai besoin d'aide.", points: -5 },
      { text: "Les voix me disent que tout va bien.", points: 15 },
    ],
  },
  {
    id: 2,
    story:
      "Le docteur note quelque chose dans son dossier et relève la tête vers vous.",
    question:
      "Intéressant. Dites-moi, que faisiez-vous avant votre arrivée ici ?",
    choices: [
      { text: "Je travaillais normalement, je ne sais pas ce qui s'est passé.", points: -4 },
      { text: "Je... je ne me souviens pas clairement.", points: 3 },
      { text: "Je préparais ma mission secrète pour sauver le monde.", points: 12 },
      { text: "J'ai eu une crise, je le reconnais maintenant.", points: -7 },
    ],
  },
  {
    id: 3,
    story:
      "Le Dr. Moreau se penche légèrement en avant, observant attentivement vos réactions.",
    question:
      "Parlez-moi de votre famille. Comment décririez-vous votre relation avec eux ?",
    choices: [
      { text: "Excellente. Ils me manquent et je veux les retrouver.", points: -3 },
      { text: "Compliquée... mais j'aimerais arranger les choses.", points: -5 },
      { text: "Ils font partie du complot contre moi.", points: 10 },
      { text: "Je préfère ne pas en parler pour le moment.", points: 2 },
    ],
  },
  {
    id: 4,
    story:
      "Le docteur griffonne des notes. Une infirmière passe dans le couloir, et vous entendez des pas s'éloigner.",
    question:
      "Avez-vous des pensées qui vous dérangent ? Des idées récurrentes ?",
    choices: [
      { text: "Oui, parfois j'ai peur de perdre le contrôle.", points: -6 },
      { text: "Non, tout est clair dans mon esprit maintenant.", points: 4 },
      { text: "Je reçois des messages codés à travers la télévision.", points: 14 },
      { text: "Juste de l'anxiété normale, rien d'inquiétant.", points: -2 },
    ],
  },
  {
    id: 5,
    story:
      "Le Dr. Moreau retire ses lunettes et les nettoie lentement, vous observant du coin de l'œil.",
    question:
      "Si vous sortiez demain, qu'est-ce qui serait différent dans votre vie ?",
    choices: [
      { text: "Je prendrais mes médicaments et je consulterais régulièrement.", points: -8 },
      { text: "Je reprendrais exactement comme avant, tout allait bien.", points: 8 },
      { text: "Je continuerais ma quête pour dévoiler la vérité.", points: 13 },
      { text: "Je prendrais du temps pour moi et ma guérison.", points: -6 },
    ],
  },
  {
    id: 6,
    story:
      "Le psychiatre se lève et marche lentement vers la fenêtre, les mains derrière le dos.",
    question:
      "Dernière question : Pourquoi pensez-vous que vous êtes ici ?",
    choices: [
      { text: "Parce que j'ai besoin de soins et de soutien.", points: -7 },
      { text: "C'est une erreur, je n'aurais jamais dû être interné.", points: 6 },
      { text: "Parce qu'ils veulent m'empêcher de révéler leurs secrets.", points: 15 },
      { text: "Pour me protéger de moi-même, temporairement.", points: -5 },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Outcome profiles — based on total days                             */
/* ------------------------------------------------------------------ */
export interface EvasionOutcome {
  title: string;
  subtitle: string;
  emoji: string;
  description: string;
  maxDays: number;
}

export const evasionOutcomes: EvasionOutcome[] = [
  {
    maxDays: 7,
    emoji: "🏆",
    title: "Libération immédiate !",
    subtitle: "Le Dr. Moreau est impressionné",
    description:
      "Le Dr. Moreau est impressionné par votre lucidité et votre conscience de votre état. Vous avez démontré une excellente compréhension de votre situation et un engagement sincère envers votre rétablissement.",
  },
  {
    maxDays: 20,
    emoji: "👍",
    title: "Sortie programmée",
    subtitle: "Signes encourageants",
    description:
      "Vous avez montré des signes encourageants. Le Dr. Moreau estime qu'avec un suivi approprié et quelques jours d'observation supplémentaires, vous serez prêt à réintégrer la société.",
  },
  {
    maxDays: 40,
    emoji: "🏥",
    title: "Hospitalisation prolongée",
    subtitle: "Quelques préoccupations relevées",
    description:
      "Le Dr. Moreau a relevé quelques préoccupations. Il recommande une période d'observation et de traitement plus longue pour assurer votre stabilité avant la sortie.",
  },
  {
    maxDays: 60,
    emoji: "⚕️",
    title: "Soins intensifs requis",
    subtitle: "Drapeaux rouges importants",
    description:
      "Vos réponses ont soulevé des drapeaux rouges importants. Le Dr. Moreau estime qu'un traitement plus approfondi est nécessaire pour votre sécurité et celle des autres.",
  },
  {
    maxDays: Infinity,
    emoji: "🔒",
    title: "Internement à long terme",
    subtitle: "Trouble sévère diagnostiqué",
    description:
      "Le Dr. Moreau a diagnostiqué un trouble sévère nécessitant une hospitalisation prolongée. Il est préoccupé par votre détachement de la réalité et recommande un traitement intensif immédiat.",
  },
];

export const EVASION_STARTING_DAYS = 30;

export function getEvasionOutcome(totalDays: number): EvasionOutcome {
  return (
    evasionOutcomes.find((o) => totalDays <= o.maxDays) ??
    evasionOutcomes[evasionOutcomes.length - 1]
  );
}
