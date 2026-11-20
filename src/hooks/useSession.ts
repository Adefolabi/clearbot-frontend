"use client";

/* ─────────────────────────────────────────────
   CLEARBOT — Session context
   Holds all cross-screen state in React context.
   Non-secret fields are mirrored to sessionStorage
   (tab-scoped, never localStorage) so a refresh on
   /running or /done doesn't lose the job. The
   password is NEVER persisted: it lives in a ref and
   is consumed once.
   ───────────────────────────────────────────── */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type { SessionState } from "@/types";
import { sanitizeStoredSession } from "@/lib/validation";

const STORAGE_KEY = "clearbot-session";

function loadStored(): Partial<SessionState> {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? sanitizeStoredSession(JSON.parse(raw) as Partial<SessionState>) : {};
  } catch {
    return {};
  }
}

function saveStored(value: Partial<SessionState>) {
  try {
    if (Object.keys(value).length === 0) sessionStorage.removeItem(STORAGE_KEY);
    else sessionStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    /* storage unavailable — in-memory state still works */
  }
}

interface SessionContextValue {
  session: Partial<SessionState>;
  /** False until stored session has been restored on the client. Route guards must wait for this. */
  ready: boolean;
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
  const [ready, setReady] = useState(false);

  // Restore after mount (not in the initial state) to avoid SSR hydration mismatch.
  useEffect(() => {
    setSessionState((prev) => ({ ...loadStored(), ...prev }));
    setReady(true);
  }, []);

  // Mirror to sessionStorage once restored. The password is not part of this state.
  useEffect(() => {
    if (ready) saveStored(session);
  }, [session, ready]);
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
    { value: { session, ready, setSession, clearSession, storePassword, consumePassword } },
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
