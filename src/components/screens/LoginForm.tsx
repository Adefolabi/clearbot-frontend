"use client";

/* ─────────────────────────────────────────────
   CLEARBOT — LoginForm screen component
   Screen 1: Hero heading + login card with matric,
   password, campus fields. Validates the matric
   format, calls /api/assessment/start on submit,
   then stores matricNumber + campus in session
   and navigates to /pay. Password is stored via
   storePassword() and never enters SessionState.
   ───────────────────────────────────────────── */

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react"; // Fix 5: removed unused Star import
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { useSession } from "@/hooks/useSession";
import { useToast } from "@/components/ui/Toast";
import { initiatePayment } from "@/lib/api";
import { isValidMatric, normalizeMatric, isValidCampus } from "@/lib/validation";

// Fix 1: values are the exact strings the backend validates against
const CAMPUS_OPTIONS = [
  { value: "Iwo Campus",       label: "Iwo Campus" },
  { value: "Ogbomosho Campus", label: "Ogbomosho Campus" },
  { value: "Abuja Campus",     label: "Abuja Campus" },
];

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
      const { reference, email, amount } = await initiatePayment(normMatric);
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
    <div className="page-enter min-h-[calc(100dvh-56px)] flex flex-col">
      {/* ── Hero ─────────────────────────────────── */}
      <section className="px-6 pt-10 pb-8">
        <h1
          className="font-clash font-semibold text-cb-primary"
          style={{ fontSize: "32px", lineHeight: 1.15, maxWidth: "320px" }}
        >
          Skip the clicking. Print your clearance.
        </h1>
        <p
          className="font-dm text-cb-secondary mt-3"
          style={{ fontSize: "15px", maxWidth: "300px" }}
        >
          Complete all your lecturer assessments automatically. ₦1,000. Takes 3 minutes.
        </p>
      </section>

      {/* ── Login card ───────────────────────────── */}
      <form onSubmit={handleSubmit} noValidate>
        <div
          ref={cardRef}
          className={[
            "mx-4 rounded-[16px] border border-cb-border bg-cb-surface p-6",
            shaking ? "shake" : "",
          ].join(" ")}
          style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.4)" }}
        >
          <Input
            label="Matric Number"
            type="text"
            value={matric}
            onChange={(e) => setMatric(e.target.value)}
            placeholder="e.g. BU22CSC1081"
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
            containerClassName="mt-4"
            required
          />

          <Select
            label="Campus"
            options={CAMPUS_OPTIONS}
            value={campus}
            onChange={(e) => setCampus(e.target.value)}
            containerClassName="mt-4"
          />

          {/* Security note */}
          <div className="flex items-start gap-2 mt-5">
            <Lock
              size={14}
              aria-hidden="true"
              style={{ color: "var(--accent-green)", marginTop: "1px", flexShrink: 0 }}
            />
            <p className="font-dm text-[12px] text-cb-muted">
              Your password is never saved. Used once to log in, then gone.
            </p>
          </div>

          {/* CTA */}
          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={isLoading}
            loadingText="Checking..."
            className="mt-5"
            aria-label="Continue to payment"
          >
            Continue to Payment →
          </Button>
        </div>
      </form>

      {/* ── Social proof strip ────────────────────── */}
      <div
        className="mt-auto px-6 py-4 border-t"
        style={{
          background: "var(--accent-green-dim)",
          borderTopColor: "rgba(0,230,118,0.15)",
        }}
      >
        <div className="flex items-center gap-2 mb-1">
          <span
            className="font-dm text-[14px]"
            style={{ color: "var(--accent-green)" }}
            aria-label="5 stars"
          >
            ★★★★★
          </span>
          <span className="font-dm text-[13px] text-cb-secondary">
            Trusted by 300+ Bowen students this semester
          </span>
        </div>
        <p
          className="font-dm text-[13px] text-cb-secondary"
          style={{ fontStyle: "italic" }}
        >
          "Saved me an hour during exams"
        </p>
      </div>
    </div>
  );
}
