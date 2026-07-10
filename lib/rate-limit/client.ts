import { getOrCreateDeviceId } from "@/lib/device";

export interface RateLimitStatus {
  limit: number;
  remaining: number;
  count: number;
  resetsAt: string;
  isGuest: boolean;
}

/**
 * Fetch the current rate limit status from the server.
 */
export async function getRateLimitStatus(): Promise<RateLimitStatus> {
  const response = await fetch("/api/v2/rate-limit/status", {
    headers: { "x-device-id": getOrCreateDeviceId() },
  });

  if (!response.ok) {
    // Fail gracefully — assume unlimited if we can't check
    return { limit: 10, remaining: 10, count: 0, resetsAt: "", isGuest: true };
  }

  return response.json();
}
