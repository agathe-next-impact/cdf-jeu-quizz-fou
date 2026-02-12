"use client";

import { useState } from "react";
import Link from "next/link";
import { usePlayer } from "@/context/PlayerContext";

export default function RegisterInvite() {
  const { player, loading } = usePlayer();
  const [dismissed, setDismissed] = useState(false);

  if (loading || player || dismissed) return null;

  return (
    <div className="card mb-6 border-2 border-purple/20 bg-purple/5 text-center relative">
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-2 right-3 text-purple/40 hover:text-purple/70 text-lg leading-none"
        aria-label="Fermer"
      >
        &times;
      </button>

      <div className="text-4xl mb-3">🎫</div>
      <h3 className="text-lg font-black text-purple-dark mb-1">
        Envie de sauvegarder tes scores ?
      </h3>
      <p className="text-sm text-purple-dark/60 mb-4">
        Inscris-toi pour apparaitre dans les classements et suivre ta progression.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/inscription"
          className="btn-primary text-center"
        >
          Créer mon profil
        </Link>
        <button
          onClick={() => setDismissed(true)}
          className="text-sm font-semibold text-purple/50 hover:text-purple/70 transition-colors"
        >
          Non merci
        </button>
      </div>
    </div>
  );
}
