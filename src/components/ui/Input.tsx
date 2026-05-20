"use client";

/* ─────────────────────────────────────────────
   CLEARBOT — Input component
   Handles text and password inputs with an
   accessible label, error message (aria-live),
   and a show/hide toggle for password fields.
   ───────────────────────────────────────────── */

import { forwardRef, InputHTMLAttributes, useId, useState } from "react";
import { Eye, EyeOff, AlertCircle } from "lucide-react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  containerClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      containerClassName = "",
      type = "text",
      className = "",
      id: propId,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const id = propId ?? generatedId;
    const errorId = `${id}-error`;

    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const resolvedType = isPassword && showPassword ? "text" : type;

    return (
      <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
        <label
          htmlFor={id}
          className="font-dm text-[12px] uppercase tracking-[0.5px] text-cb-secondary"
        >
          {label}
        </label>

        <div className="relative">
          <input
            ref={ref}
            id={id}
            type={resolvedType}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : undefined}
            className={`cb-input pr-${isPassword ? "12" : "4"} ${error ? "error" : ""} ${className}`}
            style={
              isPassword
                ? { paddingRight: "3rem" }
                : undefined
            }
            {...props}
          />

          {isPassword && (
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-cb-secondary hover:text-cb-primary transition-colors"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff size={20} aria-hidden="true" />
              ) : (
                <Eye size={20} aria-hidden="true" />
              )}
            </button>
          )}
        </div>

        {error && (
          <p
            id={errorId}
            role="alert"
            aria-live="polite"
            className="flex items-center gap-1 font-dm text-[12px] text-cb-error"
          >
            <AlertCircle size={12} aria-hidden="true" />
            {error}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
