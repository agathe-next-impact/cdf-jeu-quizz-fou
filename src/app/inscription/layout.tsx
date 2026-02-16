import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inscription — Admission à l'asile",
  description:
    "Créez votre dossier patient pour rejoindre l'asile. Sauvegardez vos scores, grimpez dans les classements et devenez le plus fou.",
  openGraph: {
    title: "Inscription — Admission à l'asile",
    description:
      "Créez votre dossier patient pour rejoindre l'asile. Sauvegardez vos scores et grimpez dans les classements.",
    images: [
      {
        url: "/logo-cdf.png",
        width: 800,
        height: 800,
        alt: "Comme des Fous — Inscription",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Inscription — Admission à l'asile",
    description:
      "Créez votre dossier patient pour rejoindre l'asile sur Comme des Fous.",
    images: ["/logo-cdf.png"],
  },
};

export default function InscriptionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
