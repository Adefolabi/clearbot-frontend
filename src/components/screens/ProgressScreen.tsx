"use client";

/* ─────────────────────────────────────────────
   CLEARBOT — ProgressScreen component
   Screen 4: Live SSE-driven bot progress view.
   Shows a pulsing logo, animated progress bar,
   live log feed, and a sticky "keep tab open"
   footer. Auto-navigates to /done or /error
   based on the SSE final event.
   ───────────────────────────────────────────── */

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { LogFeed } from "@/components/ui/LogFeed";
import { StickyFooter } from "@/components/layout/StickyFooter";
import { useSSE } from "@/hooks/useSSE";
import { useSession } from "@/hooks/useSession";

// Fix 7: updated from 18s to observed average across live bot runs
const AVG_TIME_SECONDS = 45;

function formatTime(seconds: number): string {
  if (seconds < 60) return `~${Math.ceil(seconds)}s`;
  const m = Math.floor(seconds / 60);
  const s = Math.ceil(seconds % 60);
  return s > 0 ? `~${m}m ${s}s` : `~${m}m`;
}

export function ProgressScreen() {
  const router = useRouter();
  const { session, setSession } = useSession();
  const jobId = session.jobId;

  const { logs, progress, status, completionSummary, fatalError, isReconnecting, failedCourses } =
    useSSE(jobId);

  const navigatedRef = useRef(false);

  function navigate(path: string) {
    if (navigatedRef.current) return;
    navigatedRef.current = true;
    router.push(path);
  }

  useEffect(() => {
    if (status === "complete" && completionSummary) {
      setSession({
        completionSummary: {
          ...completionSummary,
          timeTaken: session.jobStartedAt
            ? Math.round((Date.now() - session.jobStartedAt) / 1000)
            : undefined,
        },
        failedCourses: failedCourses.length > 0 ? failedCourses : undefined,
      });
      const timer = setTimeout(() => navigate("/done"), 800);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, completionSummary]);

  useEffect(() => {
    if (status === "error" && fatalError) {
      setSession({ errorDetails: fatalError });
      navigate("/error");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, fatalError]);

  useEffect(() => {
    function handleBeforeUnload(e: BeforeUnloadEvent) {
      e.preventDefault();
      e.returnValue = "Are you sure? Your assessment will pause.";
    }
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  const remaining = progress.total - progress.completed - progress.skipped;
  const estimatedSeconds = remaining * AVG_TIME_SECONDS;

  return (
    <div className="page-enter px-6 pb-28">
      {/* ── Header ────────────────────────────────── */}
      <div className="pt-8 pb-6 flex flex-col items-center text-center">
        <div
          className="pulse-logo flex items-center justify-center w-12 h-12 rounded-full mb-4"
          style={{ background: "var(--accent-green-dim)" }}
          aria-hidden="true"
        >
          <span
            className="font-clash font-semibold text-[20px]"
            style={{ color: "var(--accent-green)" }}
          >
            C
          </span>
        </div>

        <h1
          className="font-clash font-semibold text-cb-primary"
          style={{ fontSize: "24px" }}
        >
          Running your assessments...
        </h1>
        <p className="font-dm text-[14px] text-cb-secondary mt-1">
          {isReconnecting
            ? "Reconnecting to server..."
            : "Sit tight — we're handling it."}
        </p>

        {isReconnecting && (
          <p
            className="font-dm text-[12px] mt-1"
            style={{ color: "var(--warning)" }}
          >
            ⟳ Reconnecting...
          </p>
        )}
      </div>

      {/* ── Progress bar ──────────────────────────── */}
      <div className="mb-4">
        <ProgressBar completed={progress.completed} total={progress.total} height={8} />

        <div className="flex justify-between items-baseline mt-2">
          <p className="font-dm text-[13px] text-cb-secondary">
            {progress.total > 0
              ? `${progress.completed} of ${progress.total} courses done`
              : "Discovering your courses..."}
          </p>
          {remaining > 0 && (
            <p className="font-dm text-[12px] text-cb-muted">
              {formatTime(estimatedSeconds)} left
            </p>
          )}
        </div>
      </div>

      {/* ── Live log feed ─────────────────────────── */}
      <LogFeed logs={logs} />

      <StickyFooter />
    </div>
  );
}
