/**
 * Session Status
 * GET /api/auth/session
 *
 * Returns the current session status for client-side rendering.
 */

import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";

export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({
        connected: false,
      });
    }

    return NextResponse.json({
      connected: true,
      username: session.username,
      profileImage: session.profileImage,
      expiresAt: session.expiresAt,
    });
  } catch (error) {
    console.error("Session check error:", error);
    return NextResponse.json({
      connected: false,
    });
  }
}
