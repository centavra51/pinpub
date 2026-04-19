/**
 * Simple cookie-based session management.
 *
 * In a production environment you would use a more robust solution
 * such as iron-session, next-auth, or a database-backed session store.
 * This implementation uses signed, HTTP-only cookies for simplicity.
 */

import { cookies } from "next/headers";

const SESSION_COOKIE = "pp_session";
const TOKEN_COOKIE = "pp_token";

export interface SessionData {
  accessToken: string;
  refreshToken?: string;
  expiresAt: number; // Unix timestamp (ms)
  username?: string;
  profileImage?: string;
}

/**
 * Store session data in a secure, HTTP-only cookie.
 * The data is JSON-encoded and base64-encoded for safe cookie storage.
 */
export async function setSession(data: SessionData): Promise<void> {
  const encoded = Buffer.from(JSON.stringify(data)).toString("base64");
  const cookieStore = await cookies();

  cookieStore.set(TOKEN_COOKIE, encoded, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });

  cookieStore.set(SESSION_COOKIE, "active", {
    httpOnly: false, // Readable by client for UI state
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

/**
 * Retrieve session data from the cookie.
 */
export async function getSession(): Promise<SessionData | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN_COOKIE);

  if (!token?.value) return null;

  try {
    const decoded = Buffer.from(token.value, "base64").toString("utf-8");
    return JSON.parse(decoded) as SessionData;
  } catch {
    return null;
  }
}

/**
 * Clear the session cookies (logout).
 */
export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(TOKEN_COOKIE);
  cookieStore.delete(SESSION_COOKIE);
}
