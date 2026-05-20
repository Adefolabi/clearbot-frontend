/* ─────────────────────────────────────────────
   CLEARBOT — Backend API client
   All fetch calls go through the request() helper
   so errors are always ApiError instances.
   ───────────────────────────────────────────── */

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "https://clearbotbackend-adefolabi.fly.dev";

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "Unknown server error");
    throw new ApiError(res.status, text);
  }

  return res.json() as Promise<T>;
}

/* ─── Payment ─────────────────────────────────── */

export interface InitiatePaymentResponse {
  authorizationUrl: string;
  reference: string;
}

export async function initiatePayment(
  matricNumber: string,
  email?: string,
): Promise<any> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://clearbotbackend-adefolabi.fly.dev";
  const res = await fetch(`${baseUrl}/api/assessment/start`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ matricNumber, email }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "Unknown server error");
    throw new ApiError(res.status, text);
  }

  return res.json();
}

export interface PaymentStatusResponse {
  paid: boolean;
  runCompleted: boolean;
}

export async function checkPaymentStatus(
  reference: string,
): Promise<PaymentStatusResponse> {
  return request<PaymentStatusResponse>(`/api/payment/status/${reference}`);
}

/* ─── Assessment ──────────────────────────────── */

export interface StartAssessmentBody {
  matricNumber: string;
  password: string;
  campus: string;
  defaultRating: number;
  perCourseRatings?: Record<string, number>;
  dryRun?: boolean;
}

export interface StartAssessmentResponse {
  jobId: string;
}

export async function startAssessment(
  body: StartAssessmentBody,
): Promise<StartAssessmentResponse> {
  return request<StartAssessmentResponse>("/api/assessment/start", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

/** Returns the full EventSource URL for a given job ID. */
export function getProgressUrl(jobId: string): string {
  return `${API_URL}/api/assessment/progress/${jobId}`;
}
