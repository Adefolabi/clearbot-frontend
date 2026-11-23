"use client";

/* ─────────────────────────────────────────────
   CLEARBOT — Select component
   A styled native <select> matching the Campus
   field design, with the design's chevron icon in a
   44px slot at the right edge.
   ───────────────────────────────────────────── */

import { forwardRef, SelectHTMLAttributes, useId } from "react";
import { Icon } from "@/components/ui/Icon";

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
      <div className={`flex flex-col gap-2 ${containerClassName}`}>
        <label
          htmlFor={id}
          className="font-body text-[13px] font-bold text-cb-primary"
        >
          {label}
        </label>

        <div className="relative">
          <select
            ref={ref}
            id={id}
            aria-invalid={!!error}
            className={`cb-input text-cb-primary appearance-none ${
              error ? "error" : ""
            } ${className}`}
            style={{ paddingRight: "3.5rem" }}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <span
            aria-hidden="true"
            className="pointer-events-none absolute right-1 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center"
          >
            <Icon name="chevronDown" />
          </span>
        </div>

        {error && (
          <p
            role="alert"
            aria-live="polite"
            className="font-body text-[12px] text-cb-error"
          >
            {error}
          </p>
        )}
      </div>
    );
  },
);

Select.displayName = "Select";
