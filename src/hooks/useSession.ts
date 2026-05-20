"use client";

/* ─────────────────────────────────────────────
   CLEARBOT — Session context
   Holds all cross-screen state in React context
   (never localStorage). Password is kept in a
   separate transient slot and consumed once.
   ───────────────────────────────────────────── */

import React, {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import type { SessionState } from "@/types";

interface SessionContextValue {
  session: Partial<SessionState>;
  setSession: (update: Partial<SessionState>) => void;
  clearSession: () => void;
  /** Store password briefly — cleared once consumed. */
  storePassword: (pw: string) => void;
  /** Returns the stored password and clears it immediately. */
  consumePassword: () => string | null;
}

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, setSessionState] = useState<Partial<SessionState>>({});
  // Password lives in a ref so it is never part of React's render cycle
  // and does not trigger re-renders when set/cleared.
  const passwordRef = useRef<string | null>(null);

  const setSession = useCallback((update: Partial<SessionState>) => {
    setSessionState((prev) => ({ ...prev, ...update }));
  }, []);

  const clearSession = useCallback(() => {
    setSessionState({});
    passwordRef.current = null;
  }, []);

  const storePassword = useCallback((pw: string) => {
    passwordRef.current = pw;
  }, []);

  const consumePassword = useCallback((): string | null => {
    const pw = passwordRef.current;
    passwordRef.current = null; // wipe immediately
    return pw;
  }, []);

  return React.createElement(
    SessionContext.Provider,
    { value: { session, setSession, clearSession, storePassword, consumePassword } },
    children,
  );
}

export function useSession(): SessionContextValue {
  const ctx = useContext(SessionContext);
  if (!ctx) {
    throw new Error("useSession must be used within <SessionProvider>");
  }
  return ctx;
}
