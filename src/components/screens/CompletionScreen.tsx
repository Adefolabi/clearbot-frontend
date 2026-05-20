"use client";

/* ─────────────────────────────────────────────
   CLEARBOT — CompletionScreen component
   Screen 4b: The celebration payoff screen.
   Heading and subtitle adapt when some courses
   failed. A named warning card lists every
   course code the bot couldn't submit so the
   student knows exactly what to handle manually.
   ───────────────────────────────────────────── */

import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { useSession } from "@/hooks/useSession";

const BOWEN_PORTAL = "https://bowenstudent.bowen.edu.ng/v2/dashboard2.php";

/* 8 particles at equal angular intervals */
const PARTICLES = Array.from({ length: 8 }, (_, i) => {
  const angle = (i / 8) * 2 * Math.PI;
  const dist = 60;
  return {
    tx: `${Math.cos(angle) * dist}px`,
    ty: `${Math.sin(angle) * dist}px`,
    delay: `${800 + i * 30}ms`,
  };
});

function formatTimeTaken(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

export function CompletionScreen() {
  const { session } = useSession();
  const { addToast } = useToast();
  const summary = session.completionSummary;
  const failedCourses = session.failedCourses ?? [];
  const hasFailed = failedCourses.length > 0;

  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowContent(true), 1000);
    return () => clearTimeout(t);
  }, []);

  async function handleSaveLink() {
    try {
      await navigator.clipboard.writeText(window.location.origin);
      addToast("Link copied to clipboard!", "success");
    } catch {
      addToast("Could not copy — please copy the URL manually.", "warning");
    }
  }

  return (
    <div className="page-enter px-6 pb-12 flex flex-col items-center text-center">
      {/* ── Animated checkmark ───────────────────── */}
      <div className="relative mt-12 mb-6 flex items-center justify-center">
        {PARTICLES.map((p, i) => (
          <div
            key={i}
            className="particle"
            style={{
              ["--tx" as string]: p.tx,
              ["--ty" as string]: p.ty,
              animationDelay: p.delay,
            }}
          />
        ))}

        <svg
          width="96"
          height="96"
          viewBox="0 0 96 96"
          fill="none"
          aria-hidden="true"
        >
          <circle
            cx="48"
            cy="48"
            r="44"
            stroke="var(--accent-green)"
            strokeWidth="3"
            className="circle-path"
          />
          <path
            d="M30 48 L43 61 L66 36"
            stroke="var(--accent-green)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="check-path"
          />
        </svg>
      </div>

      {/* ── Heading — adapts when some courses failed ── */}
      <div
        className={showContent ? "animate-fadeUp" : "opacity-0"}
        style={{ animationDelay: "200ms" }}
      >
        <h1
          className="font-clash font-semibold text-cb-primary"
          style={{ fontSize: "40px", lineHeight: 1.1 }}
        >
          {hasFailed ? "Almost done!" : "All done!"}
        </h1>
        <p className="font-dm text-[15px] text-cb-secondary mt-2">
          {hasFailed
            ? `${summary?.completed ?? 0} courses assessed. ${failedCourses.length} couldn't be submitted — see below.`
            : "All lecturer assessments completed. You can now apply for clearance on SSHUB."}
        </p>
      </div>

      {/* ── Stats pills ───────────────────────────── */}
      {summary && showContent && (
        <div
          className="flex gap-3 mt-6 w-full animate-fadeUp"
          style={{ animationDelay: "350ms" }}
        >
          <StatPill
            value={String(summary.completed)}
            label="assessed"
            color="var(--accent-green)"
          />
          {summary.skipped > 0 && (
            <StatPill
              value={String(summary.skipped)}
              label="skipped"
              color="var(--text-muted)"
            />
          )}
          {summary.failed > 0 && (
            <StatPill
              value={String(summary.failed)}
              label="failed"
              color="var(--error)"
            />
          )}
          {summary.timeTaken !== undefined && (
            <StatPill
              value={formatTimeTaken(summary.timeTaken)}
              label="total time"
              color="var(--accent-blue)"
            />
          )}
        </div>
      )}

      {/* ── Failed courses warning card ───────────── */}
      {hasFailed && showContent && (
        <div
          className="w-full mt-5 rounded-[12px] border bg-cb-surface p-4 text-left animate-fadeUp"
          style={{
            borderColor: "var(--warning)",
            borderLeftWidth: "4px",
            animationDelay: "450ms",
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle
              size={15}
              aria-hidden="true"
              style={{ color: "var(--warning)", flexShrink: 0 }}
            />
            <p className="font-dm font-medium text-[13px] text-cb-primary">
              These courses need manual assessment:
            </p>
          </div>

          <ul className="flex flex-col gap-1.5">
            {failedCourses.map((code) => (
              <li key={code} className="flex items-center gap-2">
                <span
                  className="font-dm font-medium text-[13px]"
                  style={{ color: "var(--warning)" }}
                >
                  ✕
                </span>
                <span className="font-dm text-[13px] text-cb-primary">
                  {code}
                </span>
              </li>
            ))}
          </ul>

          <p className="font-dm text-[12px] text-cb-muted mt-3 leading-relaxed">
            Log in to SSHUB and assess these lecturers manually before applying for clearance.
          </p>
        </div>
      )}

      {/* ── CTAs ─────────────────────────────────── */}
      <div
        className={`flex flex-col gap-3 w-full mt-8 ${showContent ? "animate-fadeUp" : "opacity-0"}`}
        style={{ animationDelay: "550ms" }}
      >
        <Button
          variant="primary"
          fullWidth
          onClick={() => window.open(BOWEN_PORTAL, "_blank", "noopener,noreferrer")}
          aria-label="Open Bowen student portal dashboard"
        >
          {hasFailed ? "Go to SSHUB →" : "Print My Clearance →"}
        </Button>

        <Button
          variant="secondary"
          fullWidth
          onClick={handleSaveLink}
          aria-label="Save CLEARBOT link for next semester"
        >
          Save this link for next semester
        </Button>
      </div>
    </div>
  );
}

/* ─── Helper: stat pill ──────────────────────── */

function StatPill({
  value,
  label,
  color,
}: {
  value: string;
  label: string;
  color: string;
}) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center rounded-[10px] border border-cb-border bg-cb-surface px-3 py-3">
      <span
        className="font-clash font-semibold text-[20px] leading-none"
        style={{ color }}
      >
        {value}
      </span>
      <span className="font-dm text-[11px] text-cb-muted mt-1 leading-none">
        {label}
      </span>
    </div>
  );
}
