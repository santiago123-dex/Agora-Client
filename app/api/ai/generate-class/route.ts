import { NextResponse } from "next/server";
import { serverApiFetch } from "@/app/src/lib/api/server-client";

export async function POST(request: Request) {
  const body = await request.json();
  const result = await serverApiFetch("/ai/generate-class", {
    method: "POST",
    body: JSON.stringify(body),
  });
  return NextResponse.json(result);
}
