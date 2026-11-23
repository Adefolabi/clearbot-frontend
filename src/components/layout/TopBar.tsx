"use client";

/* ─────────────────────────────────────────────
   CLEARBOT — TopBar layout component
   Nav from the Campus design: zap-mark logo +
   CLEARBOT wordmark on the left, nothing on the
   right. Padding steps up from mobile (20/18) to
   desktop (80/24) as in the Figma frames.
   ───────────────────────────────────────────── */

import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

export function TopBar() {
  return (
    <header className="flex w-full items-center justify-between px-5 py-[18px] lg:px-12 lg:py-6 xl:px-20">
      <Link
        href="/"
        className="flex items-center gap-[10px] transition-opacity hover:opacity-80"
        aria-label="CLEARBOT — go to home"
      >
        <span
          aria-hidden="true"
          className="flex size-[34px] items-center justify-center rounded-full bg-cb-green"
        >
          <Icon name="zap" />
        </span>
        <span className="font-display text-[22px] font-semibold tracking-[-0.44px] text-cb-primary">
          CLEARBOT
        </span>
      </Link>
    </header>
  );
}
