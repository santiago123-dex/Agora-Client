import { NextResponse } from "next/server";
import { serverApiFetch } from "@/app/src/lib/api/server-client";
import type {
  AssignmentResponse,
  CreateAssignmentPayload,
} from "@/app/src/lib/api/assignments";

function getErrorStatus(error: unknown) {
  if (error instanceof Error && error.message === "No hay sesión activa") {
    return 401;
  }

  return 400;
}

type Props = {
  params: Promise<{
    assignmentId: string;
  }>;
};

export async function GET(_request: Request, { params }: Props) {
  try {
    const { assignmentId } = await params;

    const assignment = await serverApiFetch<AssignmentResponse>(
      `/workspaces/assignments/${assignmentId}`,
      { method: "GET" },
    );

    return NextResponse.json(assignment);
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "No se pudo obtener la tarea",
      },
      { status: getErrorStatus(error) },
    );
  }
}

export async function PUT(request: Request, { params }: Props) {
  try {
    const { assignmentId } = await params;
    const body = (await request.json()) as CreateAssignmentPayload;

    if (!body.workspaceId) {
      return NextResponse.json(
        { message: "El workspaceId es requerido" },
        { status: 400 },
      );
    }

    if (!body.name?.trim()) {
      return NextResponse.json(
        { message: "El nombre de la tarea es requerido" },
        { status: 400 },
      );
    }

    if (!body.dueDate) {
      return NextResponse.json(
        { message: "La fecha de entrega es requerida" },
        { status: 400 },
      );
    }

    const assignment = await serverApiFetch<AssignmentResponse>(
      `/workspaces/assignments/${assignmentId}`,
      {
        method: "PUT",
        body: JSON.stringify({
          workspaceId: body.workspaceId,
          name: body.name,
          description: body.description ?? "",
          dueDate: body.dueDate,
          status: body.status ?? "PUBLICADO",
          rubric: body.rubric ?? {},
          settings: body.settings ?? {},
        }),
      },
    );

    return NextResponse.json(assignment);
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "No se pudo actualizar la tarea",
      },
      { status: getErrorStatus(error) },
    );
  }
}

export async function DELETE(_request: Request, { params }: Props) {
  try {
    const { assignmentId } = await params;

    await serverApiFetch<void>(`/workspaces/assignments/${assignmentId}`, {
      method: "DELETE",
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "No se pudo eliminar la tarea",
      },
      { status: getErrorStatus(error) },
    );
  }
}
