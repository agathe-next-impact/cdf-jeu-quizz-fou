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

const siteUrl = "https://commedesfous.fr";
const siteName = "Comme des Fous";
const siteDescription =
  "Quizz, défis, jeux multijoueur... Joue comme un fou, grimpe dans les classements et montre qui est le plus dingue !";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Comme des Fous | Les jeux les plus fous du web",
    template: "%s | Comme des Fous",
  },
  description: siteDescription,
  keywords: [
    "quiz",
    "jeux",
    "quizz",
    "défis",
    "classement",
    "multijoueur",
    "psychiatrie",
    "humour",
    "comme des fous",
    "jeux en ligne",
    "test de personnalité",
    "rorschach",
    "DSM",
    "QI",
  ],
  authors: [{ name: siteName }],
  creator: siteName,
  publisher: siteName,
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: siteUrl,
    siteName,
    title: "Comme des Fous | Les jeux les plus fous du web",
    description: siteDescription,
    images: [
      {
        url: "/logo-cdf.png",
        width: 800,
        height: 800,
        alt: "Comme des Fous — Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Comme des Fous | Les jeux les plus fous du web",
    description: siteDescription,
    images: ["/logo-cdf.png"],
  },
  icons: {
    icon: "/logo-cdf.png",
    apple: "/logo-cdf.png",
  },
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
