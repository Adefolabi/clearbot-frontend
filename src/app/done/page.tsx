"use client";

/* ─────────────────────────────────────────────
   CLEARBOT — Screen 4b: Completion (/done)
   Route guard: redirects to / if completionSummary
   is absent (user navigated here directly without
   a run completing first).
   ───────────────────────────────────────────── */

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/hooks/useSession";
import { CompletionScreen } from "@/components/screens/CompletionScreen";

export default function DonePage() {
  const router = useRouter();
  const { session, ready } = useSession();

  useEffect(() => {
    if (ready && !session.completionSummary) {
      router.replace("/login");
    }
  }, [ready, session.completionSummary, router]);

  if (!ready || !session.completionSummary) return null;

  return (
    <div className="mx-auto w-full max-w-[480px]">
      <CompletionScreen />
    </div>
  );
}
