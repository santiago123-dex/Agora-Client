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

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreateAssignmentPayload;

    if (!body.workspaceId) {
      return NextResponse.json(
        { message: "El workspaceId es requerido" },
        { status: 400 }
      );
    }

    if (!body.name?.trim()) {
      return NextResponse.json(
        { message: "El nombre de la tarea es requerido" },
        { status: 400 }
      );
    }

    if (!body.dueDate) {
      return NextResponse.json(
        { message: "La fecha de entrega es requerida" },
        { status: 400 }
      );
    }

    const assignment = await serverApiFetch<AssignmentResponse>(
      "/workspaces/assignments",
      {
        method: "POST",
        body: JSON.stringify({
          workspaceId: body.workspaceId,
          name: body.name,
          description: body.description ?? "",
          dueDate: body.dueDate,
          status: body.status ?? "PUBLICADO",
          rubric: body.rubric ?? {},
          settings: body.settings ?? {},
        }),
      }
    );

    return NextResponse.json(assignment, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "No se pudo crear la tarea",
      },
      { status: getErrorStatus(error) }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const workspaceId = searchParams.get("workspaceId");

    if (!workspaceId) {
      return NextResponse.json(
        { message: "El workspaceId es requerido" },
        { status: 400 }
      );
    }

    const assignments = await serverApiFetch<AssignmentResponse[]>(
      `/workspaces/assignments/workspace/${workspaceId}`,
      {
        method: "GET",
      }
    );

    return NextResponse.json(assignments);
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "No se pudieron obtener las tareas",
      },
      { status: getErrorStatus(error) }
    );
  }
}