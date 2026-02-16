import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mon Profil — Dossier Patient",
  description:
    "Consultez votre dossier patient, vos scores, vos diagnostics et votre progression sur Comme des Fous.",
  openGraph: {
    title: "Mon Profil — Dossier Patient",
    description:
      "Consultez votre dossier patient, vos scores, vos diagnostics et votre progression.",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 800,
        alt: "Comme des Fous — Profil",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mon Profil — Dossier Patient",
    description:
      "Consultez votre dossier patient, vos scores et vos diagnostics.",
    images: ["/logo.png"],
  },
};

export default function ProfilLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
