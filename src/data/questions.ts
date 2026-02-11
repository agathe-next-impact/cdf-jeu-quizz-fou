export interface Question {
  id: number;
  question: string;
  answers: Answer[];
  category: string;
}

export interface Answer {
  text: string;
  points: number;
}

export const questions: Question[] = [
  {
    id: 1,
    question: "Un ami te propose de sauter en parachute demain matin. Tu fais quoi ?",
    category: "Aventure",
    answers: [
      { text: "Je dis oui direct, on ne vit qu'une fois !", points: 30 },
      { text: "Je demande d'abord combien ça coûte", points: 10 },
      { text: "Je dis oui mais je ne dors pas de la nuit", points: 20 },
      { text: "Hors de question, je reste au sol", points: 0 },
    ],
  },
  {
    id: 2,
    question: "Tu trouves 100 euros par terre. Qu'est-ce que tu fais ?",
    category: "Morale",
    answers: [
      { text: "Je les dépense immédiatement en trucs inutiles", points: 30 },
      { text: "J'essaie de trouver le propriétaire", points: 5 },
      { text: "Je les garde et je culpabilise un peu", points: 15 },
      { text: "Je les donne au premier inconnu que je croise", points: 25 },
    ],
  },
  {
    id: 3,
    question: "On te donne un micro devant 500 personnes. Tu fais quoi ?",
    category: "Social",
    answers: [
      { text: "Je chante ma chanson préférée à tue-tête", points: 30 },
      { text: "Je raconte une blague douteuse", points: 25 },
      { text: "Je fais un discours improvisé sur la vie", points: 20 },
      { text: "Je repose le micro et je m'enfuis", points: 0 },
    ],
  },
  {
    id: 4,
    question: "Ton patron t'énerve. Quelle est ta réaction la plus folle ?",
    category: "Travail",
    answers: [
      { text: "Je pose ma démission en chanson", points: 30 },
      { text: "Je mets un post-it passif-agressif sur son bureau", points: 15 },
      { text: "Je respire un grand coup et je souris", points: 5 },
      { text: "Je lui envoie un mème par email", points: 20 },
    ],
  },
  {
    id: 5,
    question: "Tu es seul(e) chez toi un vendredi soir. Tu fais quoi ?",
    category: "Lifestyle",
    answers: [
      { text: "Je sors danser seul(e) dans un bar", points: 30 },
      { text: "Je commande de la nourriture et je regarde Netflix", points: 5 },
      { text: "J'appelle un(e) ex", points: 25 },
      { text: "Je réorganise tout mon appartement à 23h", points: 20 },
    ],
  },
  {
    id: 6,
    question: "Quel tattoo te ferais-tu sur un coup de tête ?",
    category: "Style",
    answers: [
      { text: "Le visage de mon chat sur le bras", points: 25 },
      { text: "Une citation en latin que je ne comprends pas", points: 20 },
      { text: "Un QR code qui renvoie vers ma playlist Spotify", points: 30 },
      { text: "Jamais de tattoo, même sous la torture", points: 0 },
    ],
  },
  {
    id: 7,
    question: "Tu gagnes un voyage surprise. Tu choisis quoi ?",
    category: "Aventure",
    answers: [
      { text: "L'Antarctique, pour vivre avec les manchots", points: 30 },
      { text: "Un road trip sans destination ni carte", points: 25 },
      { text: "Un resort all-inclusive aux Maldives", points: 5 },
      { text: "Un stage de survie dans la jungle", points: 20 },
    ],
  },
  {
    id: 8,
    question: "Tu as le pouvoir d'être invisible pendant 24h. Tu fais quoi ?",
    category: "Imagination",
    answers: [
      { text: "Je m'infiltre dans les coulisses d'un concert", points: 25 },
      { text: "Je fais des farces à tout le monde", points: 30 },
      { text: "Je reste chez moi, c'est trop bizarre", points: 0 },
      { text: "Je visite les endroits interdits au public", points: 20 },
    ],
  },
  {
    id: 9,
    question: "Un inconnu te défie de danser en pleine rue. Tu fais quoi ?",
    category: "Social",
    answers: [
      { text: "Je sors mes meilleurs moves sans hésiter", points: 30 },
      { text: "Je danse mais uniquement si il/elle commence", points: 15 },
      { text: "Je fais semblant de ne pas entendre", points: 0 },
      { text: "Je lance un battle de danse épique", points: 25 },
    ],
  },
  {
    id: 10,
    question: "Tu peux changer de prénom pour une semaine. Tu choisis quoi ?",
    category: "Imagination",
    answers: [
      { text: "Dark Vador, évidemment", points: 30 },
      { text: "Un prénom d'un pays que je ne connais pas", points: 20 },
      { text: "Je garde le mien, pas besoin de changer", points: 0 },
      { text: "Le prénom de mon crush secret", points: 15 },
    ],
  },
  {
    id: 11,
    question: "Comment tu réagis quand tu te prends une porte en public ?",
    category: "Social",
    answers: [
      { text: "Je salue la porte et je m'excuse", points: 30 },
      { text: "Je fais comme si de rien n'était", points: 5 },
      { text: "Je ris tellement fort que tout le monde me regarde", points: 25 },
      { text: "Je vérifie si personne n'a vu et je panique", points: 10 },
    ],
  },
  {
    id: 12,
    question: "On te propose de goûter un plat mystère. Tu fais quoi ?",
    category: "Aventure",
    answers: [
      { text: "Je goûte les yeux fermés, YOLO", points: 30 },
      { text: "Je demande d'abord tous les ingrédients", points: 5 },
      { text: "Je goûte du bout des lèvres", points: 15 },
      { text: "Je fais goûter quelqu'un d'autre d'abord", points: 20 },
    ],
  },
  {
    id: 13,
    question: "Tu trouves une machine à remonter le temps. Tu vas où ?",
    category: "Imagination",
    answers: [
      { text: "Au Big Bang, juste pour voir", points: 30 },
      { text: "À mon dernier anniversaire pour le revivre", points: 10 },
      { text: "Dans le futur pour voir les résultats du loto", points: 20 },
      { text: "Je n'y touche pas, trop risqué", points: 0 },
    ],
  },
  {
    id: 14,
    question: "Quelle est ta pire idée de cadeau d'anniversaire ?",
    category: "Humour",
    answers: [
      { text: "Un poisson rouge nommé comme l'ex de la personne", points: 30 },
      { text: "Un calendrier avec mes photos à moi", points: 25 },
      { text: "Une carte cadeau d'un euro", points: 15 },
      { text: "Un vrai cadeau bien pensé, je suis pas fou/folle", points: 0 },
    ],
  },
  {
    id: 15,
    question: "Quel serait ton super-pouvoir le plus fou ?",
    category: "Imagination",
    answers: [
      { text: "Transformer tout en fromage par le toucher", points: 30 },
      { text: "Lire dans les pensées (mais seulement celles des chats)", points: 25 },
      { text: "Voler, classique mais efficace", points: 10 },
      { text: "Arrêter le temps pour dormir plus", points: 20 },
    ],
  },
];
