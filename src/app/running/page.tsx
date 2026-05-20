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
  const { session } = useSession();

  useEffect(() => {
    if (!session.jobId) {
      router.replace("/");
    }
  }, [session.jobId, router]);

  if (!session.jobId) return null;

  return <ProgressScreen />;
}
