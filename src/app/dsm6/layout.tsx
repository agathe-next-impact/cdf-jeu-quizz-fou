import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DSM-6 Version Beta — Diagnostic Psychiatrique",
  description:
    "Le manuel diagnostique qui n'existe pas encore. 15 questions pour obtenir votre profil clinique officieux. Classement des patients inclus.",
  openGraph: {
    title: "DSM-6 Version Beta — Diagnostic Psychiatrique",
    description:
      "Le manuel diagnostique qui n'existe pas encore. 15 questions pour obtenir votre profil clinique officieux.",
    images: [
      {
        url: "/logo-cdf.png",
        width: 800,
        height: 800,
        alt: "Comme des Fous — DSM-6",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DSM-6 Version Beta — Diagnostic Psychiatrique",
    description:
      "Le manuel diagnostique qui n'existe pas encore. 15 questions pour obtenir votre profil clinique officieux.",
    images: ["/logo-cdf.png"],
  },
};

export default function DSM6Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
