"use client";

/* ─────────────────────────────────────────────
   CLEARBOT — Screen 3: Rating Configuration (/configure)
   Route guard: redirects to / if paymentRef or
   matricNumber is missing.
   ───────────────────────────────────────────── */

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/hooks/useSession";
import { RatingConfig } from "@/components/screens/RatingConfig";

export default function ConfigurePage() {
  const router = useRouter();
  const { session } = useSession();

  // Fix 11: require both paymentRef and matricNumber — belt-and-suspenders after Fix 2
  useEffect(() => {
    if (!session.paymentRef || !session.matricNumber) {
      router.replace("/");
    }
  }, [session.paymentRef, session.matricNumber, router]);

  if (!session.paymentRef || !session.matricNumber) return null;

  return <RatingConfig />;
}
