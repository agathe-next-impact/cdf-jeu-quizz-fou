import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Test de Motricité Fine — Précision Neurologique",
  description:
    "5 niveaux, des cibles qui bougent, rétrécissent et tremblent. Chaque clic raté est un neurone de moins.",
  openGraph: {
    title: "Test de Motricité Fine — Précision Neurologique",
    description:
      "5 niveaux, des cibles qui bougent, rétrécissent et tremblent. Chaque clic raté est un neurone de moins.",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 800,
        alt: "Comme des Fous — Test de Motricité Fine",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Test de Motricité Fine — Précision Neurologique",
    description:
      "5 niveaux, des cibles qui bougent, rétrécissent et tremblent. Chaque clic raté est un neurone de moins.",
    images: ["/logo.png"],
  },
};

export default function MotriciteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
