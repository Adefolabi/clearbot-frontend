/* ─────────────────────────────────────────────
   CLEARBOT — Root layout
   Loads both custom fonts (Fraunces + Plus Jakarta
   Sans via Google Fonts), wraps the app
   in SessionProvider + ToastProvider, and renders
   the persistent TopBar above all page content.
   ───────────────────────────────────────────── */

import type { Metadata } from "next";
import "./globals.css";
import { TopBar } from "@/components/layout/TopBar";
import { SessionProvider } from "@/hooks/useSession";
import { ToastProvider } from "@/components/ui/Toast";

export const metadata: Metadata = {
  title: "CLEARBOT — Automate Your Bowen Assessments",
  description:
    "Complete all your Bowen University lecturer assessments automatically. ₦1,000. Takes 3 minutes.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Fraunces (display, SOFT 0 / WONK 1) + Plus Jakarta Sans (body) — Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght,SOFT,WONK@9..144,600,0,1&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-cb-base text-cb-primary font-body antialiased">
        <SessionProvider>
          <ToastProvider>
            <TopBar />
            <main className="w-full">{children}</main>
          </ToastProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
