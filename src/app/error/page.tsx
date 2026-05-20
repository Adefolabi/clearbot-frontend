"use client";

/* ─────────────────────────────────────────────
   CLEARBOT — Screen 4c: Error & Retry (/error)
   Route guard: redirects to / if errorDetails
   is absent (nothing went wrong in this session).
   ───────────────────────────────────────────── */

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/hooks/useSession";
import { ErrorScreen } from "@/components/screens/ErrorScreen";

export default function ErrorPage() {
  const router = useRouter();
  const { session } = useSession();

  useEffect(() => {
    if (!session.errorDetails) {
      router.replace("/");
    }
  }, [session.errorDetails, router]);

  if (!session.errorDetails) return null;

  return <ErrorScreen />;
}
