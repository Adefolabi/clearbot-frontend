/* ─────────────────────────────────────────────
   CLEARBOT — Login (/login)
   Matric number, password and campus. All route
   guards that used to redirect to "/" now redirect
   here.
   ───────────────────────────────────────────── */

import { LoginForm } from "@/components/screens/LoginForm";

export default function LoginPage() {
  return <LoginForm />;
}
