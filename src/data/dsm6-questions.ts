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
  // SECTION A — Syndrome d'Hyperactivité Réfrigératoire Compulsive (SHRC)
  {
    id: 1,
    section: "Syndrome d'Hyperactivité Réfrigératoire Compulsive (SHRC)",
    question:
      "Quand vous ouvrez le frigo sans objectif précis, combien de temps s'écoule avant que vous ne retourniez vérifier si quelque chose de nouveau est miraculeusement apparu ?",
    answers: [
      { text: "Entre 30 secondes et 2 minutes maximum", points: 30 },
      { text: "Je n'ouvre jamais le frigo sans raison valable", points: 0 },
      { text: "Je garde la porte ouverte entre deux vérifications", points: 20 },
      { text: "Environ 2-3 heures plus tard, par curiosité", points: 10 },
    ],
  },
  {
    id: 2,
    section: "Syndrome d'Hyperactivité Réfrigératoire Compulsive (SHRC)",
    question:
      "Vous dites « J'arrive dans 2 minutes ! ». Dans quel état de préparation vous trouvez-vous réellement à ce moment-là ?",
    answers: [
      { text: "Au lit, en train de scroller sur mon téléphone", points: 10 },
      { text: "Sous la douche, shampooing dans les cheveux", points: 30 },
      { text: "Complètement habillé(e), clés en main, prêt(e) à partir", points: 0 },
      { text: "En train de chercher désespérément un vêtement acceptable", points: 20 },
    ],
  },
  {
    id: 3,
    section: "Syndrome d'Hyperactivité Réfrigératoire Compulsive (SHRC)",
    question:
      "Après avoir écrit un long message émotionnel, que faites-vous généralement ?",
    answers: [
      { text: "Je le raccourcis drastiquement avant envoi", points: 20 },
      { text: "Je le relis plusieurs fois puis l'envoie finalement", points: 10 },
      { text: "Je le supprime et envoie juste un émoji ou « ok »", points: 30 },
      { text: "Je l'envoie tel quel, j'assume pleinement", points: 0 },
    ],
  },

  // SECTION B — Trouble Panique Relationnel à Déclenchement Textuel (TPRDT)
  {
    id: 4,
    section: "Trouble Panique Relationnel à Déclenchement Textuel (TPRDT)",
    question:
      "Quand vous recevez « On peut se parler ? », quelle est votre première réaction physique ?",
    answers: [
      { text: "Panique totale, j'envisage de fuir le pays", points: 30 },
      { text: "Léger stress mais rien de dramatique", points: 10 },
      { text: "Je reste parfaitement calme et serein(e)", points: 0 },
      { text: "Mon cœur commence à battre sérieusement vite", points: 20 },
    ],
  },
  {
    id: 5,
    section: "Trouble Panique Relationnel à Déclenchement Textuel (TPRDT)",
    question:
      "Au supermarché, vous croisez une connaissance. Quelle stratégie d'évitement adoptez-vous ?",
    answers: [
      { text: "Je change d'allée rapidement en faisant mine d'avoir oublié quelque chose", points: 10 },
      { text: "Aucune, je vais spontanément lui dire bonjour", points: 0 },
      { text: "Je quitte le magasin discrètement par une autre sortie", points: 30 },
      { text: "Je fais semblant de lire intensément une étiquette", points: 20 },
    ],
  },
  {
    id: 6,
    section: "Trouble Panique Relationnel à Déclenchement Textuel (TPRDT)",
    question:
      "À quelle fréquence riez-vous à une blague que vous n'avez pas comprise pour éviter un malaise ?",
    answers: [
      { text: "Assez souvent, plusieurs fois par semaine", points: 20 },
      { text: "C'est devenu un réflexe automatique permanent", points: 30 },
      { text: "Jamais, je demande toujours qu'on m'explique", points: 0 },
      { text: "Rarement, mais ça m'est déjà arrivé quelques fois", points: 10 },
    ],
  },

  // SECTION C — Démence Numérique Précoce avec Amnésie Intentionnelle (DNPAI)
  {
    id: 7,
    section: "Démence Numérique Précoce avec Amnésie Intentionnelle (DNPAI)",
    question:
      "Combien de fois par jour déverrouillez-vous votre téléphone sans vous souvenir pourquoi ?",
    answers: [
      { text: "2 ou 3 fois maximum dans la journée", points: 10 },
      { text: "C'est un cycle infernal, je ne peux plus m'arrêter", points: 30 },
      { text: "Une dizaine de fois environ", points: 20 },
      { text: "Ça ne m'arrive jamais, je suis très concentré(e)", points: 0 },
    ],
  },
  {
    id: 8,
    section: "Démence Numérique Précoce avec Amnésie Intentionnelle (DNPAI)",
    question:
      "Avez-vous déjà cherché quelque chose que vous aviez déjà sur vous ?",
    answers: [
      { text: "J'ai utilisé la lampe de mon téléphone pour chercher mon téléphone", points: 20 },
      { text: "J'ai cherché mes clés alors que je conduisais ma voiture", points: 30 },
      { text: "J'ai cherché mes lunettes alors qu'elles étaient sur ma tête", points: 10 },
      { text: "Non, je suis toujours conscient(e) de mes affaires", points: 0 },
    ],
  },
  {
    id: 9,
    section: "Démence Numérique Précoce avec Amnésie Intentionnelle (DNPAI)",
    question:
      "Après avoir consulté l'heure, combien de temps vous faut-il pour réaliser que vous ne savez plus quelle heure il est ?",
    answers: [
      { text: "Quelques minutes plus tard environ", points: 10 },
      { text: "Immédiatement, je dois reconsulter dans la seconde", points: 30 },
      { text: "Ça ne m'arrive jamais, je retiens toujours", points: 0 },
      { text: "Assez rapidement, en moins d'une minute", points: 20 },
    ],
  },

  // SECTION D — Insomnie Volontaire avec Déni Chronique (IVDC)
  {
    id: 10,
    section: "Insomnie Volontaire avec Déni Chronique (IVDC)",
    question:
      "Quand vous annoncez « Bon, je vais me coucher », combien de temps mettez-vous réellement à vous coucher ?",
    answers: [
      { text: "Entre 1h et 2h généralement", points: 20 },
      { text: "Plus de 3 heures, je me perds dans un trou noir digital", points: 30 },
      { text: "Environ 30-45 minutes", points: 10 },
      { text: "Moins de 15 minutes, je suis discipliné(e)", points: 0 },
    ],
  },
  {
    id: 11,
    section: "Insomnie Volontaire avec Déni Chronique (IVDC)",
    question:
      "Combien d'alarmes avez-vous programmées pour vous réveiller le matin ?",
    answers: [
      { text: "Entre 6 et 9 alarmes", points: 20 },
      { text: "3 à 5 alarmes espacées", points: 10 },
      { text: "Une seule, je me lève immédiatement", points: 0 },
      { text: "Plus de 10, et ça ne suffit toujours pas", points: 30 },
    ],
  },

  // SECTION E — Apathie Nutritionnelle avec Créativité Culinaire Pathologique (ANCCP)
  {
    id: 12,
    section: "Apathie Nutritionnelle avec Créativité Culinaire Pathologique (ANCCP)",
    question:
      "Quelle est votre réaction quand on vous demande « Qu'est-ce qu'on mange ce soir ? » ?",
    answers: [
      { text: "Un léger stress mais je trouve rapidement une idée", points: 10 },
      { text: "Je commande directement sur une appli de livraison", points: 30 },
      { text: "Une vraie crise d'angoisse et une remise en question existentielle", points: 20 },
      { text: "De l'enthousiasme, j'adore planifier les repas", points: 0 },
    ],
  },
  {
    id: 13,
    section: "Apathie Nutritionnelle avec Créativité Culinaire Pathologique (ANCCP)",
    question:
      "À quelle fréquence assemblez-vous des « repas » avec des ingrédients totalement incompatibles ?",
    answers: [
      { text: "Constamment, mes créations culinaires sont des crimes gastronomiques", points: 30 },
      { text: "Jamais, je respecte les règles de base de la cuisine", points: 0 },
      { text: "Exceptionnellement, quand je n'ai vraiment rien d'autre", points: 10 },
      { text: "Régulièrement, c'est devenu ma spécialité douteuse", points: 20 },
    ],
  },

  // SECTION F — Trouble Méta-Cognitif d'Auto-Reconnaissance Pathologique (TMCARP)
  {
    id: 14,
    section: "Trouble Méta-Cognitif d'Auto-Reconnaissance Pathologique (TMCARP)",
    question:
      "Dans combien de questions de ce test vous êtes-vous personnellement reconnu(e) jusqu'à présent ?",
    answers: [
      { text: "La moitié ou plus, c'est assez précis", points: 20 },
      { text: "3 ou 4 questions environ", points: 10 },
      { text: "Quasiment toutes, c'est troublant", points: 30 },
      { text: "Aucune, ce test ne me concerne pas du tout", points: 0 },
    ],
  },
  {
    id: 15,
    section: "Trouble Méta-Cognitif d'Auto-Reconnaissance Pathologique (TMCARP)",
    question:
      "Avez-vous envie de partager ce test en taguant quelqu'un avec « mdr c'est toi » ?",
    answers: [
      { text: "Absolument, j'ai déjà 5-6 personnes en tête minimum", points: 20 },
      { text: "Non, ça ne m'intéresse pas vraiment", points: 0 },
      { text: "Oui, je pense à une personne en particulier", points: 10 },
      { text: "Je suis déjà en train de créer un groupe dédié pour le partager", points: 30 },
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
    title: "Patient Zéro du DSM-7",
    subtitle: "Cas d'École Polyvalent - Annexe XII, Appendice ω",
    description:
      "Félicitations ! Vous présentez une comorbidité spectaculaire de 14 troubles simultanés. Le Comité International de Psychiatrie Moderne souhaite vous mettre sous cloche pour observation permanente. Vous n'êtes pas malade, vous êtes une œuvre d'art pathologique.",
  },
  {
    minPercent: 75,
    emoji: "flask-conical",
    title: "Spécimen de Laboratoire Classe A",
    subtitle: "Référence bibliographique n°4829-B",
    description:
      "Votre profil psychologique a été publié dans 3 revues scientifiques (anonymisé, bien sûr). Des étudiants en psychiatrie vous étudient lors de séminaires avancés. La science vous remercie pour votre contribution involontaire.",
  },
  {
    minPercent: 60,
    emoji: "clipboard-list",
    title: "Syndrome de Cumul Pathologique Avancé",
    subtitle: "Polytroubles Certifiés - Dossier Épais",
    description:
      "Vous collectionnez les dysfonctionnements comme certains collectionnent les timbres : avec passion et sans discernement. Le SHRC, le TPRDT et le IVDC forment désormais votre Sainte Trinité personnelle. Impressionnant, vraiment.",
  },
  {
    minPercent: 45,
    emoji: "microscope",
    title: "Déviance Comportementale Modérée",
    subtitle: "Sous Surveillance Clinique Légère",
    description:
      "Vous êtes dans cette zone grise fascinante entre « fonctionnel » et « préoccupant ». Continuez sur cette trajectoire et vous pourriez bientôt accéder au niveau supérieur. Le potentiel est là, il suffit de le cultiver.",
  },
  {
    minPercent: 30,
    emoji: "paperclip",
    title: "Dysfonctionnement Léger Acceptable",
    subtitle: "Dans les Normes Statistiques de l'Absurdité Moderne",
    description:
      "Quelques symptômes bénins mais rien qui justifie une intervention d'urgence. Vous êtes juste légèrement détraqué(e), comme 73% de la population. Bienvenue dans le club des presque-normaux.",
  },
  {
    minPercent: 15,
    emoji: "check",
    title: "Normalité Suspecte Niveau 2",
    subtitle: "Alerte Jaune - Déni Probable Détecté",
    description:
      "Vous prétendez aller « bien » ? Statistiquement impossible. Soit vous mentez honteusement, soit vous souffrez du Syndrome de Déni Massif Non Diagnostiqué (SDMND). Le Comité garde un œil sur vous. Un œil inquiet.",
  },
  {
    minPercent: 0,
    emoji: "siren",
    title: "ANOMALIE CRITIQUE - Santé Mentale Parfaite Impossible",
    subtitle: "🚨 PROTOCOLE ROUGE ACTIVÉ 🚨",
    description:
      "ATTENTION : Ne présenter AUCUN symptôme est le signe pathologique le plus alarmant du DSM-6. Vous êtes soit un extra-terrestre infiltré, soit en déni terminal phase 4. Consultation psychiatrique d'urgence recommandée dans les 24 heures. Nous prévenons vos proches.",
  },
];

export function getDSM6Profile(score: number, maxScore: number): DSM6Profile {
  const percentage = (score / maxScore) * 100;
  return (
    dsm6Profiles.find((p) => percentage >= p.minPercent) ??
    dsm6Profiles[dsm6Profiles.length - 1]
  );
}