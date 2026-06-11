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

export async function DELETE(_request: Request, { params }: Props) {
  try {
    const { assignmentId } = await params;

    await serverApiFetch<void>(`/workspaces/submission/${assignmentId}`, {
      method: "DELETE",
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "No se pudo cancelar la entrega",
      },
      { status: getErrorStatus(error) },
    );
  }
}
