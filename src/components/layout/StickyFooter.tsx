"use client";

/* ─────────────────────────────────────────────
   CLEARBOT — StickyFooter layout component
   Fixed bottom warning shown only on the /running
   screen. Flashes a red border pulse when the
   user switches away from the tab mid-run.
   ───────────────────────────────────────────── */

import { useEffect, useRef, useState } from "react";
import { AlertTriangle } from "lucide-react";

export function StickyFooter() {
  const [isPulsing, setIsPulsing] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function handleVisibilityChange() {
      if (document.hidden) {
        setIsPulsing(true);
        if (timerRef.current) clearTimeout(timerRef.current);
        // 3 pulses × 400ms each = 1.2s total
        timerRef.current = setTimeout(() => setIsPulsing(false), 1200);
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div
      className={[
        "fixed bottom-0 left-0 right-0 z-50",
        "bg-cb-surface border-t border-cb-border px-6 py-3",
        "flex items-center gap-2",
        isPulsing ? "tab-warning border-cb-error" : "",
      ].join(" ")}
    >
      <AlertTriangle
        size={16}
        aria-hidden="true"
        style={{ color: "var(--warning)", flexShrink: 0 }}
      />
      <p className="font-dm text-[13px] text-cb-secondary">
        Keep this tab open until complete
      </p>
    </div>
  );
}
