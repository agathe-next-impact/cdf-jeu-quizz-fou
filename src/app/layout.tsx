import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Comme des Fous | Les jeux les plus fous du web",
  description:
    "Quizz, défis, jeux multijoueur... Joue comme un fou, grimpe dans les classements et montre qui est le plus dingue !",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="antialiased min-h-screen">
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
