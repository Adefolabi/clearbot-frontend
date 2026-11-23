/* ─────────────────────────────────────────────
   CLEARBOT — Icon component
   Renders the exact SVG icons exported from the Figma
   "Campus" design (public/icons/*.svg). Each SVG carries
   its own colour, so there is no colour prop; sizes are
   the icons' native width/height from the design.
   ───────────────────────────────────────────── */

import Image from "next/image";

const ICONS = {
  zap:                { src: "/icons/zap.svg",                    size: 18 },
  star:               { src: "/icons/star.svg",                   size: 14 },
  check:              { src: "/icons/check.svg",                  size: 14 },
  eye:                { src: "/icons/eye.svg",                    size: 20 },
  chevronDown:        { src: "/icons/chevron-down.svg",           size: 20 },
  arrowLeft:          { src: "/icons/arrow-left.svg",             size: 18 },
  arrowLeftOnAccent:  { src: "/icons/arrow-left-on-accent.svg",   size: 18 },
  arrowRight:         { src: "/icons/arrow-right.svg",            size: 18 },
  lock:               { src: "/icons/lock.svg",                   size: 18 },
  shield:             { src: "/icons/shield.svg",                 size: 16 },
} as const;

export type IconName = keyof typeof ICONS;

interface IconProps {
  name: IconName;
  className?: string;
}

export function Icon({ name, className = "" }: IconProps) {
  const { src, size } = ICONS[name];
  return (
    <Image
      src={src}
      alt=""
      width={size}
      height={size}
      aria-hidden="true"
      className={`shrink-0 ${className}`}
    />
  );
}
