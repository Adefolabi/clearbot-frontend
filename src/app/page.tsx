/* ─────────────────────────────────────────────
   CLEARBOT — Screen 1: Landing & Login (/)
   Renders the hero + login card. No route guard
   needed — this is the entry point of the app.
   ───────────────────────────────────────────── */

import { LoginForm } from "@/components/screens/LoginForm";

export default function HomePage() {
  return <LoginForm />;
}
