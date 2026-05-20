"use client";

/* ─────────────────────────────────────────────
   CLEARBOT — Server-Sent Events hook
   Connects to the backend progress stream, parses
   every event type, and handles reconnection with
   exponential backoff (max 3 retries, 3 s delay).
   ───────────────────────────────────────────── */

import { useCallback, useEffect, useRef, useState } from "react";
import { getProgressUrl } from "@/lib/api";
import type {
  CompletionSummary,
  ErrorDetails,
  LogEntry,
  LogStatus,
  ProgressState,
} from "@/types";

export type SSEStatus =
  | "idle"
  | "connecting"
  | "connected"
  | "reconnecting"
  | "complete"
  | "error"
  | "disconnected";

export interface SSEHookResult {
  logs: LogEntry[];
  progress: ProgressState;
  status: SSEStatus;
  isConnected: boolean;
  isReconnecting: boolean;
  completionSummary: CompletionSummary | null;
  fatalError: ErrorDetails | null;
  /** Course codes that received a "failed" log status during this run. */
  failedCourses: string[];
}

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 3000;

let idSeq = 0;
const nextId = () => `log-${++idSeq}`;

/* Raw shape of each SSE JSON payload */
interface RawSSEPayload {
  type: string;
  message?: string;
  courseCode?: string;
  status?: LogStatus;
  completed?: number;
  total?: number;
  skipped?: number;
  summary?: CompletionSummary;
  fatal?: boolean;
}

export function useSSE(jobId: string | undefined): SSEHookResult {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [progress, setProgress] = useState<ProgressState>({
    completed: 0,
    total: 0,
    skipped: 0,
  });
  const [sseStatus, setSseStatus] = useState<SSEStatus>("idle");
  const [completionSummary, setCompletionSummary] =
    useState<CompletionSummary | null>(null);
  const [fatalError, setFatalError] = useState<ErrorDetails | null>(null);
  const [failedCourses, setFailedCourses] = useState<string[]>([]);

  const esRef = useRef<EventSource | null>(null);
  const retriesRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastCourseRef = useRef<{ code?: string; name?: string }>({});

  // Fix 10: ref always holds current progress so stale closures in onerror read fresh values
  const progressRef = useRef<ProgressState>({ completed: 0, total: 0, skipped: 0 });
  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  const addLog = useCallback((entry: Omit<LogEntry, "id" | "timestamp">) => {
    setLogs((prev) => [
      ...prev,
      { ...entry, id: nextId(), timestamp: Date.now() },
    ]);
  }, []);

  // Fix 10: progress.completed and progress.total removed from deps — read via progressRef instead
  const connect = useCallback(() => {
    if (!jobId) return;

    esRef.current?.close();
    setSseStatus(retriesRef.current === 0 ? "connecting" : "reconnecting");

    const es = new EventSource(getProgressUrl(jobId));
    esRef.current = es;

    es.onopen = () => {
      setSseStatus("connected");
      retriesRef.current = 0;
    };

    es.onmessage = (event: MessageEvent<string>) => {
      let data: RawSSEPayload;
      try {
        data = JSON.parse(event.data) as RawSSEPayload;
      } catch {
        return;
      }

      switch (data.type) {
        case "log": {
          if (data.courseCode) {
            lastCourseRef.current = { code: data.courseCode };
          }
          // Track every course that the bot couldn't submit
          if (data.status === "failed" && data.courseCode) {
            setFailedCourses((prev) =>
              prev.includes(data.courseCode!) ? prev : [...prev, data.courseCode!],
            );
          }
          addLog({
            type: "log",
            message: data.message ?? "",
            courseCode: data.courseCode,
            status: data.status,
          });
          break;
        }
        case "progress": {
          setProgress({
            completed: data.completed ?? 0,
            total: data.total ?? 0,
            skipped: data.skipped ?? 0,
          });
          break;
        }
        case "complete": {
          setSseStatus("complete");
          setCompletionSummary(
            data.summary ?? { completed: 0, skipped: 0, failed: 0 },
          );
          es.close();
          break;
        }
        case "error": {
          if (data.fatal) {
            setSseStatus("error");
            setFatalError({
              message: data.message ?? "An unexpected error occurred.",
              courseCode: lastCourseRef.current.code,
              // Fix 10: read from ref — never stale even after reconnects
              completedBefore: progressRef.current.completed,
              totalCourses: progressRef.current.total,
            });
            es.close();
          } else {
            addLog({
              type: "error",
              message: data.message ?? "Error",
              status: "error",
            });
          }
          break;
        }
      }
    };

    es.onerror = () => {
      es.close();
      if (retriesRef.current < MAX_RETRIES) {
        retriesRef.current += 1;
        setSseStatus("reconnecting");
        timerRef.current = setTimeout(connect, RETRY_DELAY_MS);
      } else {
        setSseStatus("error");
        setFatalError({
          message: "Lost connection to the server after multiple retries.",
          // Fix 10: read from ref — always current at the time onerror fires
          completedBefore: progressRef.current.completed,
          totalCourses: progressRef.current.total,
        });
      }
    };
  }, [jobId, addLog]); // Fix 10: progress removed from deps

  useEffect(() => {
    connect();
    return () => {
      esRef.current?.close();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId]);

  return {
    logs,
    progress,
    status: sseStatus,
    isConnected: sseStatus === "connected",
    isReconnecting: sseStatus === "reconnecting",
    completionSummary,
    fatalError,
    failedCourses,
  };
}
