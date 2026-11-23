"use client";

/* ─────────────────────────────────────────────
   CLEARBOT — PaymentSummary screen component
   Campus design "3 Pay": displays the ₦1,000 order
   summary, opens the Paystack popup, shows a
   post-payment success overlay, then navigates to
   /configure. Single column, 520px max on desktop.
   ───────────────────────────────────────────── */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { useSession } from "@/hooks/useSession";
import { usePaystack } from "@/hooks/usePaystack";
import { useToast } from "@/components/ui/Toast";
import { checkPaymentStatus } from "@/lib/api";

const PROMISES = [
  "One-time charge — no subscription",
  "Valid for this full semester",
  "Free retry if the bot fails",
];

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
      router.push("/login");
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
      <div className="page-enter mx-auto flex w-full max-w-[520px] flex-col gap-5 px-6 pb-10 pt-5 lg:px-0 lg:pb-24 lg:pt-16">
        {/* ── Back link ──────────────────────────── */}
        <button
          type="button"
          onClick={() => router.back()}
          className="flex min-h-11 w-fit items-center gap-2 font-body text-[15px] font-bold text-cb-secondary"
          aria-label="Go back to login"
        >
          <Icon name="arrowLeft" />
          Back to login
        </button>

        {/* ── Order summary card ─────────────────── */}
        <div className="flex flex-col gap-5 rounded-card bg-cb-surface px-[26px] py-[30px] shadow-card">
          {/* Product line */}
          <div className="flex items-start gap-4">
            <div className="flex min-w-0 flex-1 flex-col gap-[6px]">
              <h2 className="font-display text-[21px] font-semibold tracking-[-0.21px] text-cb-primary">
                CLEARBOT Assessment Bot
              </h2>
              <p className="font-body text-[14px] leading-[1.45] text-cb-secondary">
                1× automated run — 2025/2026 2nd Semester
              </p>
            </div>
            <p className="shrink-0 font-display text-[32px] font-semibold tracking-[-0.64px] text-cb-blue">
              <span className="font-body font-bold">₦</span>1,000
            </p>
          </div>

          <div className="h-px w-full bg-cb-border" />

          {/* Line items */}
          <div className="flex justify-between font-body text-[15px] text-cb-secondary">
            <span>Subtotal</span>
            <span>₦1,000</span>
          </div>
          <div className="flex justify-between font-body text-[15px] text-cb-secondary">
            <span>Paystack fee</span>
            <span>Included</span>
          </div>
          <div className="flex justify-between font-body text-[17px] font-bold text-cb-primary">
            <span>Total</span>
            <span>₦1,000</span>
          </div>

          <div className="h-px w-full bg-cb-border" />

          {/* Value props */}
          <ul className="flex flex-col gap-3">
            {PROMISES.map((item) => (
              <li key={item} className="flex items-center gap-[10px]">
                <span
                  aria-hidden="true"
                  className="flex size-6 shrink-0 items-center justify-center rounded-[12px] bg-cb-green-dim"
                >
                  <Icon name="check" />
                </span>
                <span className="font-body text-[15px] text-cb-primary">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Pay button ─────────────────────────── */}
        <Button
          variant="primary"
          fullWidth
          withArrow
          isLoading={paystackLoading}
          loadingText="Opening payment..."
          onClick={handlePay}
          aria-label="Pay ₦1,000 with Paystack"
        >
          Pay ₦1,000 with Paystack
        </Button>

        {/* ── Trust footer ───────────────────────── */}
        <div className="flex flex-col items-center gap-[6px] font-body text-[14px] text-cb-secondary">
          <div className="flex items-center gap-2">
            <Icon name="shield" />
            <p>Payments secured by Paystack</p>
          </div>
          <p>We never see your card details</p>
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

            <p className="font-display font-semibold text-[22px] text-cb-primary">
              Payment confirmed!
            </p>
            <p className="font-body text-[14px] text-cb-secondary">
              Setting up your bot...
            </p>
          </div>
        </div>
      )}
    </>
  );
}
