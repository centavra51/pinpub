/**
 * Create a Pin
 * POST /api/pins
 *
 * Publishes a new Pin to the specified board.
 * Each Pin is created only after explicit user confirmation.
 */

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { createPin } from "@/lib/pinterest";

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: "Not authenticated. Please connect your Pinterest account." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, description, boardId, link, imageBase64, contentType } = body;

    // Validate required fields
    if (!title || typeof title !== "string" || title.trim().length === 0) {
      return NextResponse.json(
        { error: "Pin title is required." },
        { status: 400 }
      );
    }

    if (!boardId || typeof boardId !== "string") {
      return NextResponse.json(
        { error: "Please select a board." },
        { status: 400 }
      );
    }

    if (!imageBase64 || typeof imageBase64 !== "string") {
      return NextResponse.json(
        { error: "An image is required to create a Pin." },
        { status: 400 }
      );
    }

    if (!contentType || typeof contentType !== "string") {
      return NextResponse.json(
        { error: "Image content type is required." },
        { status: 400 }
      );
    }

    // Validate link URL if provided
    if (link && typeof link === "string" && link.trim().length > 0) {
      try {
        new URL(link);
      } catch {
        return NextResponse.json(
          { error: "Please provide a valid destination URL." },
          { status: 400 }
        );
      }
    }

    const result = await createPin(session.accessToken, {
      title: title.trim(),
      description: (description || "").trim(),
      board_id: boardId,
      link: link?.trim() || undefined,
      media_source: {
        source_type: "image_base64",
        content_type: contentType,
        data: imageBase64,
      },
    });

    return NextResponse.json({
      success: true,
      pin: result,
      publishedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Pin creation error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to create Pin.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
