"use client";

/* ─────────────────────────────────────────────
   CLEARBOT — Screen 2: Payment Gate (/pay)
   Route guard: redirects to / if matricNumber
   is not in session (user skipped Screen 1).
   Renders PaymentSummary once guard passes.
   ───────────────────────────────────────────── */

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/hooks/useSession";
import { PaymentSummary } from "@/components/screens/PaymentSummary";

export default function PayPage() {
  const router = useRouter();
  const { session, ready } = useSession();

  useEffect(() => {
    if (ready && !session.matricNumber) {
      router.replace("/");
    }
  }, [ready, session.matricNumber, router]);

  if (!ready || !session.matricNumber) return null;

  return <PaymentSummary />;
}
