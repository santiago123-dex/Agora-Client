import { NextRequest, NextResponse } from "next/server";
import { serverApiFetch } from "@/app/src/lib/api/server-client";
import { ApiError } from "@/app/src/lib/api/client";

export async function GET(request: NextRequest) {
  try {
    const type = request.nextUrl.searchParams.get("type");
    const path = type ? `/ai/chat/conversations?type=${type}` : "/ai/chat/conversations";
    const result = await serverApiFetch<Record<string, unknown>>(path, {
      method: "GET",
    });
    return NextResponse.json(result);
  } catch (error) {
    const status = error instanceof ApiError ? error.status : 400;
    const message = error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json({ message, status }, { status });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const sessionId = request.nextUrl.searchParams.get("session_id");
    if (!sessionId) {
      return NextResponse.json({ message: "session_id is required" }, { status: 400 });
    }

    await serverApiFetch<Record<string, unknown>>(
      `/ai/chat/conversations?session_id=${sessionId}`,
      { method: "DELETE" },
    );

    return NextResponse.json({ status: "deleted" });
  } catch (error) {
    const status = error instanceof ApiError ? error.status : 400;
    const message = error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json({ message, status }, { status });
  }
}
