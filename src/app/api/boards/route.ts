/**
 * Fetch User's Boards
 * GET /api/boards
 *
 * Returns the list of boards for the connected Pinterest account.
 */

import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getBoards } from "@/lib/pinterest";

export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: "Not authenticated. Please connect your Pinterest account." },
        { status: 401 }
      );
    }

    const boards = await getBoards(session.accessToken);

    return NextResponse.json({ boards });
  } catch (error) {
    console.error("Boards fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch boards. Please try reconnecting your account." },
      { status: 500 }
    );
  }
}
