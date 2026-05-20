"use client";

/* ─────────────────────────────────────────────
   CLEARBOT — Button component
   Two variants: primary (green filled) and
   secondary (outlined). Handles loading state
   with animated dots and green hover glow.
   ───────────────────────────────────────────── */

import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  isLoading?: boolean;
  loadingText?: string;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      isLoading = false,
      loadingText,
      fullWidth = false,
      children,
      className = "",
      disabled,
      style,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || isLoading;

    const base =
      "relative inline-flex items-center justify-center font-dm font-semibold text-[15px] rounded-[12px] h-[52px] px-6 select-none transition-all duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";

    const primary =
      "bg-cb-green text-[var(--bg-base)] hover:brightness-105";
    const secondary =
      "bg-transparent border border-cb-border text-cb-primary hover:bg-cb-elevated";

    const interactive = isDisabled
      ? "opacity-40 cursor-not-allowed pointer-events-none"
      : variant === "primary"
      ? "cursor-pointer hover:scale-[1.02] active:scale-[0.99] hover:shadow-[0_0_20px_rgba(0,230,118,0.3)]"
      : "cursor-pointer hover:scale-[1.02] active:scale-[0.99]";

    const width = fullWidth ? "w-full" : "";

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        aria-busy={isLoading}
        className={`${base} ${variant === "primary" ? primary : secondary} ${interactive} ${width} ${className}`}
        style={style}
        {...props}
      >
        {isLoading ? (
          <span className="inline-flex items-center gap-1">
            <span>{loadingText ?? children}</span>
            <span className="loading-dots" aria-hidden="true" />
          </span>
        ) : (
          children
        )}
      </button>
    );
  },
);

Button.displayName = "Button";
