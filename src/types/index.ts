/* ─────────────────────────────────────────────
   CLEARBOT — Shared TypeScript Types
   ───────────────────────────────────────────── */

/** Core session data carried across all screens (no password). */
export interface SessionState {
  matricNumber: string;
  campus: string;
  defaultRating: number;
  perCourseRatings: Record<string, number>;
  paymentRef: string;
  paymentEmail: string;
  paymentAmount: number;
  jobId: string;
  courses: CourseStatus[];
  completionSummary?: CompletionSummary;
  errorDetails?: ErrorDetails;
  jobStartedAt?: number;
  /** Course codes that the bot could not assess, accumulated from SSE "failed" log events. */
  failedCourses?: string[];
}

/** Status of an individual course during a bot run. */
export interface CourseStatus {
  code: string;
  name: string;
  status: "waiting" | "running" | "complete" | "skipped" | "error";
}

/** Visual status labels carried in SSE log events. */
export type LogStatus =
  | "info"
  | "success"
  | "skipped"
  | "running"
  | "complete"
  | "error"
  | "failed"; // backend emits this when a course submission errors out

/** A single entry in the live log feed. */
export interface LogEntry {
  id: string;
  type: "log" | "progress" | "complete" | "error";
  message: string;
  courseCode?: string;
  status?: LogStatus;
  timestamp: number;
}

/** Aggregated progress counts from SSE progress events. */
export interface ProgressState {
  completed: number;
  total: number;
  skipped: number;
}

/** Summary delivered in the SSE complete event. */
export interface CompletionSummary {
  completed: number;
  skipped: number;
  failed: number;
  timeTaken?: number;
}

/** Error context carried to /error screen. */
export interface ErrorDetails {
  message: string;
  courseCode?: string;
  courseName?: string;
  completedBefore: number;
  totalCourses: number;
}

/** A toast notification item. */
export interface ToastItem {
  id: string;
  message: string;
  type: "success" | "error" | "warning";
  exiting?: boolean;
}

/** A selectable course for per-course rating in the configure screen. */
export interface Course {
  code: string;
  name: string;
  semester: 1 | 2;
}
