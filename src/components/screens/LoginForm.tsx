"use client";

/* ─────────────────────────────────────────────
   CLEARBOT — LoginForm screen component (/login)
   Campus design "2 Login": headline + proof chip and
   a white login card with matric, password, campus
   fields. On desktop the headline sits in a blue
   pitch panel beside the card. Validates the matric
   format, calls the payment API on submit, then stores
   matricNumber + campus in session and navigates to
   /pay. Password is stored via storePassword() and
   never enters SessionState.
   ───────────────────────────────────────────── */

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { ProofChip } from "@/components/ui/ProofChip";
import { useSession } from "@/hooks/useSession";
import { useToast } from "@/components/ui/Toast";
import { initiatePayment } from "@/lib/api";
import { isValidMatric, normalizeMatric, isValidCampus, VALID_CAMPUSES } from "@/lib/validation";

// Fix 1: values are the exact strings the backend validates against
// Derived from VALID_CAMPUSES so the dropdown and validation can't drift apart.
const CAMPUS_OPTIONS = VALID_CAMPUSES.map((c) => ({ value: c as string, label: c as string }));

export function LoginForm() {
  const router = useRouter();
  const { session, setSession, storePassword } = useSession();
  const { addToast } = useToast();

  const [matric, setMatric] = useState("");
  const [password, setPassword] = useState("");
  const [campus, setCampus] = useState(CAMPUS_OPTIONS[0].value); // Fix 1: "Iwo Campus"
  const [matricError, setMatricError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [shaking, setShaking] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);

  function shakeCard() {
    setShaking(true);
    setTimeout(() => setShaking(false), 300);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const normMatric = normalizeMatric(matric);

    let hasError = false;
    if (!normMatric || !password || !campus) {
      shakeCard();
      hasError = true;
    }

    if (normMatric && !isValidMatric(normMatric)) {
      setMatricError("Format should be like BU22CSC1081");
      shakeCard();
      hasError = true;
    } else {
      setMatricError("");
    }

    // Fix 12: guard against corrupted select value before hitting the network
    if (!isValidCampus(campus)) {
      shakeCard();
      return;
    }

    if (hasError) return;

    setIsLoading(true);

    // Dev bypass: set NEXT_PUBLIC_SKIP_PAYMENT=true in .env.local to skip Paystack
    if (process.env.NEXT_PUBLIC_SKIP_PAYMENT === "true") {
      setSession({ matricNumber: normMatric, campus, paymentRef: "dev-bypass" });
      storePassword(password);
      setIsLoading(false);
      router.push("/configure");
      return;
    }

    // Retry path: user already has a valid paymentRef (e.g. returning from error screen).
    // Skip payment entirely — they already paid. Just refresh credentials and go to configure.
    if (session.paymentRef) {
      setSession({ matricNumber: normMatric, campus });
      storePassword(password);
      setIsLoading(false);
      router.push("/configure");
      return;
    }

    try {
      const result = await initiatePayment(normMatric);

      if (result.alreadyPaid) {
        // Student paid this semester but closed the site — skip payment, go straight to bot config.
        setSession({ matricNumber: normMatric, campus, paymentRef: "already-paid" });
        storePassword(password);
        router.push("/configure");
        return;
      }

      const { reference, email, amount } = result;
      setSession({ matricNumber: normMatric, campus, paymentRef: reference, paymentEmail: email, paymentAmount: amount });
      storePassword(password);
      router.push("/pay");
    } catch {
      addToast("Something went wrong — try again", "error");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="page-enter flex flex-col gap-[18px] px-6 pb-10 pt-5 lg:flex-row lg:items-center lg:gap-20 lg:pb-24 lg:pl-12 lg:pr-12 lg:pt-12 xl:pl-20 xl:pr-[120px]">
      {/* ── Pitch (blue panel on desktop) ─────────── */}
      <section className="flex flex-col gap-[18px] lg:flex-1 lg:items-start lg:gap-6 lg:rounded-card lg:bg-cb-green lg:px-[52px] lg:py-14">
        <Link
          href="/"
          className="flex min-h-11 w-fit items-center gap-2 font-body text-[15px] font-bold text-cb-secondary lg:text-cb-on-accent"
        >
          <Icon name="arrowLeft" className="lg:hidden" />
          <Icon name="arrowLeftOnAccent" className="hidden lg:block" />
          Back
        </Link>

        <h1 className="font-display text-[30px] font-semibold leading-none tracking-[-0.03em] text-cb-primary lg:text-[56px] lg:text-cb-on-accent">
          Skip the clicking. Print your <span className="text-cb-blue lg:text-cb-on-accent">clearance</span>.
        </h1>

        <p className="font-body text-[15px] leading-[1.5] text-cb-secondary lg:text-[18px] lg:text-cb-on-accent">
          Complete all your lecturer assessments automatically. ₦1,000. Takes 3 minutes.
        </p>

        <ProofChip />

        <p className="hidden font-body text-[14px] text-cb-on-accent lg:block">
          “Saved me an hour during exams”
        </p>
      </section>

      {/* ── Login card ───────────────────────────── */}
      <form onSubmit={handleSubmit} noValidate className="w-full lg:w-[480px] lg:shrink-0">
        <div
          ref={cardRef}
          className={[
            "flex flex-col gap-[18px] rounded-card bg-cb-surface px-[26px] py-[30px] shadow-card",
            shaking ? "shake" : "",
          ].join(" ")}
        >
          <Input
            label="Matric number"
            type="text"
            value={matric}
            onChange={(e) => setMatric(e.target.value)}
            placeholder="e.g. BU19LIT1071"
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            error={matricError}
            required
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Portal password"
            autoComplete="current-password"
            required
          />

          <Select
            label="Campus"
            options={CAMPUS_OPTIONS}
            value={campus}
            onChange={(e) => setCampus(e.target.value)}
          />

          {/* Security note */}
          <div className="flex items-start gap-[10px] rounded-[12px] bg-cb-green-dim px-[14px] py-3">
            <Icon name="lock" />
            <p className="flex-1 font-body text-[14px] leading-[1.45] text-cb-primary">
              Your password is never saved. Used once to log in, then gone.
            </p>
          </div>

          {/* CTA */}
          <Button
            type="submit"
            variant="primary"
            fullWidth
            withArrow
            isLoading={isLoading}
            loadingText="Checking..."
            aria-label="Continue"
          >
            {session.paymentRef || process.env.NEXT_PUBLIC_SKIP_PAYMENT === "true"
              ? "Continue"
              : "Continue to Payment"}
          </Button>
        </div>
      </form>

      {/* Mobile-only testimonial (desktop shows it inside the blue panel) */}
      <p className="font-body text-[14px] text-cb-secondary lg:hidden">
        “Saved me an hour during exams”
      </p>
    </div>
  );
}
