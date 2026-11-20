/* ─────────────────────────────────────────────
   CLEARBOT — Log notice helpers
   Pure helpers for interpreting SSE log events.
   Notices are detected via the machine-readable
   `notice` field, never by matching message text.
   ───────────────────────────────────────────── */

import type { LogEntry, LogStatus } from "@/types";

export const NOTICE_LECTURER_NOT_ASSIGNED = "lecturer_not_assigned";

/** Only the "failed" status counts as a failure. Info notices and skips never do. */
export function isFailedLog(status: LogStatus | undefined): boolean {
  return status === "failed";
}

/** Friendly, non-error text for an informational notice, or null if the entry has none. */
export function getNoticeText(
  entry: Pick<LogEntry, "notice" | "courseCode">,
): string | null {
  if (entry.notice === NOTICE_LECTURER_NOT_ASSIGNED) {
    const course = entry.courseCode ?? "This course";
    return (
      `${course}: no lecturer is assigned on the school portal, so only Teaching ` +
      `Environment was assessed. Nothing is wrong, and you can run again later if a ` +
      `lecturer is added.`
    );
  }
  return null;
}
