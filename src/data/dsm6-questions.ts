export interface DSM6Answer {
  text: string;
  points: number;
}

export interface DSM6Question {
  id: number;
  question: string;
  section: string;
  answers: DSM6Answer[];
}

export const dsm6Questions: DSM6Question[] = [
  // SECTION A — Troubles de la Vie Moderne
  {
    id: 1,
    section: "Troubles de la Vie Moderne",
    question:
      "Vous ouvrez le frigo sans avoir faim, le refermez, puis le rouvrez 11 secondes plus tard en espérant que de nouvelles options soient apparues.",
    answers: [
      { text: "Jamais", points: 0 },
      { text: "Parfois", points: 10 },
      { text: "Souvent", points: 20 },
      { text: "C'est littéralement mon cardio", points: 30 },
    ],
  },
  {
    id: 2,
    section: "Troubles de la Vie Moderne",
    question:
      "Vous avez déjà dit \"je pars dans 5 minutes\" alors que vous n'aviez même pas encore trouvé vos chaussures.",
    answers: [
      { text: "Jamais, je suis toujours prêt(e)", points: 0 },
      { text: "1 à 2 fois par semaine", points: 10 },
      { text: "Quotidiennement", points: 20 },
      { text: "Je le dis en pyjama les clés introuvables", points: 30 },
    ],
  },
  {
    id: 3,
    section: "Troubles de la Vie Moderne",
    question:
      "Vous tapez un long message, vous le relisez, vous l'effacez entièrement et vous répondez \"ok\".",
    answers: [
      { text: "Jamais, je dis ce que je pense", points: 0 },
      { text: "Ça m'arrive parfois", points: 10 },
      { text: "J'en souffre depuis plusieurs années", points: 20 },
      { text: "Mon thérapeute est au courant", points: 30 },
    ],
  },

  // SECTION B — Troubles Relationnels Sévères
  {
    id: 4,
    section: "Troubles Relationnels Sévères",
    question:
      "Quand quelqu'un dit \"faut qu'on parle\", votre espérance de vie perçue chute de combien d'années ?",
    answers: [
      { text: "Aucune, je suis serein(e)", points: 0 },
      { text: "5 ans", points: 10 },
      { text: "10 à 25 ans", points: 20 },
      { text: "J'ai déjà rédigé mon testament", points: 30 },
    ],
  },
  {
    id: 5,
    section: "Troubles Relationnels Sévères",
    question:
      "Vous avez déjà fait semblant de ne pas voir une connaissance au supermarché en feignant un intérêt passionné pour une étiquette de conserve de petits pois.",
    answers: [
      { text: "Non, je dis toujours bonjour", points: 0 },
      { text: "Oui, une ou deux fois", points: 10 },
      { text: "J'ai changé de rayon en courant", points: 20 },
      { text: "J'ai quitté le magasin sans mes courses", points: 30 },
    ],
  },
  {
    id: 6,
    section: "Troubles Relationnels Sévères",
    question:
      "Combien de fois avez-vous ri à une blague que vous n'avez pas comprise pour éviter un silence gênant ?",
    answers: [
      { text: "Jamais, je demande qu'on m'explique", points: 0 },
      { text: "Quelques fois dans ma vie", points: 10 },
      { text: "Aujourd'hui seulement, déjà 3 fois", points: 20 },
      { text: "Je ris en permanence par précaution", points: 30 },
    ],
  },

  // SECTION C — Dysrégulation Technologique
  {
    id: 7,
    section: "Dysrégulation Technologique",
    question:
      "Vous déverrouillez votre téléphone, oubliez pourquoi, le reverrouillez, puis le redéverrouillez immédiatement.",
    answers: [
      { text: "Jamais", points: 0 },
      { text: "Parfois (moins de 3 fois/jour)", points: 10 },
      { text: "C'est un cycle sans fin", points: 20 },
      { text: "Mon téléphone a déposé une main courante", points: 30 },
    ],
  },
  {
    id: 8,
    section: "Dysrégulation Technologique",
    question:
      "Vous avez déjà cherché vos lunettes alors qu'elles étaient sur votre tête. Variante : cherché votre téléphone avec la lampe torche de votre téléphone.",
    answers: [
      { text: "Jamais, je suis organisé(e)", points: 0 },
      { text: "Une seule des deux variantes", points: 10 },
      { text: "Les deux, hélas", points: 20 },
      { text: "Je coche la case \"cas clinique\"", points: 30 },
    ],
  },
  {
    id: 9,
    section: "Dysrégulation Technologique",
    question:
      "Vous regardez l'heure sur votre téléphone, rangez le téléphone, puis réalisez que vous n'avez aucune idée de l'heure qu'il est.",
    answers: [
      { text: "Jamais", points: 0 },
      { text: "Parfois", points: 10 },
      { text: "C'est pour ça que j'ai acheté une montre", points: 20 },
      { text: "Pareil avec la montre", points: 30 },
    ],
  },

  // SECTION D — Trouble du Sommeil Paradoxal Volontaire
  {
    id: 10,
    section: "Trouble du Sommeil",
    question:
      "L'écart entre le moment où vous dites \"bon allez, au lit\" et celui où vous vous couchez réellement est de :",
    answers: [
      { text: "Moins de 15 minutes", points: 0 },
      { text: "30 minutes à 1 heure", points: 10 },
      { text: "1 à 2 heures (Syndrome de la Dernière Vidéo YouTube)", points: 20 },
      { text: "Je dis ça à 22h et je me couche à 2h", points: 30 },
    ],
  },
  {
    id: 11,
    section: "Trouble du Sommeil",
    question:
      "Vous avez mis un réveil à 6h en vous disant \"demain je change de vie\". Combien d'alarmes avez-vous actuellement programmées ?",
    answers: [
      { text: "1 seule, je me lève du premier coup", points: 0 },
      { text: "3 à 5 alarmes", points: 10 },
      { text: "6 à 9 alarmes", points: 20 },
      { text: "Plus de 9 (une hospitalisation peut être envisagée)", points: 30 },
    ],
  },

  // SECTION E — Trouble Alimentaire de Type « Bof »
  {
    id: 12,
    section: "Trouble Alimentaire de Type Bof",
    question: "\"Qu'est-ce qu'on mange ce soir ?\" provoque chez vous :",
    answers: [
      { text: "De l'enthousiasme", points: 0 },
      { text: "De l'anxiété", points: 10 },
      { text: "Une crise existentielle", points: 20 },
      { text: "Un Uber Eats", points: 30 },
    ],
  },
  {
    id: 13,
    section: "Trouble Alimentaire de Type Bof",
    question:
      "Vous avez déjà mangé un repas composé exclusivement d'ingrédients qui ne vont pas ensemble en déclarant \"c'est de la fusion\".",
    answers: [
      { text: "Jamais, je cuisine correctement", points: 0 },
      { text: "Une ou deux fois par nécessité", points: 10 },
      { text: "Régulièrement et sans honte", points: 20 },
      { text: "Mon dernier plat ferait pleurer Gordon Ramsay", points: 30 },
    ],
  },

  // SECTION F — Méta-Troubles
  {
    id: 14,
    section: "Méta-Troubles",
    question:
      "En lisant ce questionnaire, dans combien de questions vous êtes-vous reconnu(e) ?",
    answers: [
      { text: "Aucune, je suis parfaitement sain(e)", points: 0 },
      { text: "3 ou 4, ça arrive à tout le monde", points: 10 },
      { text: "Plus de 8, c'est un portrait robot", points: 20 },
      { text: "Toutes. Qui m'espionne ?", points: 30 },
    ],
  },
  {
    id: 15,
    section: "Méta-Troubles",
    question:
      "Avez-vous envie d'envoyer ce questionnaire à quelqu'un en disant \"c'est tellement toi\" ?",
    answers: [
      { text: "Non, ça ne m'intéresse pas", points: 0 },
      { text: "Oui, à une personne précise", points: 10 },
      { text: "Oui, à au moins 5 personnes", points: 20 },
      {
        text: "Je souffre du Trouble Compulsif du Partage de Contenu Relatable (TCPCR)",
        points: 30,
      },
    ],
  },
];

