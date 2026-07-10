import { NextRequest, NextResponse } from "next/server";
import { createMiddlewareClient } from "@/lib/supabase/server";
import {
  buildIdentifier,
  consumeRateLimit,
} from "@/lib/rate-limit/server";

const GENERATE_API_PATTERN = /^\/api\/v2\/generate\//;

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only intercept generate API routes
  if (!GENERATE_API_PATTERN.test(pathname)) {
    return NextResponse.next();
  }

  const response = NextResponse.next();
  const supabase = createMiddlewareClient(request, response);

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Get device ID from header (for guests)
  const deviceId = request.headers.get("x-device-id");

  // Build identifier
  const identifier = buildIdentifier(user?.id ?? null, deviceId);

  // Get client IP
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  // Consume rate limit
  const result = await consumeRateLimit(supabase, identifier, ip);

  // Add rate limit info to response headers for downstream logging
  response.headers.set("x-rate-limit-remaining", String(result.remaining));
  response.headers.set("x-rate-limit-limit", String(result.limit));

  if (!result.allowed) {
    return NextResponse.json(
      {
        error: "Daily generation limit reached",
        limit: result.limit,
        remaining: 0,
        message: user
          ? `You've used all ${result.limit} generations today. Try again tomorrow.`
          : `You've used all ${result.limit} free generations today. Sign up for more.`,
      },
      { status: 429 },
    );
  }

  return response;
}

export const config = {
  matcher: ["/api/v2/generate/:path*"],
};
