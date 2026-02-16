"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePlayer } from "@/context/PlayerContext";
import { Ticket, X } from "lucide-react";

export default function RegisterInvite() {
  const { player, loading } = usePlayer();
  const [dismissed, setDismissed] = useState(false);
  const pathname = usePathname();

  if (loading || player || dismissed) return null;

  // Extract game name from URL (e.g., "/cognitif/results" → "cognitif")
  const game = pathname.split("/")[1] || "";
  const redirect = encodeURIComponent(`/${game}/results`);

  function handleAuthClick() {
    if (game) {
      localStorage.setItem("cdf-pending-game", game);
    }
  }

  return (
    <div className="card mb-6 border border-blue text-center relative">
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-2 right-3 text-blue hover:text-blue leading-none"
        aria-label="Fermer"
      >
        <X size={18} />
      </button>

      <div className="flex justify-center mb-3">
        <Ticket size={36} className="text-black" />
      </div>
      <h3 className="text-lg font-black text-black mb-1">
        Envie de sauvegarder tes scores ?
      </h3>
      <p className="text-sm text-black mb-4">
        Tes scores ne sont pas enregistrés ! Connecte-toi ou crée un compte pour sauvegarder tes résultats et apparaitre dans les classements.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
        <Link
          href={`/inscription?redirect=${redirect}`}
          onClick={handleAuthClick}
          className="btn-primary text-center"
        >
          Créer mon profil
        </Link>
        <Link
          href={`/connexion?redirect=${redirect}`}
          onClick={handleAuthClick}
          className="text-sm font-semibold text-blue hover:underline transition-colors"
        >
          Déjà inscrit ? Se connecter
        </Link>
      </div>
    </div>
  );
}
