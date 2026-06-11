import { NextRequest, NextResponse } from "next/server";
import { serverApiFetch } from "@/app/src/lib/api/server-client";
import { ApiError } from "@/app/src/lib/api/client";

export async function GET(request: NextRequest) {
  try {
    const sessionId = request.nextUrl.searchParams.get("session_id");
    if (!sessionId) {
      return NextResponse.json(
        { message: "session_id is required" },
        { status: 400 },
      );
    }

    const result = await serverApiFetch<Record<string, unknown>>(
      `/ai/chat/history?session_id=${sessionId}`,
      { method: "GET" },
    );

    return NextResponse.json(result);
  } catch (error) {
    const status =
      error instanceof ApiError
        ? error.status
        : 400;

    const message = error instanceof Error ? error.message : "Error desconocido";

    return NextResponse.json({ message, status }, { status });
  }
}
