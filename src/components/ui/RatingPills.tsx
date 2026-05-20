"use client";

/* ─────────────────────────────────────────────
   CLEARBOT — RatingPills component
   Five pill buttons (0–4) laid out in a flex row.
   The selected pill gets a green border and tint.
   Used on both the configure screen (large) and
   the per-course advanced rows (compact).
   ───────────────────────────────────────────── */

interface RatingPillsProps {
  value: number;
  onChange: (rating: number) => void;
  compact?: boolean;
}

const LABELS: Record<number, string> = {
  0: "N/A",
  1: "Poor",
  2: "Avg",
  3: "Good",
  4: "Exc",
};

export function RatingPills({
  value,
  onChange,
  compact = false,
}: RatingPillsProps) {
  return (
    <div
      role="radiogroup"
      aria-label="Select rating"
      className="flex gap-2 w-full"
    >
      {([0, 1, 2, 3, 4] as const).map((rating) => {
        const isSelected = value === rating;
        return (
          <button
            key={rating}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onChange(rating)}
            className={[
              "flex-1 flex flex-col items-center justify-center rounded-[10px] border transition-all duration-150 cursor-pointer focus-visible:outline focus-visible:outline-2",
              compact ? "h-9 gap-0" : "h-[52px] gap-0.5",
              isSelected
                ? "border-cb-green bg-cb-green-dim"
                : "border-cb-border bg-cb-elevated hover:border-cb-secondary",
            ].join(" ")}
          >
            <span
              className={[
                "font-clash font-semibold leading-none",
                compact ? "text-sm" : "text-[18px]",
                isSelected ? "text-cb-green" : "text-cb-primary",
              ].join(" ")}
            >
              {rating}
            </span>
            {!compact && (
              <span className="font-dm text-[10px] text-cb-muted leading-none">
                {LABELS[rating]}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
