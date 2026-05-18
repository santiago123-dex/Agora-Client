import { NextResponse } from "next/server";
import { serverApiFetch } from "@/app/src/lib/api/server-client";
import type {
  WorkspaceMemberResponse,
  WorkspaceResponse,
  WorkspaceWithRole,
} from "@/app/src/lib/api/workspaces";

type Props = {
  params: Promise<{
    workspaceId: string;
  }>;
};

type UpdateWorkspacePayload = {
  name: string;
  description: string;
  accentColor: string;
}

export async function GET(_request: Request, { params }: Props) {
  try {
    const { workspaceId } = await params;

    const [workspace, memberships] = await Promise.all([
      // se ejecuta esta peticion para obtener el workspace, osea todos los datos de el
      serverApiFetch<WorkspaceResponse>(`/workspaces/getWorkspaceById/${workspaceId}`, {
        method: "GET",
      }),
      // se ejecuta esta peticion para obtener los workspaces del usuario
      serverApiFetch<WorkspaceMemberResponse[]>("/workspaces/member/user", {
        method: "GET",
      }),
    ]);

    const membership = memberships.find(
      (item) => String(item.workspaceId) === String(workspace.id)
    );

    if (!membership) {
      return NextResponse.json(
        { message: "No perteneces a este workspace" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      ...workspace,
      role: membership.role,
      membershipId: membership.id,
      memberUserId: membership.userId,
    } satisfies WorkspaceWithRole);
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "No se pudo obtener el workspace",
      },
      { status: 400 }
    );
  }
}


export async function PATCH(request: Request, { params }: Props) {
  try {
    const { workspaceId } = await params;
    const body = (await request.json()) as UpdateWorkspacePayload;

    const [currentWorkspace, memberships] = await Promise.all([
      serverApiFetch<WorkspaceResponse>(`/workspaces/getWorkspaceById/${workspaceId}`, {
        method: "GET",
      }),
      serverApiFetch<WorkspaceMemberResponse[]>("/workspaces/member/user", {
        method: "GET",
      }),
    ])

    const membership = memberships.find(
      (item) => String(item.workspaceId) === String(updatedWorkspace.id)
    );

    if (!membership) {
      return NextResponse.json(
        { message: "No perteneces a este workspace" },
        { status: 403 }
      );
    }

    if (membership.role !== "ADMIN") {
      return NextResponse.json(
        { message: "No tienes permisos para editar este workspace" },
        { status: 403 }
      );
    }

    const updatedWorkspace = await serverApiFetch<WorkspaceResponse>(
      `/workspaces/updateWorkspace/${workspaceId}`,
      {
        method: "PUT",
        body: JSON.stringify({
          name: body.name,
          description: body.description,
          data: {
            ...(currentWorkspace.data ?? {}),
            accentColor: body.accentColor,
          },
        }),
      }
    );


    return NextResponse.json({
      ...updatedWorkspace,
      role: membership.role,
      membershipId: membership.id,
      memberUserId: membership.userId,
    } satisfies WorkspaceWithRole);
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "No se pudo actualizar el workspace",
      },
      { status: 400 }
    );
  }
}
