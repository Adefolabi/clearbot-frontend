/* ─────────────────────────────────────────────
   CLEARBOT — shared button class names
   Kept out of Button.tsx (a client component) so server
   components such as the landing page can use them for
   link-styled buttons.
   ───────────────────────────────────────────── */

export type ButtonVariant = "primary" | "secondary";

export function buttonClasses({
  variant = "primary",
  fullWidth = false,
  disabled = false,
}: {
  variant?: ButtonVariant;
  fullWidth?: boolean;
  disabled?: boolean;
} = {}): string {
  const base =
    "relative inline-flex items-center justify-center gap-[10px] font-body font-bold text-[16px] rounded-full h-[56px] px-[30px] select-none transition-all duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";

  const look =
    variant === "primary"
      ? "bg-cb-green text-cb-on-accent hover:brightness-110"
      : "bg-transparent border border-cb-border text-cb-primary hover:bg-cb-elevated";

  const interactive = disabled
    ? "opacity-40 cursor-not-allowed pointer-events-none"
    : variant === "primary"
    ? "cursor-pointer active:scale-[0.99] hover:shadow-[0_8px_24px_rgba(43,68,255,0.3)]"
    : "cursor-pointer active:scale-[0.99]";

  return [base, look, interactive, fullWidth ? "w-full" : ""].filter(Boolean).join(" ");
}
