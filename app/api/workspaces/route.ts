import { NextResponse } from "next/server";
import { serverApiFetch } from "@/app/src/lib/api/server-client";
import type {
  CreateWorkspacePayload,
  WorkspaceMemberResponse,
  WorkspaceResponse,
  WorkspaceWithRole,
} from "@/app/src/lib/api/workspaces";

function generateInviteCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";

  for (let index = 0; index < 8; index += 1) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)];
  }

  return code;
}

// el resultado de esta funcion son los datos del workspace mas los datos del workspace member 
async function getWorkspaceWithRole(member: WorkspaceMemberResponse): Promise<WorkspaceWithRole> {
  const workspace = await serverApiFetch<WorkspaceResponse>(
    `/workspaces/getWorkspaceById/${member.workspaceId}`,
    { method: "GET" }
  );

  return {
    ...workspace,
    role: member.role,
    membershipId: member.id,
    memberUserId: member.userId,
  };
}

export async function GET() {
  try {
    // primero se ejecuta esta peticion para obtener los workspaces del usuario 
    const memberships = await serverApiFetch<WorkspaceMemberResponse[]>(
      "/workspaces/member/user",
      { method: "GET" }
    );

    // despues se ejecuta esta peticion, osea se ejecuta la peticion de getWorkspaceById por cada workspace del usuario 
    const workspaces = await Promise.all(memberships.map(getWorkspaceWithRole));

    return NextResponse.json(workspaces);
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "No se pudieron obtener los workspaces",
      },
      { status: 400 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreateWorkspacePayload;
    const code = generateInviteCode();

    const workspace = await serverApiFetch<WorkspaceResponse>("/workspaces/create", {
      method: "POST",
      body: JSON.stringify({
        name: body.name,
        description: body.description,
        data: {
          code,
          accentColor: body.accentColor,
        },
      }),
    });

    return NextResponse.json({
      ...workspace,
      role: "ADMIN",
      membershipId: 0,
      memberUserId: "",
    } satisfies WorkspaceWithRole);
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "No se pudo crear el workspace",
      },
      { status: 400 }
    );
  }
}
