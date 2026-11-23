"use client";

/* ─────────────────────────────────────────────
   CLEARBOT — Button component
   Campus design: pill-shaped primary (accent blue,
   white label, optional trailing arrow icon) and an
   outlined secondary. Handles loading state with
   animated dots. `buttonClasses` is exported so
   links (e.g. "Get Started") can share the styling.
   ───────────────────────────────────────────── */

import { ButtonHTMLAttributes, forwardRef } from "react";
import { Icon } from "@/components/ui/Icon";
import { buttonClasses, type ButtonVariant } from "@/components/ui/buttonStyles";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  isLoading?: boolean;
  loadingText?: string;
  fullWidth?: boolean;
  /** Show the design's trailing arrow icon after the label. */
  withArrow?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      isLoading = false,
      loadingText,
      fullWidth = false,
      withArrow = false,
      children,
      className = "",
      disabled,
      style,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        aria-busy={isLoading}
        className={`${buttonClasses({ variant, fullWidth, disabled: isDisabled })} ${className}`}
        style={style}
        {...props}
      >
        {isLoading ? (
          <span className="inline-flex items-center gap-1">
            <span>{loadingText ?? children}</span>
            <span className="loading-dots" aria-hidden="true" />
          </span>
        ) : (
          <>
            {children}
            {withArrow && <Icon name="arrowRight" />}
          </>
        )}
      </button>
    );
  },
);

Button.displayName = "Button";
