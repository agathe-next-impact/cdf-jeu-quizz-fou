"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";

interface Player {
  id: string;
  pseudo: string;
  email: string;
  avatar: string;
  badgeEmoji?: string;
  badgeName?: string;
  createdAt: string;
  madnessSince?: string;
  bio?: string;
  autodiagnostic?: string;
}

interface PlayerContextType {
  player: Player | null;
  loading: boolean;
  login: (pseudo: string, password: string) => Promise<string | null>;
  register: (pseudo: string, email: string, password: string, avatar?: string) => Promise<string | null>;
  updateAvatar: (avatar: string) => Promise<string | null>;
  updateProfile: (fields: { madnessSince?: string; bio?: string; autodiagnostic?: string }) => Promise<string | null>;
  updateBadge: (emoji: string, name: string) => void;
  logout: () => void;
}

const PlayerContext = createContext<PlayerContextType>({
  player: null,
  loading: true,
  login: async () => "Non initialisé",
  register: async () => "Non initialisé",
  updateAvatar: async () => "Non initialisé",
  updateProfile: async () => "Non initialisé",
  updateBadge: () => {},
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
    async (pseudo: string, email: string, password: string, avatar?: string): Promise<string | null> => {
      try {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pseudo, email, password, avatar }),
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

  const updateAvatar = useCallback(async (avatar: string): Promise<string | null> => {
    if (!player) return "Non connecté";
    try {
      const res = await fetch("/api/auth/avatar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pseudo: player.pseudo, avatar }),
      });
      if (!res.ok) {
        const data = await res.json();
        return data.error || "Erreur de mise à jour";
      }
      const updated = { ...player, avatar };
      setPlayer(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return null;
    } catch {
      return "Erreur réseau";
    }
  }, [player]);

  const updateProfile = useCallback(async (fields: { madnessSince?: string; bio?: string; autodiagnostic?: string }): Promise<string | null> => {
    if (!player) return "Non connecté";
    try {
      const res = await fetch("/api/auth/profile-update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pseudo: player.pseudo, ...fields }),
      });
      if (!res.ok) {
        const data = await res.json();
        return data.error || "Erreur de mise à jour";
      }
      const updated = { ...player, ...fields };
      setPlayer(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return null;
    } catch {
      return "Erreur réseau";
    }
  }, [player]);

  const updateBadge = useCallback((emoji: string, name: string) => {
    if (!player) return;
    const updated = { ...player, badgeEmoji: emoji, badgeName: name };
    setPlayer(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }, [player]);

  const logout = useCallback(() => {
    setPlayer(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <PlayerContext.Provider value={{ player, loading, login, register, updateAvatar, updateProfile, updateBadge, logout }}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  return useContext(PlayerContext);
}
