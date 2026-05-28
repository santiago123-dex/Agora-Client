import { NextResponse } from "next/server";
import { serverApiFetch } from "@/app/src/lib/api/server-client";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await serverApiFetch("/ai/suggest-grades", {
      method: "POST",
      body: JSON.stringify(body),
    });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Error al analizar las entregas",
      },
      { status: 500 },
    );
  }
}