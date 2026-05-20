/* ─────────────────────────────────────────────
   CLEARBOT — Input validation helpers
   ───────────────────────────────────────────── */

/** Matches Bowen matric format: 2 letters, 2 digits, 3 letters, 4 digits. e.g. BU22CSC1081 */
const MATRIC_REGEX = /^[A-Za-z]{2}\d{2}[A-Za-z]{3}\d{4}$/;

export function isValidMatric(value: string): boolean {
  return MATRIC_REGEX.test(value.trim());
}

export function normalizeMatric(value: string): string {
  return value.trim().toUpperCase();
}

// Fix 12: campus values must match backend VALID_CAMPUSES exactly
export const VALID_CAMPUSES = [
  "Iwo Campus",
  "Ogbomosho Campus",
  "Abuja Campus",
] as const;

export type ValidCampus = (typeof VALID_CAMPUSES)[number];

export function isValidCampus(value: string): value is ValidCampus {
  return (VALID_CAMPUSES as readonly string[]).includes(value);
}
