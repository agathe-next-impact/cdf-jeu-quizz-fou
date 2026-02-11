import Link from "next/link";

const games = [
  {
    slug: "/quiz-fou",
    emoji: "🤪",
    title: "Le Quizz Fou",
    description: "15 questions pour mesurer ton niveau de folie ! Réponds et découvre ton titre.",
    tags: ["Quizz", "Solo", "Classement"],
    color: "from-purple to-purple-light",
    border: "border-purple/20 hover:border-purple/50",
  },
  {
    slug: "#",
    emoji: "🧠",
    title: "Le Défi Mémoire",
    description: "Retiens les séquences et bats ton record. Jusqu'où ira ta mémoire ?",
    tags: ["Mémoire", "Solo", "Chrono"],
    color: "from-green-dark to-green",
    border: "border-green/20 hover:border-green/50",
    soon: true,
  },
  {
    slug: "#",
    emoji: "🎨",
    title: "Devine le Dessin",
    description: "Dessine, devine et fais rire tout le monde. Le plus fou gagne !",
    tags: ["Dessin", "Multijoueur"],
    color: "from-pink-dark to-pink",
    border: "border-pink/20 hover:border-pink/50",
    soon: true,
  },
  {
    slug: "#",
    emoji: "⚡",
    title: "Le Vrai ou Faux Express",
    description: "30 secondes pour répondre à un max de questions. Vrai ou faux, à toi de trancher !",
    tags: ["Rapidité", "Solo", "Chrono"],
    color: "from-orange to-yellow",
    border: "border-orange/20 hover:border-orange/50",
    soon: true,
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
              aria-disabled={game.soon}
              className={`card border-2 ${game.border} relative group flex flex-col animate-slide-up ${
                game.soon ? "opacity-70 pointer-events-none" : ""
              }`}
              style={{ animationDelay: `${i * 0.1}s` }}
              tabIndex={game.soon ? -1 : undefined}
            >
              {game.soon && (
                <span className="absolute top-4 right-4 bg-purple/10 text-purple text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Bientôt
                </span>
              )}

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

              {!game.soon && (
                <div className="mt-5">
                  <span className={`inline-block bg-gradient-to-r ${game.color} text-white text-sm font-bold px-6 py-2 rounded-full group-hover:scale-105 transition-transform`}>
                    Jouer
                  </span>
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
