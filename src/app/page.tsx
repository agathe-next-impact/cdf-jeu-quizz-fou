import Link from "next/link";

const games = [
  {
    slug: "/dsm6",
    emoji: "🏥",
    title: "DSM-6 Version Beta",
    description: "Le manuel diagnostique qui n'existe pas encore. 15 questions pour obtenir votre profil clinique officieux.",
    tags: ["Diagnostic", "Solo", "Classement"],
    color: "from-[#1a365d] to-[#e53e3e]",
    border: "border-red-200 hover:border-red-400",
  },
  {
    slug: "/rorschach",
    emoji: "🫠",
    title: "Test de Rorschach",
    description: "10 taches d'encre, 3 choix, zéro chance d'être diagnostiqué(e) sain(e) d'esprit. Chaque réponse sera retenue contre vous.",
    tags: ["Psychologie", "Solo", "Classement"],
    color: "from-[#1a1a2e] to-[#6b21a8]",
    border: "border-purple/20 hover:border-purple/50",
  },
  {
    slug: "/evaluation",
    emoji: "🧠",
    title: "Évaluation Émotionnelle",
    description: "5 émojis, 4 choix, un rapport psychiatrique complet. Chaque réponse révèle un trouble que vous ignoriez avoir.",
    tags: ["Psychiatrie", "Solo", "Classement"],
    color: "from-[#667eea] to-[#764ba2]",
    border: "border-[#667eea]/20 hover:border-[#667eea]/50",
  },
  {
    slug: "/evasion",
    emoji: "🏥",
    title: "Évasion Psychiatrique",
    description: "Un jeu dont vous êtes le héros. Convainquez le Dr. Moreau de votre stabilité mentale pour réduire vos jours d'internement.",
    tags: ["Aventure", "Solo", "Classement"],
    color: "from-[#1e3c72] to-[#2a5298]",
    border: "border-[#1e3c72]/20 hover:border-[#1e3c72]/50",
  },
  {
    slug: "/motricite",
    emoji: "🎯",
    title: "Test de Motricité Fine",
    description: "5 niveaux, des cibles qui bougent, rétrécissent et tremblent. Chaque clic raté est un neurone de moins.",
    tags: ["Motricité", "Solo", "Classement"],
    color: "from-[#0d9488] to-[#14b8a6]",
    border: "border-[#0d9488]/20 hover:border-[#0d9488]/50",
  },
  {
    slug: "/cognitif",
    emoji: "🧠",
    title: "Test Cognitif Absurde",
    description: "8 questions de logique, 30 secondes chrono, un QI calculé avec une précision douteuse. Tapez vos réponses et découvrez votre diagnostic cérébral.",
    tags: ["Logique", "Solo", "Classement"],
    color: "from-[#2c3e50] to-[#e74c3c]",
    border: "border-[#2c3e50]/20 hover:border-[#2c3e50]/50",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-[calc(100vh-80px)] px-4 py-12 relative overflow-hidden">
      {/* Decorative floaters */}
      <div className="absolute top-24 left-8 text-6xl animate-float opacity-10 select-none">🎪</div>
      <div className="absolute top-40 right-12 text-5xl animate-float opacity-10 select-none" style={{ animationDelay: "1.2s" }}>🎭</div>
      <div className="absolute bottom-16 left-16 text-5xl animate-float opacity-10 select-none" style={{ animationDelay: "2.4s" }}>🎉</div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Hero */}
        <div className="text-center mb-14 animate-slide-up">
          <h1 className="text-5xl md:text-6xl font-black gradient-text leading-tight mb-4">
            Comme des Fous
          </h1>
          <p className="text-lg text-purple-dark/60 font-medium max-w-md mx-auto">
            Choisis ton jeu, montre que tu es le plus fou et grimpe dans les classements !
          </p>
        </div>

        {/* Game grid */}
        <div className="grid sm:grid-cols-2 gap-6">
          {games.map((game, i) => (
            <Link
              key={game.slug + i}
              href={game.slug}
              className={`card border-2 ${game.border} relative group flex flex-col animate-slide-up`}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="text-5xl mb-4">{game.emoji}</div>

              <h2 className="text-xl font-black text-purple-dark mb-2 group-hover:text-purple transition-colors">
                {game.title}
              </h2>

              <p className="text-sm text-purple-dark/60 leading-relaxed mb-4 flex-1">
                {game.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {game.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-purple/5 text-purple/70 text-xs font-semibold px-3 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-5">
                <span className={`inline-block bg-gradient-to-r ${game.color} text-white text-sm font-bold px-6 py-2 rounded-full group-hover:scale-105 transition-transform`}>
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
