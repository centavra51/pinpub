/**
 * Pinterest OAuth – Callback
 * GET /api/auth/callback
 *
 * Handles the redirect from Pinterest after user authorization.
 * Exchanges the authorization code for tokens and stores them in session.
 */

import { NextRequest, NextResponse } from "next/server";
import { exchangeCodeForToken, getUserAccount } from "@/lib/pinterest";
import { setSession } from "@/lib/session";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  // Handle OAuth errors
  if (error) {
    console.error("Pinterest OAuth error:", error);
    return NextResponse.redirect(
      new URL(`/dashboard?error=access_denied`, appUrl)
    );
  }

  // Validate authorization code
  if (!code) {
    return NextResponse.redirect(
      new URL(`/dashboard?error=no_code`, appUrl)
    );
  }

  try {
    // Exchange authorization code for tokens
    const tokenData = await exchangeCodeForToken(code);

    // Fetch user profile
    const user = await getUserAccount(tokenData.access_token);

    // Store session
    await setSession({
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      expiresAt: Date.now() + tokenData.expires_in * 1000,
      username: user.username,
      profileImage: user.profile_image,
    });

    return NextResponse.redirect(new URL("/dashboard?connected=true", appUrl));
  } catch (err) {
    console.error("Token exchange error:", err);
    return NextResponse.redirect(
      new URL(`/dashboard?error=token_exchange_failed`, appUrl)
    );
  }
}
