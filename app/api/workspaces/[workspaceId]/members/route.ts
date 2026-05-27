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


        // Traer todos los workspaces del usuario
        const memberships = await serverApiFetch<WorkspaceMemberResponse[]>(
            "/workspaces/member/user",
            { method: "GET" }
        );

        // Verificar que el usuario pertenezca al workspace actual
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

        const members = await serverApiFetch<WorkspaceMemberDetailsResponse[]>(
            `/workspaces/member/workspace/${workspaceId}/details`,
            { method: "GET" }
        );

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