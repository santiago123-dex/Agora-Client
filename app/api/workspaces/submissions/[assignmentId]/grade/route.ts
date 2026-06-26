import { NextResponse } from "next/server";
import { serverApiFetch } from "@/app/src/lib/api/server-client";

function getErrorStatus(error: unknown) {
  if (error instanceof Error && error.message === "No hay sesión activa") {
    return 401;
  }
  return 400;
}

type Props = {
  params: Promise<{ assignmentId: string }>;
};

export async function POST(request: Request, { params }: Props) {
  try {
    const { assignmentId } = await params;
    const body = await request.json();

    const user = await serverApiFetch<{ id: string }>("/users/get-user", {
      method: "GET",
    });

    await serverApiFetch(
      `/workspaces/submission/${assignmentId}/grade-teacher`,
      {
        method: "POST",
        body: JSON.stringify({
          adminUserId: user.id,
          score: body.score,
          feedback: body.feedback,
        }),
      },
    );

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "No se pudo guardar la calificación",
      },
      { status: getErrorStatus(error) },
    );
  }
}
