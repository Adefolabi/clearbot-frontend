"use client";

/* ─────────────────────────────────────────────
   CLEARBOT — Paystack inline payment hook
   Dynamically imports @paystack/inline-js on
   the client only (avoids SSR issues) and opens
   the Paystack popup with the provided config.
   ───────────────────────────────────────────── */

import { useCallback, useState } from "react";

export interface PaystackTransactionConfig {
  email: string;
  amount: number;       // in kobo (₦1,000 = 100000)
  reference: string;
  onSuccess: (transaction: { reference: string }) => void;
  onClose: () => void;
}

export interface UsePaystackResult {
  initializePayment: (config: PaystackTransactionConfig) => void;
  isLoading: boolean;
}

export function usePaystack(): UsePaystackResult {
  const [isLoading, setIsLoading] = useState(false);

  const initializePayment = useCallback(
    (config: PaystackTransactionConfig) => {
      const key = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY ?? "";
      if (!key) {
        console.error("[Paystack] NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY is not set — payment popup cannot open.");
        config.onClose();
        return;
      }

      setIsLoading(true);

      import("@paystack/inline-js")
        .then((mod) => {
          setIsLoading(false);

          const popup = new mod.default();
          popup.newTransaction({
            key,
            email:     config.email,
            amount:    config.amount,
            ref:       config.reference,
            onSuccess: config.onSuccess,
            onCancel:  config.onClose,
          });
        })
        .catch((err) => {
          setIsLoading(false);
          console.error("[Paystack] Failed to load inline-js SDK:", err);
          config.onClose();
        });
    },
    [],
  );

  return { initializePayment, isLoading };
}
