"use client";

/* ─────────────────────────────────────────────
   CLEARBOT — ProgressBar component
   Renders the thick animated progress bar on the
   running screen. The green fill has a shimmer
   gloss overlay and transitions smoothly via CSS.
   ───────────────────────────────────────────── */

interface ProgressBarProps {
  completed: number;
  total: number;
  height?: number;
}

export function ProgressBar({
  completed,
  total,
  height = 8,
}: ProgressBarProps) {
  const pct = total > 0 ? Math.min((completed / total) * 100, 100) : 0;

  return (
    <div
      role="progressbar"
      aria-valuenow={completed}
      aria-valuemin={0}
      aria-valuemax={total}
      aria-label={`${completed} of ${total} courses completed`}
      className="w-full rounded-[99px] bg-cb-elevated overflow-hidden"
      style={{ height }}
    >
      <div
        className="progress-fill h-full"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
