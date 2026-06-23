import { NextResponse } from "next/server";
import { serverApiFetch } from "@/app/src/lib/api/server-client";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    prompt: string;
    session_id?: string;
  };

  const headers: Record<string, string> = {};
  if (body.session_id) {
    headers["X-Session-Id"] = body.session_id;
  }

  const result = await serverApiFetch("/ai/generate-class", {
    method: "POST",
    body: JSON.stringify({ prompt: body.prompt }),
    headers,
  });
  return NextResponse.json(result);
}
