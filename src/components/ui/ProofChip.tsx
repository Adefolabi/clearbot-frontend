/* ─────────────────────────────────────────────
   CLEARBOT — ProofChip
   "Trusted by 300+ Bowen students" pill with five
   blue stars, from the Campus design components.
   Full width on mobile, hugs its content on desktop.
   ───────────────────────────────────────────── */

import { Icon } from "@/components/ui/Icon";

export function ProofChip({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex w-full items-center gap-[10px] rounded-full border border-cb-border bg-cb-surface py-2 pl-[14px] pr-4 lg:w-fit ${className}`}
    >
      <div className="flex gap-[2px]" aria-label="5 stars" role="img">
        {Array.from({ length: 5 }).map((_, i) => (
          <Icon key={i} name="star" />
        ))}
      </div>
      <p className="flex-1 font-body text-[13px] font-bold text-cb-primary lg:flex-none lg:whitespace-nowrap">
        Trusted by 300+ Bowen students this semester
      </p>
    </div>
  );
}
