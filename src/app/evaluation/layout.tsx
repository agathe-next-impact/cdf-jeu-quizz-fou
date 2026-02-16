import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Évaluation Émotionnelle — Rapport Psychiatrique",
  description:
    "5 émojis, 4 choix, un rapport psychiatrique complet. Chaque réponse révèle un trouble que vous ignoriez avoir.",
  openGraph: {
    title: "Évaluation Émotionnelle — Rapport Psychiatrique",
    description:
      "5 émojis, 4 choix, un rapport psychiatrique complet. Chaque réponse révèle un trouble que vous ignoriez avoir.",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 800,
        alt: "Comme des Fous — Évaluation Émotionnelle",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Évaluation Émotionnelle — Rapport Psychiatrique",
    description:
      "5 émojis, 4 choix, un rapport psychiatrique complet. Chaque réponse révèle un trouble que vous ignoriez avoir.",
    images: ["/logo.png"],
  },
};

export default function EvaluationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
