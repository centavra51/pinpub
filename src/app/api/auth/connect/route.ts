/**
 * Pinterest OAuth – Start Authorization
 * GET /api/auth/connect
 *
 * Redirects the user to Pinterest's OAuth consent screen.
 */

import { NextResponse } from "next/server";
import { getAuthorizationUrl } from "@/lib/pinterest";

export async function GET() {
  try {
    const url = getAuthorizationUrl();
    return NextResponse.redirect(url);
  } catch (error) {
    console.error("OAuth start error:", error);
    return NextResponse.redirect(
      new URL(
        "/dashboard?error=oauth_start_failed",
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
      )
    );
  }
}
