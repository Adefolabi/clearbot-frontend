"use client";

/* ─────────────────────────────────────────────
   CLEARBOT — Toast notification system
   Provides ToastProvider (wraps the app) and
   useToast() hook. Toasts auto-dismiss after 4 s,
   slide in from the top, and support success /
   error / warning variants with coloured left borders.
   ───────────────────────────────────────────── */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { X } from "lucide-react";
import type { ToastItem } from "@/types";

interface ToastContextValue {
  addToast: (message: string, type?: ToastItem["type"]) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, exiting: true } : t)),
    );
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 150);
  }, []);

  const addToast = useCallback(
    (message: string, type: ToastItem["type"] = "error") => {
      const id = `toast-${Date.now()}-${Math.random()}`;
      setToasts((prev) => [...prev, { id, message, type }]);
    },
    [],
  );

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <ToastList toasts={toasts} onDismiss={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
  return ctx;
}

/* ─── Toast list overlay ─────────────────────── */

function ToastList({
  toasts,
  onDismiss,
}: {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}) {
  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-2 w-full max-w-xs px-4"
    >
      {toasts.map((toast) => (
        <ToastCard key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

/* ─── Individual toast card ──────────────────── */

const BORDER_COLORS: Record<ToastItem["type"], string> = {
  success: "var(--accent-green)",
  error:   "var(--error)",
  warning: "var(--warning)",
};

function ToastCard({
  toast,
  onDismiss,
}: {
  toast: ToastItem;
  onDismiss: (id: string) => void;
}) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => onDismiss(toast.id), 4000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [toast.id, onDismiss]);

  return (
    <div
      role="alert"
      className={[
        "flex items-start gap-3 rounded-[10px] px-4 py-3",
        "bg-cb-elevated border border-cb-border shadow-lg",
        toast.exiting ? "toast-exit" : "toast-enter",
      ].join(" ")}
      style={{ borderLeftWidth: "4px", borderLeftColor: BORDER_COLORS[toast.type] }}
    >
      <p className="flex-1 font-dm text-[13px] text-cb-primary leading-snug">
        {toast.message}
      </p>
      <button
        type="button"
        aria-label="Dismiss notification"
        onClick={() => onDismiss(toast.id)}
        className="text-cb-secondary hover:text-cb-primary transition-colors mt-0.5 shrink-0"
      >
        <X size={14} aria-hidden="true" />
      </button>
    </div>
  );
}
