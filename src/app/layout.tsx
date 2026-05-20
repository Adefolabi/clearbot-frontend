/* ─────────────────────────────────────────────
   CLEARBOT — Root layout
   Loads both custom fonts (Clash Display via
   Fontshare, DM Sans via Google), wraps the app
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
        {/* Clash Display — loaded via Fontshare CDN */}
        <link
          rel="preconnect"
          href="https://api.fontshare.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://api.fontshare.com/v2/css?f[]=clash-display@600,500&display=swap"
          rel="stylesheet"
        />
        {/* DM Sans — loaded via Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-cb-base text-cb-primary font-dm antialiased">
        <SessionProvider>
          <ToastProvider>
            <TopBar />
            <main className="mx-auto w-full max-w-[480px]">
              {children}
            </main>
          </ToastProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
