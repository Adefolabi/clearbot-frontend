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
      setIsLoading(true);

      import("@paystack/inline-js")
        .then((mod) => {
          setIsLoading(false);

          const popup = new mod.default();
          popup.newTransaction({
            key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY ?? "",
            email: config.email,
            amount: config.amount,
            ref: config.reference,
            onSuccess: config.onSuccess,
            onCancel: config.onClose,
          });
        })
        .catch(() => {
          setIsLoading(false);
        });
    },
    [],
  );

  return { initializePayment, isLoading };
}
