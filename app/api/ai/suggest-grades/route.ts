import { NextResponse } from "next/server";
import { serverApiFetch } from "@/app/src/lib/api/server-client";
import { ApiError } from "@/app/src/lib/api/client";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const result = await serverApiFetch("/ai/suggest-grades", {
      method: "POST",
      body: JSON.stringify(body),
    });

    return NextResponse.json(result);
  } catch (error) {
    const status =
      error instanceof ApiError
        ? error.status
        : 500;

    const message = error instanceof Error ? error.message : "Error al analizar las entregas";

    console.error(`[AI SuggestGrades] status=${status} error="${message}"`, error instanceof ApiError ? error.data : "");

    return NextResponse.json(
      { message, detail: error instanceof ApiError ? error.data : null },
      { status },
    );
  }
}
