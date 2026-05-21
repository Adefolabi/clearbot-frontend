"use client";

/* ─────────────────────────────────────────────
   CLEARBOT — PaymentSummary screen component
   Screen 2: Displays the ₦1,000 order summary,
   opens the Paystack popup, shows a post-payment
   success overlay, then navigates to /configure.
   ───────────────────────────────────────────── */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Shield } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useSession } from "@/hooks/useSession";
import { usePaystack } from "@/hooks/usePaystack";
import { useToast } from "@/components/ui/Toast";
import { checkPaymentStatus } from "@/lib/api";

export function PaymentSummary() {
  const router = useRouter();
  const { session, setSession } = useSession();
  const { initializePayment, isLoading: paystackLoading } = usePaystack();
  const { addToast } = useToast();

  const [showOverlay, setShowOverlay] = useState(false);

  async function handlePay() {
    const reference = session.paymentRef;
    const email     = session.paymentEmail ?? `${(session.matricNumber ?? "student").toLowerCase()}@clearbot.ng`;
    const amount    = session.paymentAmount ?? 100000;

    if (!reference) {
      addToast("Session expired — please go back and try again.", "error");
      router.push("/");
      return;
    }

    initializePayment({
      email,
      amount,
      reference,
      async onSuccess(transaction) {
        // Verify server-side before proceeding.
        try {
          const status = await checkPaymentStatus(transaction.reference);
          if (!status.paid) {
            addToast("Payment not confirmed yet — please wait a moment and try again.", "warning");
            return;
          }
        } catch {
          // Verification call failed (network issue). The webhook will mark it paid.
          // Proceed optimistically — assessment/start will reject if not paid.
        }

        setSession({ paymentRef: transaction.reference });
        setShowOverlay(true);
        setTimeout(() => router.push("/configure"), 1500);
      },
      onClose() {
        addToast("Payment cancelled — click Pay to try again.", "warning");
      },
    });
  }

  return (
    <>
      <div className="page-enter px-0 pb-8">
        {/* ── Back link ──────────────────────────── */}
        <div className="px-6 pt-4 pb-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="font-dm text-[14px] text-cb-blue hover:underline min-h-[44px] flex items-center"
            aria-label="Go back to login"
          >
            ← Back to login
          </button>
        </div>

        {/* ── Order summary card ─────────────────── */}
        <div
          className="mx-4 rounded-[16px] border border-cb-border bg-cb-surface p-6"
          style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.4)" }}
        >
          {/* Product line */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-clash font-semibold text-[16px] text-cb-primary leading-tight">
                CLEARBOT Assessment Bot
              </h2>
              <p className="font-dm text-[13px] text-cb-secondary mt-1">
                1× automated run — 2025/2026 2nd Semester
              </p>
            </div>
            <span
              className="font-clash font-semibold text-[24px] shrink-0"
              style={{ color: "var(--accent-green)" }}
            >
              ₦1,000
            </span>
          </div>

          {/* Divider + line items */}
          <div className="border-t border-cb-border mt-4 pt-4 flex flex-col gap-2">
            {[
              { label: "Subtotal", value: "₦1,000" },
              { label: "Paystack fee", value: "~₦15" },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between">
                <span className="font-dm text-[13px] text-cb-secondary">{label}</span>
                <span className="font-dm text-[13px] text-cb-secondary">{value}</span>
              </div>
            ))}
            <div className="flex justify-between mt-1">
              <span className="font-dm font-semibold text-[15px] text-cb-primary">Total</span>
              <span className="font-dm font-semibold text-[15px] text-cb-primary">₦1,000</span>
            </div>
          </div>

          {/* Value props */}
          <ul className="mt-4 flex flex-col gap-2">
            {[
              "One-time charge — no subscription",
              "Valid for this full semester",
              "Free retry if the bot fails",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <Check
                  size={14}
                  aria-hidden="true"
                  style={{ color: "var(--accent-green)", flexShrink: 0 }}
                />
                <span className="font-dm text-[13px] text-cb-secondary">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Pay button ─────────────────────────── */}
        <div className="px-4 mt-4">
          <Button
            variant="primary"
            fullWidth
            isLoading={paystackLoading}
            loadingText="Opening payment..."
            onClick={handlePay}
            aria-label="Pay ₦1,000 with Paystack"
          >
            Pay ₦1,000 with Paystack →
          </Button>
        </div>

        {/* ── Trust footer ───────────────────────── */}
        <div className="mt-6 flex flex-col items-center gap-1 px-6">
          <div className="flex items-center gap-2">
            <Shield size={14} aria-hidden="true" style={{ color: "var(--text-muted)" }} />
            <p className="font-dm text-[12px] text-cb-muted">
              Payments secured by Paystack
            </p>
          </div>
          <p className="font-dm text-[12px] text-cb-muted">
            We never see your card details
          </p>
        </div>
      </div>

      {/* ── Post-payment success overlay ──────────── */}
      {showOverlay && (
        <div className="overlay" role="status" aria-live="polite">
          <div className="flex flex-col items-center gap-4 px-8 text-center">
            {/* Animated checkmark */}
            <svg
              width="72"
              height="72"
              viewBox="0 0 72 72"
              fill="none"
              aria-hidden="true"
            >
              <circle
                cx="36"
                cy="36"
                r="33"
                stroke="var(--accent-green)"
                strokeWidth="3"
                className="circle-path"
              />
              <path
                d="M22 36 L32 46 L50 28"
                stroke="var(--accent-green)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="check-path"
              />
            </svg>

            <p
              className="font-clash font-semibold text-[22px] text-cb-primary"
            >
              Payment confirmed!
            </p>
            <p className="font-dm text-[14px] text-cb-secondary">
              Setting up your bot...
            </p>
          </div>
        </div>
      )}
    </>
  );
}
