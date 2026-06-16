import { NextResponse } from "next/server";
import { serverApiFetch } from "@/app/src/lib/api/server-client";
import { ApiError } from "@/app/src/lib/api/client";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      message: string;
      workspace_id?: string;
      session_id?: string;
    };

    if (!body.message?.trim()) {
      return NextResponse.json(
        { message: "El mensaje es requerido" },
        { status: 400 },
      );
    }

    const headers: Record<string, string> = {};
    if (body.session_id) {
      headers["X-Session-Id"] = body.session_id;
    }

    const result = await serverApiFetch<Record<string, unknown>>("/ai/chat", {
      method: "POST",
      body: JSON.stringify({
        message: body.message,
        workspace_id: body.workspace_id ?? null,
      }),
      headers,
    });

    return NextResponse.json(result);
  } catch (error) {
    const status =
      error instanceof ApiError
        ? error.status
        : error instanceof Error && error.message === "No hay sesión activa"
          ? 401
          : 400;

    const message = error instanceof Error ? error.message : "Error desconocido";

    console.error(`[AI Chat] status=${status} error=${message}`, error instanceof ApiError ? error.data : "");

    return NextResponse.json({ message, status, detail: error instanceof ApiError ? error.data : null }, { status });
  }
}
