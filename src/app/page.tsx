import Link from "next/link";
import { Hospital, Palette, Brain, DoorOpen, Target, Trophy, Tent, Drama, PartyPopper, type LucideIcon } from "lucide-react";

const games: { slug: string; icon: LucideIcon; title: string; description: string; tags: string[]; color: string; border: string }[] = [
  {
    slug: "/dsm6",
    icon: Hospital,
    title: "DSM-6 Version Beta",
    description: "Le manuel diagnostique qui n'existe pas encore. 15 questions pour obtenir votre profil clinique officieux.",
    tags: ["Diagnostic", "Solo", "Classement"],
    color: "bg-red",
    border: "border-red hover:border-red",
  },
  {
    slug: "/rorschach",
    icon: Palette,
    title: "Test de Rorschach",
    description: "10 taches d'encre, 3 choix, zéro chance d'être diagnostiqué(e) sain(e) d'esprit. Chaque réponse sera retenue contre vous.",
    tags: ["Psychologie", "Solo", "Classement"],
    color: "bg-blue",
    border: "border-blue hover:border-blue",
  },
  {
    slug: "/evaluation",
    icon: Brain,
    title: "Évaluation Émotionnelle",
    description: "5 émojis, 4 choix, un rapport psychiatrique complet. Chaque réponse révèle un trouble que vous ignoriez avoir.",
    tags: ["Psychiatrie", "Solo", "Classement"],
    color: "bg-blue",
    border: "border-blue hover:border-blue",
  },
  {
    slug: "/evasion",
    icon: DoorOpen,
    title: "Évasion Psychiatrique",
    description: "Un jeu dont vous êtes le héros. Convainquez le Dr. Moreau de votre stabilité mentale pour réduire vos jours d'internement.",
    tags: ["Aventure", "Solo", "Classement"],
    color: "bg-blue",
    border: "border-blue hover:border-blue",
  },
  {
    slug: "/motricite",
    icon: Target,
    title: "Test de Motricité Fine",
    description: "5 niveaux, des cibles qui bougent, rétrécissent et tremblent. Chaque clic raté est un neurone de moins.",
    tags: ["Motricité", "Solo", "Classement"],
    color: "bg-blue",
    border: "border-blue hover:border-blue",
  },
  {
    slug: "/cognitif",
    icon: Brain,
    title: "Test Cognitif Absurde",
    description: "8 questions de logique, 30 secondes chrono, un QI calculé avec une précision douteuse. Tapez vos réponses et découvrez votre diagnostic cérébral.",
    tags: ["Logique", "Solo", "Classement"],
    color: "bg-red",
    border: "border-black hover:border-black",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-[calc(100vh-80px)] px-4 py-12 relative overflow-hidden">
      {/* Decorative floaters */}
      <div className="absolute top-24 left-8 animate-float select-none">
        <Tent size={56} className="text-black/20" />
      </div>
      <div className="absolute top-40 right-12 animate-float select-none" style={{ animationDelay: "1.2s" }}>
        <Drama size={48} className="text-black/20" />
      </div>
      <div className="absolute bottom-16 left-16 animate-float select-none" style={{ animationDelay: "2.4s" }}>
        <PartyPopper size={48} className="text-black/20" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Hero */}
        <div className="text-center mb-14 animate-slide-up">
          <h1 className="text-5xl md:text-6xl font-black text-black leading-tight mb-4">
            
          </h1>
          <p className="text-2xl text-black font-medium max-w-md mx-auto">
            Qui veut gagner des médocs ?
          </p>
        </div>

        {/* Hall of Fame CTA */}
        <div className="text-center mb-8 animate-slide-up" style={{ animationDelay: "0.05s" }}>
          <Link
            href="/hall-of-fame"
            className="inline-flex items-center gap-2 bg-yellow text-[#000000] font-bold px-6 py-3 rounded-full hover:scale-105 transition-transform"
          >
            <Trophy size={20} />
            Hall of Fame — Top 10 des plus fous
          </Link>
        </div>

        {/* Game grid */}
        <div className="grid sm:grid-cols-2 gap-6">
          {games.map((game, i) => (
            <Link
              key={game.slug + i}
              href={game.slug}
              className={`card border ${game.border} relative group flex flex-col animate-slide-up`}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="mb-4">
                <game.icon size={48} className="text-black" />
              </div>

              <h2 className="text-xl font-black text-black mb-2 group-hover:text-red transition-colors">
                {game.title}
              </h2>

              <p className="text-sm text-black leading-relaxed mb-4 flex-1">
                {game.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {game.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-black border border-black text-xs font-normal px-3 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-5">
                <span className="inline-block bg-red text-white text-sm font-bold px-6 py-2 rounded-full group-hover:scale-105 transition-transform">
                  Jouer
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
