/* ─────────────────────────────────────────────
   CLEARBOT — StepCard
   Numbered "How it works" card from the Campus design:
   soft-blue number badge, Fraunces title, muted body.
   ───────────────────────────────────────────── */

import type { ReactNode } from "react";

interface StepCardProps {
  number: string;
  title: ReactNode;
  body: string;
}

export function StepCard({ number, title, body }: StepCardProps) {
  return (
    <li className="flex w-full items-start gap-4 rounded-card bg-cb-surface p-[22px] drop-shadow-[0_20px_24px_rgba(20,20,59,0.08)]">
      <span
        aria-hidden="true"
        className="flex size-11 shrink-0 items-center justify-center rounded-[22px] bg-cb-green-dim font-display text-[20px] font-semibold text-cb-blue"
      >
        {number}
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-[6px]">
        <h3 className="font-display text-[21px] font-semibold tracking-[-0.21px] text-cb-primary">
          {title}
        </h3>
        <p className="font-body text-[15px] leading-[1.5] text-cb-secondary">{body}</p>
      </div>
    </li>
  );
}
