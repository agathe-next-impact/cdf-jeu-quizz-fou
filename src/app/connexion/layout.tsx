import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Connexion — Accès à l'asile",
  description:
    "Connectez-vous à votre compte patient pour sauvegarder vos scores et grimper dans les classements sur Comme des Fous.",
  openGraph: {
    title: "Connexion — Accès à l'asile",
    description:
      "Connectez-vous à votre compte patient pour sauvegarder vos scores et grimper dans les classements.",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 800,
        alt: "Comme des Fous — Connexion",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Connexion — Accès à l'asile",
    description:
      "Connectez-vous pour sauvegarder vos scores sur Comme des Fous.",
    images: ["/logo.png"],
  },
};

export default function ConnexionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
