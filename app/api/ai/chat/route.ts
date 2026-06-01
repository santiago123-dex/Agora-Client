import { NextResponse } from "next/server";
import { serverApiFetch } from "@/app/src/lib/api/server-client";

function getErrorStatus(error: unknown) {
  if (error instanceof Error && error.message === "No hay sesión activa") {
    return 401;
  }
  return 400;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      message: string;
      workspace_id?: string;
    };

    if (!body.message?.trim()) {
      return NextResponse.json(
        { message: "El mensaje es requerido" },
        { status: 400 },
      );
    }

    const result = await serverApiFetch<Record<string, unknown>>("/ai/chat", {
      method: "POST",
      body: JSON.stringify({
        message: body.message,
        workspace_id: body.workspace_id ?? null,
      }),
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "No se pudo comunicar con el asistente",
      },
      { status: getErrorStatus(error) },
    );
  }
}
