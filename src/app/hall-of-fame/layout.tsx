import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hall of Fame — Top 10 des plus fous",
  description:
    "Le classement général des patients les plus dérangés. Découvrez qui domine le palmarès de la folie sur Comme des Fous.",
  openGraph: {
    title: "Hall of Fame — Top 10 des plus fous",
    description:
      "Le classement général des patients les plus dérangés. Découvrez qui domine le palmarès de la folie.",
    images: [
      {
        url: "/logo-cdf.png",
        width: 800,
        height: 800,
        alt: "Comme des Fous — Hall of Fame",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hall of Fame — Top 10 des plus fous",
    description:
      "Le classement général des patients les plus dérangés sur Comme des Fous.",
    images: ["/logo-cdf.png"],
  },
};

export default function HallOfFameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
