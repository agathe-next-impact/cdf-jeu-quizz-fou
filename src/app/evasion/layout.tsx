import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Évasion Psychiatrique — Jeu d'Aventure",
  description:
    "Un jeu dont vous êtes le héros. Convainquez le Dr. Moreau de votre stabilité mentale pour réduire vos jours d'internement.",
  openGraph: {
    title: "Évasion Psychiatrique — Jeu d'Aventure",
    description:
      "Un jeu dont vous êtes le héros. Convainquez le Dr. Moreau de votre stabilité mentale pour réduire vos jours d'internement.",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 800,
        alt: "Comme des Fous — Évasion Psychiatrique",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Évasion Psychiatrique — Jeu d'Aventure",
    description:
      "Convainquez le Dr. Moreau de votre stabilité mentale pour réduire vos jours d'internement.",
    images: ["/logo.png"],
  },
};

export default function EvasionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
