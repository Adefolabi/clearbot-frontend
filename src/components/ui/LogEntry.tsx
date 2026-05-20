"use client";

/* ─────────────────────────────────────────────
   CLEARBOT — LogEntry component
   A single row in the live log feed. Each entry
   slides in from the left and shows a status icon,
   optional course code, and message text. The
   "running" status gets a spinning icon and an
   elevated background to highlight current activity.
   ───────────────────────────────────────────── */

import { RefObject } from "react";
import type { LogEntry as LogEntryType } from "@/types";

interface LogEntryProps {
  entry: LogEntryType;
  isRecent: boolean;
  entryRef?: RefObject<HTMLDivElement>;
}

const ICONS: Record<string, string> = {
  skipped:  "—",   // Fix 6: neutral dash — already assessed, not a fresh completion
  running:  "⟳",
  complete: "✅",
  waiting:  "○",
  error:    "⚠",
  failed:   "✕",
  info:     "·",
  success:  "✅",
};

const TEXT_COLORS: Record<string, string> = {
  skipped:  "var(--text-secondary)", // Fix 6: secondary instead of muted — more readable
  running:  "var(--accent-blue)",
  complete: "var(--accent-green)",
  waiting:  "var(--text-muted)",
  error:    "var(--warning)",
  failed:   "var(--error)",
  info:     "var(--text-secondary)",
  success:  "var(--accent-green)",
};

export function LogEntry({ entry, isRecent, entryRef }: LogEntryProps) {
  const status = entry.status ?? "info";
  const icon = ICONS[status] ?? "·";
  const isRunning = status === "running";

  return (
    <div
      ref={entryRef}
      className={[
        "log-entry flex items-start gap-3 px-4 py-2.5 rounded-lg transition-colors",
        isRecent ? "bg-cb-elevated" : "bg-transparent",
      ].join(" ")}
    >
      <span
        aria-hidden="true"
        className={isRunning ? "spin inline-block" : "inline-block"}
        style={{
          color: TEXT_COLORS[status] ?? "var(--text-secondary)",
          minWidth: "16px",
          textAlign: "center",
          marginTop: "1px",
          fontSize: "14px",
        }}
      >
        {icon}
      </span>

      <div className="flex-1 min-w-0">
        {entry.courseCode && (
          <span
            className="font-dm font-medium text-[14px] mr-2"
            style={{ color: "var(--text-primary)" }}
          >
            {entry.courseCode}
          </span>
        )}
        <span
          className="font-dm text-[13px] text-cb-secondary"
        >
          {entry.message}
        </span>
      </div>
    </div>
  );
}
