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

  async function doFetch(sid?: string) {
    const h = { ...headers };
    if (sid) h["X-Session-Id"] = sid;

    return fetch(`${GATEWAY_URL}/ai/generate-class/stream`, {
      method: "POST",
      headers: h,
      body: JSON.stringify({ prompt: body.prompt }),
      cache: "no-store",
    });
  }

  let agentResponse = await doFetch(body.session_id);

  if (agentResponse.status === 401 && body.session_id) {
    const errorData = await agentResponse.json().catch(() => null);
    if (errorData?.code === "SESSION_EXPIRED" || errorData?.detail?.code === "SESSION_EXPIRED") {
      agentResponse = await doFetch();
    }
  }

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
