"use client";

import { useState, useEffect, createContext, useContext, ReactNode } from "react";

interface SessionState {
  connected: boolean;
  username?: string;
  profileImage?: string;
  loading: boolean;
}

interface SessionContextType extends SessionState {
  refresh: () => Promise<void>;
  disconnect: () => Promise<void>;
}

const SessionContext = createContext<SessionContextType>({
  connected: false,
  loading: true,
  refresh: async () => {},
  disconnect: async () => {},
});

export function useSession() {
  return useContext(SessionContext);
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SessionState>({
    connected: false,
    loading: true,
  });

  const refresh = async () => {
    try {
      const res = await fetch("/api/auth/session");
      const data = await res.json();
      setState({
        connected: data.connected,
        username: data.username,
        profileImage: data.profileImage,
        loading: false,
      });
    } catch {
      setState({ connected: false, loading: false });
    }
  };

  const disconnect = async () => {
    try {
      await fetch("/api/auth/disconnect", { method: "POST" });
      setState({ connected: false, loading: false });
    } catch {
      console.error("Failed to disconnect");
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <SessionContext.Provider value={{ ...state, refresh, disconnect }}>
      {children}
    </SessionContext.Provider>
  );
}
