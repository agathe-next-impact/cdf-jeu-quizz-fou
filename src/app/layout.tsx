import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Qui est le plus fou ? | Comme des Fous",
  description:
    "Le quizz le plus fou du web ! Réponds aux questions, accumule des points et découvre à quel point tu es fou/folle. Classement en temps réel !",
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
