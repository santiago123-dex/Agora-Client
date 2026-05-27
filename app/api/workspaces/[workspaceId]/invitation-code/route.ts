import { NextResponse } from "next/server";
import { serverApiFetch } from "@/app/src/lib/api/server-client";

type Props = {
  params: Promise<{ workspaceId: string }>;
};

type InvitationCodeResponse = {
  workspaceId: number;
  code: string;
};

export async function GET(_request: Request, { params }: Props) {
  try {
    const { workspaceId } = await params;

    const result = await serverApiFetch<InvitationCodeResponse>(
      `/workspaces/${workspaceId}/invitation-code`,
      { method: "GET" }
    );

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "No se pudo obtener el código de invitación",
      },
      { status: 400 }
    );
  }
}