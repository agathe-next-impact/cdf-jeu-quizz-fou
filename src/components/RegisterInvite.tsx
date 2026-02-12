"use client";

import { useState } from "react";
import Link from "next/link";
import { usePlayer } from "@/context/PlayerContext";
import { Ticket, X } from "lucide-react";

export default function RegisterInvite() {
  const { player, loading } = usePlayer();
  const [dismissed, setDismissed] = useState(false);

  if (loading || player || dismissed) return null;

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
          className="text-sm font-semibold text-blue hover:text-blue transition-colors"
        >
          Non merci
        </button>
      </div>
    </div>
  );
}
