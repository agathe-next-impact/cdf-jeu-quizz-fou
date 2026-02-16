import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Test de Rorschach — Analyse Psychologique",
  description:
    "10 taches d'encre, 3 choix, zéro chance d'être diagnostiqué(e) sain(e) d'esprit. Chaque réponse sera retenue contre vous.",
  openGraph: {
    title: "Test de Rorschach — Analyse Psychologique",
    description:
      "10 taches d'encre, 3 choix, zéro chance d'être diagnostiqué(e) sain(e) d'esprit. Chaque réponse sera retenue contre vous.",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 800,
        alt: "Comme des Fous — Test de Rorschach",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Test de Rorschach — Analyse Psychologique",
    description:
      "10 taches d'encre, 3 choix, zéro chance d'être diagnostiqué(e) sain(e) d'esprit.",
    images: ["/logo.png"],
  },
};

export default function RorschachLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
