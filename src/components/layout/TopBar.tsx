"use client";

/* ─────────────────────────────────────────────
   CLEARBOT — TopBar layout component
   Fixed 56-px header shown on every screen.
   Contains the CLEARBOT wordmark on the left and
   nothing on the right — no nav links needed for
   this single-flow experience.
   ───────────────────────────────────────────── */

import Link from "next/link";

export function TopBar() {
  return (
    <header
      className="w-full h-14 flex items-center px-6 border-b border-cb-border bg-cb-base"
      style={{ position: "sticky", top: 0, zIndex: 100 }}
    >
      <Link
        href="/"
        className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
        aria-label="CLEARBOT — go to home"
      >
        <span
          aria-hidden="true"
          className="flex items-center justify-center w-7 h-7 rounded-full text-[var(--bg-base)] font-clash font-semibold text-[13px]"
          style={{ background: "var(--accent-green)" }}
        >
          C
        </span>
        <span className="font-clash font-semibold text-[18px] text-cb-primary tracking-tight">
          CLEARBOT
        </span>
      </Link>
    </header>
  );
}
