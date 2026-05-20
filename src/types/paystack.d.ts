/* Type shim for @paystack/inline-js — the package ships no .d.ts */
declare module "@paystack/inline-js" {
  interface NewTransactionConfig {
    key: string;
    email: string;
    amount: number;
    ref: string;
    onSuccess: (transaction: { reference: string }) => void;
    onCancel: () => void;
  }

  class PaystackPop {
    newTransaction(config: NewTransactionConfig): void;
  }

  export default PaystackPop;
}
