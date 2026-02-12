import type { Metadata } from "next";
import { Belanosima, Open_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { PlayerProvider } from "@/context/PlayerContext";
import { ThemeProvider } from "@/context/ThemeProvider";

const belanosima = Belanosima({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-belanosima",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
});

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
    <html lang="fr" className={`${belanosima.variable} ${openSans.variable}`} suppressHydrationWarning>
       <body className="antialiased min-h-screen transition-colors duration-300">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <PlayerProvider>
            <Header />
            <main>{children}</main>
          </PlayerProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
