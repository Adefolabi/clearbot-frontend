"use client";

/* ─────────────────────────────────────────────
   CLEARBOT — LogFeed component
   Scrollable container for the live log entries.
   Auto-scrolls to the bottom on each new entry
   unless the user has manually scrolled up.
   The last 3 entries get the elevated background
   highlight treatment from LogEntry.
   ───────────────────────────────────────────── */

import { useEffect, useRef } from "react";
import { LogEntry as LogEntryComponent } from "./LogEntry";
import type { LogEntry } from "@/types";

interface LogFeedProps {
  logs: LogEntry[];
}

const RECENT_COUNT = 3;

export function LogFeed({ logs }: LogFeedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const userScrolledRef = useRef(false);

  // Detect if user manually scrolled up
  const handleScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 40;
    userScrolledRef.current = !atBottom;
  };

  // Auto-scroll to bottom when new log arrives (unless user scrolled up)
  useEffect(() => {
    if (userScrolledRef.current) return;
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [logs.length]);

  if (logs.length === 0) {
    return (
      <div
        className="rounded-[12px] border border-cb-border bg-cb-surface px-4 py-8 text-center"
      >
        <p className="font-dm text-[13px] text-cb-muted">
          Waiting for the bot to start…
        </p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="custom-scroll rounded-[12px] border border-cb-border bg-cb-surface overflow-y-auto"
      style={{ maxHeight: "420px" }}
    >
      <div className="py-2">
        {logs.map((entry, idx) => {
          const isRecent = idx >= logs.length - RECENT_COUNT;
          return (
            <LogEntryComponent
              key={entry.id}
              entry={entry}
              isRecent={isRecent}
            />
          );
        })}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
