import { NextResponse } from "next/server";
import { serverApiFetch } from "@/app/src/lib/api/server-client";
import type {
  CreateSubmissionPayload,
  SubmissionResponse,
} from "@/app/src/lib/api/submissions";

type CurrentUserResponse = {
  id: string;
};

function getErrorStatus(error: unknown) {
  if (error instanceof Error && error.message === "No hay sesión activa") {
    return 401;
  }

  return 400;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const assignmentId = searchParams.get("assignmentId");
    const workspaceId = searchParams.get("workspaceId");

    if (assignmentId) {
      const submissions = await serverApiFetch<SubmissionResponse[]>(
        `/workspaces/submission/assignment/${assignmentId}`,
        { method: "GET" },
      );

      return NextResponse.json(submissions);
    }

    if (workspaceId) {
      const user = await serverApiFetch<CurrentUserResponse>("/users/get-user", {
        method: "GET",
      });

      const submissions = await serverApiFetch<SubmissionResponse[]>(
        `/workspaces/submission/workspace/${workspaceId}/user/${user.id}`,
        { method: "GET" },
      );

      return NextResponse.json(submissions);
    }

    return NextResponse.json(
      { message: "El assignmentId o workspaceId es requerido" },
      { status: 400 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "No se pudieron obtener las entregas",
      },
      { status: 400 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreateSubmissionPayload;

    if (!body.assignmentId) {
      return NextResponse.json(
        { message: "El assignmentId es requerido" },
        { status: 400 },
      );
    }

    const user = await serverApiFetch<CurrentUserResponse>("/users/get-user", {
      method: "GET",
    });

    const submission = await serverApiFetch<SubmissionResponse>(
      "/workspaces/submission",
      {
        method: "POST",
        body: JSON.stringify({
          assignmentId: body.assignmentId,
          userId: user.id,
          content: body.content ?? {},
          files: body.files ?? { attachments: [] },
        }),
      },
    );

    return NextResponse.json(submission, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "No se pudo enviar la entrega",
      },
      { status: getErrorStatus(error) },
    );
  }
}
