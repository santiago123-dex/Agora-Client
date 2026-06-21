import { NextResponse } from "next/server";
import { serverApiFetch } from "@/app/src/lib/api/server-client";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const params = searchParams.toString();
  const path = `/ai/generate-class/history${params ? `?${params}` : ""}`;
  const result = await serverApiFetch(path);
  return NextResponse.json(result);
}
