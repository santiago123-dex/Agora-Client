import { getAccessTokenFromCookies } from "@/app/src/lib/auth/session-server";
import { GATEWAY_URL } from "@/app/src/lib/api/config";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    prompt: string;
    session_id?: string;
  };

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const token = await getAccessTokenFromCookies();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  if (body.session_id) {
    headers["X-Session-Id"] = body.session_id;
  }

  const agentResponse = await fetch(`${GATEWAY_URL}/ai/generate-class/stream`, {
    method: "POST",
    headers,
    body: JSON.stringify({ prompt: body.prompt }),
    cache: "no-store",
  });

  if (!agentResponse.ok) {
    const errorData = await agentResponse.json().catch(() => null);
    return Response.json(
      { message: errorData?.message ?? "Error al generar el plan de clase", status: agentResponse.status },
      { status: agentResponse.status },
    );
  }

  return new Response(agentResponse.body, {
    headers: {
      "Content-Type": "application/x-ndjson",
      "Cache-Control": "no-cache",
      "X-Accel-Buffering": "no",
    },
  });
}
