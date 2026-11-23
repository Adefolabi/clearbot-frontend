"use client";

/* ─────────────────────────────────────────────
   CLEARBOT — Input component
   Campus design field: bold 13px label, 56px tall
   input with 14px radius, and (for passwords) a
   44px eye hit-target inside the field. Keeps an
   accessible label, aria-live error and show/hide.
   ───────────────────────────────────────────── */

import { forwardRef, InputHTMLAttributes, useId, useState } from "react";
import { EyeOff, AlertCircle } from "lucide-react";
import { Icon } from "@/components/ui/Icon";

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
      <div className={`flex flex-col gap-2 ${containerClassName}`}>
        <label
          htmlFor={id}
          className="font-body text-[13px] font-bold text-cb-primary"
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
            className={`cb-input ${error ? "error" : ""} ${className}`}
            style={isPassword ? { paddingRight: "3.5rem" } : undefined}
            {...props}
          />

          {isPassword && (
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-1 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff size={20} aria-hidden="true" color="#55557A" strokeWidth={2} />
              ) : (
                <Icon name="eye" />
              )}
            </button>
          )}
        </div>

        {error && (
          <p
            id={errorId}
            role="alert"
            aria-live="polite"
            className="flex items-center gap-1 font-body text-[12px] text-cb-error"
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
