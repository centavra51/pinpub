/**
 * Pinterest API Service Layer
 *
 * This module provides clean abstractions for all Pinterest API interactions.
 * Replace placeholder URLs and payloads with real Pinterest API v5 endpoints
 * as needed: https://developers.pinterest.com/docs/api/v5/
 */

const PINTEREST_API_BASE = "https://api.pinterest.com/v5";
const PINTEREST_OAUTH_BASE = "https://www.pinterest.com/oauth";

// ─── OAuth Helpers ───────────────────────────────────────────────────────────

/**
 * Build the Pinterest OAuth authorization URL.
 * Scopes requested: boards:read, pins:read, pins:write, user_accounts:read
 */
export function getAuthorizationUrl(): string {
  const params = new URLSearchParams({
    client_id: process.env.PINTEREST_CLIENT_ID!,
    redirect_uri: process.env.PINTEREST_REDIRECT_URI!,
    response_type: "code",
    scope: "boards:read,pins:read,pins:write,user_accounts:read",
    state: generateState(),
  });

  return `${PINTEREST_OAUTH_BASE}/?${params.toString()}`;
}

/**
 * Exchange an authorization code for access + refresh tokens.
 */
export async function exchangeCodeForToken(code: string): Promise<{
  access_token: string;
  refresh_token?: string;
  token_type: string;
  expires_in: number;
  scope: string;
}> {
  const credentials = Buffer.from(
    `${process.env.PINTEREST_CLIENT_ID}:${process.env.PINTEREST_CLIENT_SECRET}`
  ).toString("base64");

  const response = await fetch(`${PINTEREST_API_BASE}/oauth/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: process.env.PINTEREST_REDIRECT_URI!,
    }).toString(),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Token exchange failed: ${response.status} – ${error}`);
  }

  return response.json();
}

/**
 * Refresh an expired access token using the refresh token.
 */
export async function refreshAccessToken(refreshToken: string): Promise<{
  access_token: string;
  refresh_token?: string;
  token_type: string;
  expires_in: number;
}> {
  const credentials = Buffer.from(
    `${process.env.PINTEREST_CLIENT_ID}:${process.env.PINTEREST_CLIENT_SECRET}`
  ).toString("base64");

  const response = await fetch(`${PINTEREST_API_BASE}/oauth/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }).toString(),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Token refresh failed: ${response.status} – ${error}`);
  }

  return response.json();
}

// ─── User Account ────────────────────────────────────────────────────────────

export interface PinterestUser {
  username: string;
  account_type?: string;
  profile_image?: string;
  website_url?: string;
}

/**
 * Fetch the authenticated user's profile information.
 * Pinterest API v5: GET /user_account
 */
export async function getUserAccount(
  accessToken: string
): Promise<PinterestUser> {
  const response = await fetch(`${PINTEREST_API_BASE}/user_account`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(
      `Failed to fetch user account: ${response.status} – ${error}`
    );
  }

  return response.json();
}

// ─── Boards ──────────────────────────────────────────────────────────────────

export interface PinterestBoard {
  id: string;
  name: string;
  description?: string;
  privacy?: string;
  pin_count?: number;
}

/**
 * Fetch all boards belonging to the authenticated user.
 * Pinterest API v5: GET /boards
 */
export async function getBoards(
  accessToken: string
): Promise<PinterestBoard[]> {
  const boards: PinterestBoard[] = [];
  let bookmark: string | null = null;

  do {
    const params = new URLSearchParams({ page_size: "25" });
    if (bookmark) params.set("bookmark", bookmark);

    const response = await fetch(
      `${PINTEREST_API_BASE}/boards?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(
        `Failed to fetch boards: ${response.status} – ${error}`
      );
    }

    const data = await response.json();
    boards.push(...(data.items || []));
    bookmark = data.bookmark || null;
  } while (bookmark);

  return boards;
}

// ─── Pin Creation ────────────────────────────────────────────────────────────

export interface CreatePinPayload {
  title: string;
  description: string;
  board_id: string;
  link?: string;
  media_source: {
    source_type: "image_base64";
    content_type: string;
    data: string;
  };
}

export interface PinResponse {
  id: string;
  title?: string;
  description?: string;
  link?: string;
  board_id?: string;
  created_at?: string;
  media?: {
    pin_thumbnail_urls?: string[];
  };
}

/**
 * Create a new Pin on the specified board.
 * Pinterest API v5: POST /pins
 *
 * The image is sent as base64-encoded data.
 */
export async function createPin(
  accessToken: string,
  payload: CreatePinPayload
): Promise<PinResponse> {
  const response = await fetch(`${PINTEREST_API_BASE}/pins`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: payload.title,
      description: payload.description,
      board_id: payload.board_id,
      link: payload.link || undefined,
      media_source: payload.media_source,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to create pin: ${response.status} – ${error}`);
  }

  return response.json();
}

// ─── Utilities ───────────────────────────────────────────────────────────────

function generateState(): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
