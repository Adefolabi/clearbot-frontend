"use client";

/* ─────────────────────────────────────────────
   CLEARBOT — Screen 4: Live Progress (/running)
   Route guard: redirects to / if jobId is missing.
   Renders ProgressScreen which owns the SSE
   connection and auto-navigates when the run ends.
   ───────────────────────────────────────────── */

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/hooks/useSession";
import { ProgressScreen } from "@/components/screens/ProgressScreen";

export default function RunningPage() {
  const router = useRouter();
  const { session, ready } = useSession();

  useEffect(() => {
    if (ready && !session.jobId) {
      router.replace("/");
    }
  }, [ready, session.jobId, router]);

  if (!ready || !session.jobId) return null;

  return <ProgressScreen />;
}
