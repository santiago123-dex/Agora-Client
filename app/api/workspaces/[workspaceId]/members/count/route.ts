import { NextResponse } from "next/server";
import { serverApiFetch } from "@/app/src/lib/api/server-client";
import type { WorkspaceMemberResponse } from "@/app/src/lib/api/workspaces";

type Props = {
  params: Promise<{
    workspaceId: string;
  }>;
};

export async function GET(request: Request, { params }: Props) {
  try {
    const { workspaceId } = await params;
    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role");

    const membershipsPromise = serverApiFetch<WorkspaceMemberResponse[]>(
      "/workspaces/member/user",
      { method: "GET" },
    );

    const memberships = await membershipsPromise;

    const belongsToWorkspace = memberships.some(
      (item) => String(item.workspaceId) === String(workspaceId),
    );

    if (!belongsToWorkspace) {
      return NextResponse.json(
        { message: "No perteneces a este workspace" },
        { status: 403 },
      );
    }

    const members = await serverApiFetch<WorkspaceMemberResponse[]>(
      `/workspaces/member/workspace/${workspaceId}`,
      { method: "GET" },
    );

    const filtered = role
      ? members.filter((m) => m.role === role)
      : members;

    return NextResponse.json({ count: filtered.length });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "No se pudo obtener el total de miembros",
      },
      { status: 400 },
    );
  }
}
