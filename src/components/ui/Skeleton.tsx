"use client";

/* ─────────────────────────────────────────────
   CLEARBOT — Skeleton component
   A single configurable shimmer block used as a
   loading placeholder. Compose multiple instances
   to build skeleton screens for any layout.
   ───────────────────────────────────────────── */

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  borderRadius?: string;
}

export function Skeleton({
  width = "100%",
  height = "16px",
  className = "",
  borderRadius = "6px",
}: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={`skeleton ${className}`}
      style={{
        width,
        height,
        borderRadius,
        flexShrink: 0,
      }}
    />
  );
}
