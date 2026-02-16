import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Test Cognitif Absurde — Calculez votre QI",
  description:
    "8 questions de logique, 30 secondes chrono, un QI calculé avec une précision douteuse. Tapez vos réponses et découvrez votre diagnostic cérébral.",
  openGraph: {
    title: "Test Cognitif Absurde — Calculez votre QI",
    description:
      "8 questions de logique, 30 secondes chrono, un QI calculé avec une précision douteuse. Tapez vos réponses et découvrez votre diagnostic cérébral.",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 800,
        alt: "Comme des Fous — Test Cognitif Absurde",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Test Cognitif Absurde — Calculez votre QI",
    description:
      "8 questions de logique, 30 secondes chrono, un QI calculé avec une précision douteuse.",
    images: ["/logo.png"],
  },
};

export default function CognitifLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
