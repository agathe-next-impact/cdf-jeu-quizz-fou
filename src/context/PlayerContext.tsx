"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";

interface Player {
  id: string;
  pseudo: string;
  email: string;
  createdAt: string;
}

interface PlayerContextType {
  player: Player | null;
  loading: boolean;
  login: (pseudo: string, password: string) => Promise<string | null>;
  register: (pseudo: string, email: string, password: string) => Promise<string | null>;
  logout: () => void;
}

const PlayerContext = createContext<PlayerContextType>({
  player: null,
  loading: true,
  login: async () => "Non initialisé",
  register: async () => "Non initialisé",
  logout: () => {},
});

const STORAGE_KEY = "cdf-player";

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [player, setPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore session from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setPlayer(JSON.parse(stored));
      }
    } catch { /* ignore */ }
    setLoading(false);
  }, []);

  const login = useCallback(async (pseudo: string, password: string): Promise<string | null> => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pseudo, password }),
      });
      const data = await res.json();
      if (!res.ok) return data.error || "Erreur de connexion";
      setPlayer(data);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return null; // no error
    } catch {
      return "Erreur réseau";
    }
  }, []);

  const register = useCallback(
    async (pseudo: string, email: string, password: string): Promise<string | null> => {
      try {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pseudo, email, password }),
        });
        const data = await res.json();
        if (!res.ok) return data.error || "Erreur d'inscription";
        setPlayer(data);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        return null;
      } catch {
        return "Erreur réseau";
      }
    },
    []
  );

  const logout = useCallback(() => {
    setPlayer(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <PlayerContext.Provider value={{ player, loading, login, register, logout }}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  return useContext(PlayerContext);
}
