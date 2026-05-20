"use client";

/* ─────────────────────────────────────────────
   CLEARBOT — Select component
   A styled native <select> with a floating
   chevron icon. Uses the same height and border
   treatment as Input for visual consistency.
   ───────────────────────────────────────────── */

import { forwardRef, SelectHTMLAttributes, useId } from "react";
import { ChevronDown } from "lucide-react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: SelectOption[];
  error?: string;
  containerClassName?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      options,
      error,
      containerClassName = "",
      className = "",
      id: propId,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const id = propId ?? generatedId;

    return (
      <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
        <label
          htmlFor={id}
          className="font-dm text-[12px] uppercase tracking-[0.5px] text-cb-secondary"
        >
          {label}
        </label>

        <div className="relative">
          <select
            ref={ref}
            id={id}
            aria-invalid={!!error}
            className={`cb-input pr-10 text-cb-primary appearance-none ${
              error ? "error" : ""
            } ${className}`}
            style={{ paddingRight: "2.5rem" }}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <ChevronDown
            size={16}
            aria-hidden="true"
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-cb-secondary"
          />
        </div>

        {error && (
          <p
            role="alert"
            aria-live="polite"
            className="font-dm text-[12px] text-cb-error"
          >
            {error}
          </p>
        )}
      </div>
    );
  },
);

Select.displayName = "Select";
