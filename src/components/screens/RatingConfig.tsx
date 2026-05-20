"use client";

/* ─────────────────────────────────────────────
   CLEARBOT — RatingConfig screen component
   Screen 3: Lets the student pick a global rating
   (0–4). Calls POST /api/assessment/start with all
   stored credentials, then navigates to /running.
   ───────────────────────────────────────────── */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react"; // Fix 3: ChevronDown/ChevronUp removed
import { RatingPills } from "@/components/ui/RatingPills";
import { Button } from "@/components/ui/Button";
import { useSession } from "@/hooks/useSession";
import { useToast } from "@/components/ui/Toast";
import { startAssessment } from "@/lib/api";
// Fix 3: Course type import removed — no hardcoded course list

// Fix 4: 0 label updated to match backend documentation
const RATING_LABELS: Record<number, string> = {
  0: "Not available",
  1: "Poor",
  2: "Average",
  3: "Good",
  4: "Excellent",
};

export function RatingConfig() {
  const router = useRouter();
  const { session, setSession, consumePassword } = useSession();
  const { addToast } = useToast();

  const [defaultRating, setDefaultRating] = useState(3);
  const [isLoading, setIsLoading] = useState(false);
  // Fix 3: perCourseRatings state, advancedOpen state, setCourseRating removed

  async function handleStart() {
    const password = consumePassword();
    if (!password) {
      addToast("Session expired — please go back and log in again.", "error");
      return;
    }
    if (!session.matricNumber || !session.campus) {
      addToast("Session data missing — please start over.", "error");
      router.push("/");
      return;
    }

    setIsLoading(true);
    try {
      // Fix 3: perCourseRatings omitted — bot uses defaultRating for all courses
      const { jobId } = await startAssessment({
        matricNumber: session.matricNumber,
        password,
        campus: session.campus,
        defaultRating,
      });

      setSession({
        defaultRating,
        jobId,
        jobStartedAt: Date.now(),
      });

      router.push("/running");
    } catch {
      addToast("Failed to start the bot — please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="page-enter px-6 pb-24">
      {/* ── Progress indicator ───────────────────── */}
      <div className="pt-6 pb-4">
        <div
          className="w-full h-[4px] rounded-[99px] bg-cb-elevated overflow-hidden mb-2"
        >
          <div
            className="h-full rounded-[99px] bg-cb-green"
            style={{ width: "80%" }}
          />
        </div>
        <p className="font-dm text-[12px] text-cb-secondary">
          Step 2 of 2 — Almost there
        </p>
      </div>

      {/* ── Heading ──────────────────────────────── */}
      <h1
        className="font-clash font-semibold text-cb-primary mt-2"
        style={{ fontSize: "26px" }}
      >
        How should we rate your lecturers?
      </h1>
      {/* Fix 3: removed "customise per course below" — that feature is gone */}
      <p className="font-dm text-[14px] text-cb-secondary mt-2 leading-relaxed">
        This rating applies to all your courses.
      </p>

      {/* ── Rating pills ─────────────────────────── */}
      <div className="mt-6">
        <RatingPills value={defaultRating} onChange={setDefaultRating} />
      </div>

      {/* Dynamic label */}
      <p className="font-dm text-[13px] text-cb-secondary mt-3">
        <span style={{ color: "var(--accent-green)" }}>
          {RATING_LABELS[defaultRating]} ({defaultRating})
        </span>
        {defaultRating === 3 && " — Recommended"}
      </p>

      {/* Fix 3: replaced advanced toggle with a simple note */}
      <p className="font-dm text-[13px] text-cb-muted mt-4 leading-relaxed">
        All courses use the same rating above. Per-course customisation is coming in a future update.
      </p>

      {/* ── Start CTA + security note ─────────────── */}
      <div className="mt-8">
        <Button
          variant="primary"
          fullWidth
          isLoading={isLoading}
          loadingText="Starting bot..."
          onClick={handleStart}
          aria-label="Start assessment"
        >
          Start Assessment →
        </Button>

        <div className="flex items-start gap-2 mt-3">
          <Lock
            size={13}
            aria-hidden="true"
            style={{ color: "var(--text-muted)", marginTop: "1px", flexShrink: 0 }}
          />
          <p className="font-dm text-[12px] text-cb-muted">
            Your portal password is only active during this run.
          </p>
        </div>
      </div>
    </div>
  );
}
