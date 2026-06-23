import { NextRequest, NextResponse } from "next/server";
import { serverApiFetch } from "@/app/src/lib/api/server-client";
import { ApiError } from "@/app/src/lib/api/client";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const result = await serverApiFetch<Record<string, unknown>>(
      `/ai/generate-class/${id}`,
      { method: "GET" },
    );
    return NextResponse.json(result);
  } catch (error) {
    const status = error instanceof ApiError ? error.status : 400;
    const message = error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json({ message, status }, { status });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await serverApiFetch<Record<string, unknown>>(
      `/ai/generate-class/${id}`,
      { method: "DELETE" },
    );
    return NextResponse.json({ status: "deleted" });
  } catch (error) {
    const status = error instanceof ApiError ? error.status : 400;
    const message = error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json({ message, status }, { status });
  }
}
