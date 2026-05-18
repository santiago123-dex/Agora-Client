import { NextResponse } from "next/server";
import { serverApiFetch } from "@/app/src/lib/api/server-client";
import type {
  WorkspaceMemberResponse,
  WorkspaceResponse,
  WorkspaceWithRole,
} from "@/app/src/lib/api/workspaces";

type JoinWorkspaceBody = {
  code: string;
};

type CurrentUserResponse = {
  id: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as JoinWorkspaceBody;
    const code = body.code?.trim();

    if (!code) {
      return NextResponse.json(
        { message: "El código del workspace es requerido" },
        { status: 400 }
      );
    }

    const user = await serverApiFetch<CurrentUserResponse>("/users/get-user", {
      method: "GET",
    });

    const membership = await serverApiFetch<WorkspaceMemberResponse>(
      "/workspaces/member/addMember",
      {
        method: "POST",
        body: JSON.stringify({ code, userId: user.id }),
      }
    );

    const workspace = await serverApiFetch<WorkspaceResponse>(
      `/workspaces/getWorkspaceById/${membership.workspaceId}`,
      { method: "GET" }
    );

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
          error instanceof Error ? error.message : "No se pudo unir al workspace",
      },
      { status: 400 }
    );
  }
}