export interface DSM6Profile {
  title: string;
  subtitle: string;
  emoji: string;
  description: string;
  minPercent: number;
}

export const dsm6Profiles: DSM6Profile[] = [
  {
    minPercent: 90,
    emoji: "hospital",
    title: "Cas Clinique Certifié",
    subtitle: "Page 4 782 du DSM-6",
    description:
      "Le comité éditorial recommande une observation en milieu naturel. Vous n'êtes pas malade, la société n'est juste pas prête pour vous.",
  },
  {
    minPercent: 75,
    emoji: "flask-conical",
    title: "Spécimen Remarquable",
    subtitle: "Étude de cas en cours",
    description:
      "Votre dossier a été transmis au département de recherche. Pas d'inquiétude, c'est pour la science.",
  },
  {
    minPercent: 60,
    emoji: "clipboard-list",
    title: "Pathologie Avancée",
    subtitle: "Plusieurs syndromes détectés",
    description:
      "Vous cumulez le Syndrome de la Dernière Vidéo YouTube et le Trouble du Frigo Vide. Ça commence à faire un beau CV.",
  },
  {
    minPercent: 45,
    emoji: "microscope",
    title: "Déviance Modérée",
    subtitle: "Sous observation",
    description:
      "Vous présentez des signes encourageants de dysfonctionnement social. Continuez comme ça, vous avez du potentiel.",
  },
  {
    minPercent: 30,
    emoji: "paperclip",
    title: "Légèrement Dysfonctionnel(le)",
    subtitle: "Dans la norme... presque",
    description:
      "Quelques symptômes bénins mais rien d'alarmant. Le frigo et le téléphone commencent à vous connaître.",
  },
  {
    minPercent: 15,
    emoji: "check",
    title: "Suspicieusement Normal(e)",
    subtitle: "Le comité a des doutes",
    description:
      "Vous prétendez aller bien ? C'est exactement ce que dirait quelqu'un de très atteint. On vous surveille.",
  },
  {
    minPercent: 0,
    emoji: "siren",
    title: "Dangereusement Sain(e) d'Esprit",
    subtitle: "ALERTE ROUGE",
    description:
      "Ne vous reconnaître dans aucune question est le symptôme le plus grave du DSM-6. Consultez immédiatement.",
  },
];

export function getDSM6Profile(score: number, maxScore: number): DSM6Profile {
  const percentage = (score / maxScore) * 100;
  return (
    dsm6Profiles.find((p) => percentage >= p.minPercent) ??
    dsm6Profiles[dsm6Profiles.length - 1]
  );
}
