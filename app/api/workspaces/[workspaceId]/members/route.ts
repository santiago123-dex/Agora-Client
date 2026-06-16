import { NextResponse } from "next/server";
import { serverApiFetch } from "@/app/src/lib/api/server-client";
import type {
    WorkspaceMemberDetailsResponse,
    WorkspaceMemberResponse,
} from "@/app/src/lib/api/workspaces";

type Props = {
    params: Promise<{
        workspaceId: string;
    }>;
};

export async function GET(_request: Request, { params }: Props) {
    try {
        const { workspaceId } = await params;


        const membershipsPromise = serverApiFetch<WorkspaceMemberResponse[]>(
            "/workspaces/member/user",
            { method: "GET" }
        );
        const membersPromise = serverApiFetch<WorkspaceMemberDetailsResponse[]>(
            `/workspaces/member/workspace/${workspaceId}/details`,
            { method: "GET" }
        );

        const memberships = await membershipsPromise;

        const membership = memberships.find(
            (item) => String(item.workspaceId) === String(workspaceId)
        );

        if (!membership) {
            return NextResponse.json(
                { message: "No perteneces a este workspace" },
                { status: 403 }
            );
        }

        if (membership.role !== "ADMIN") {
            return NextResponse.json(
                { message: "No tienes permisos para ver los miembros" },
                { status: 403 }
            );
        }

        const members = await membersPromise;

        return NextResponse.json(members);
    } catch (error) {
        return NextResponse.json(
            {
                message:
                    error instanceof Error
                        ? error.message
                        : "No se pudieron obtener los miembros",
            },
            { status: 400 }
        );
    }
}