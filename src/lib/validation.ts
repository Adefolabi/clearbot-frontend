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

// Fix 12: campus values must match backend VALID_CAMPUSES exactly.
// Abuja was removed: SSHUB no longer offers it and the backend returns 400 for it.
export const VALID_CAMPUSES = [
  "Iwo Campus",
  "Ogbomosho Campus",
] as const;

export type ValidCampus = (typeof VALID_CAMPUSES)[number];

export function isValidCampus(value: string): value is ValidCampus {
  return (VALID_CAMPUSES as readonly string[]).includes(value);
}

/**
 * Drops a stored campus that is no longer valid (e.g. a returning user with
 * "Abuja Campus"). Without a campus, RatingConfig sends them back to the login
 * form to pick a valid one instead of hitting the backend's 400.
 */
export function sanitizeStoredSession<T extends { campus?: string }>(stored: T): T {
  if (stored.campus !== undefined && !isValidCampus(stored.campus)) {
    const { campus: _dropped, ...rest } = stored;
    return rest as T;
  }
  return stored;
}
