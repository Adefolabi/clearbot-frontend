"use client";

/* ─────────────────────────────────────────────
   CLEARBOT — ErrorScreen component
   Screen 4c: Shown when the bot hits a fatal error.
   Reassures the student their payment is valid,
   shows which course failed and how many completed,
   and offers a one-click retry (re-calls the start
   assessment API with the same session data).
   ───────────────────────────────────────────── */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useSession } from "@/hooks/useSession";
import { useToast } from "@/components/ui/Toast";
import { startAssessment } from "@/lib/api";

// Fix 8: empty string hides the link until a real number is configured
const WHATSAPP_NUMBER = ""; // set to your real WhatsApp number (e.g. "2348012345678")

export function ErrorScreen() {
  const router = useRouter();
  const { session, setSession, consumePassword } = useSession();
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const errorDetails = session.errorDetails;
  const matricNumber = session.matricNumber ?? "";
  const paymentRef = session.paymentRef ?? "";

  const whatsappText = encodeURIComponent(
    `Hi, my bot run failed. Matric: ${matricNumber}. Payment ref: ${paymentRef}.`,
  );

  async function handleRetry() {
    const password = consumePassword();
    if (!password) {
      addToast(
        "Session expired — please go back to login to get a fresh session.",
        "error",
      );
      return;
    }
    if (!session.matricNumber || !session.campus) {
      addToast("Session data missing — please start over.", "error");
      router.push("/");
      return;
    }

    setIsLoading(true);
    try {
      const { jobId } = await startAssessment({
        matricNumber: session.matricNumber,
        password,
        campus: session.campus,
        defaultRating: session.defaultRating ?? 3,
      });

      setSession({
        jobId,
        jobStartedAt: Date.now(),
        errorDetails: undefined,
      });
      router.push("/running");
    } catch {
      addToast("Retry failed — please contact support.", "error");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="page-enter px-6 pb-12 flex flex-col">
      {/* ── Warning icon ──────────────────────────── */}
      <div className="mt-10 mb-6">
        <AlertTriangle
          size={48}
          aria-hidden="true"
          style={{ color: "var(--warning)" }}
        />
      </div>

      {/* ── Heading ───────────────────────────────── */}
      <h1
        className="font-clash font-semibold text-cb-primary"
        style={{ fontSize: "28px" }}
      >
        Something went wrong
      </h1>
      <p className="font-dm text-[14px] text-cb-secondary mt-3 leading-relaxed">
        Don&apos;t worry — your ₦1,000 payment is still valid. Retry below at no
        extra charge.
      </p>

      {/* ── Error context ─────────────────────────── */}
      {errorDetails && (
        <div
          className="mt-6 rounded-[12px] border border-cb-border bg-cb-surface p-4 flex flex-col gap-2"
        >
          {errorDetails.courseCode && (
            <p className="font-dm text-[13px] text-cb-secondary">
              <span className="text-cb-primary font-medium">Failed at: </span>
              {errorDetails.courseCode}
              {errorDetails.courseName ? ` — ${errorDetails.courseName}` : ""}
            </p>
          )}
          <p className="font-dm text-[13px] text-cb-secondary">
            <span className="text-cb-primary font-medium">Progress: </span>
            {errorDetails.completedBefore} of {errorDetails.totalCourses} courses
            completed before the error
          </p>
          <p
            className="font-dm text-[12px] mt-1 leading-snug"
            style={{ color: "var(--error)" }}
          >
            {errorDetails.message}
          </p>
        </div>
      )}

      {/* ── Retry CTA ─────────────────────────────── */}
      <div className="mt-8 flex flex-col gap-3">
        <Button
          variant="primary"
          fullWidth
          isLoading={isLoading}
          loadingText="Retrying..."
          onClick={handleRetry}
          aria-label="Retry assessment at no extra charge"
        >
          Retry — No Extra Charge →
        </Button>

        {/* Fix 8: only render when a real number is configured */}
        {WHATSAPP_NUMBER && (
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center font-dm text-[14px] text-cb-blue hover:underline min-h-[44px]"
          >
            Contact support on WhatsApp
          </a>
        )}
      </div>
    </div>
  );
}
