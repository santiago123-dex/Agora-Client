import { NextRequest, NextResponse } from "next/server";
import { getAccessTokenFromCookies } from "@/app/src/lib/auth/session-server";
import { GATEWAY_URL } from "@/app/src/lib/api/config";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const token = await getAccessTokenFromCookies();
    if (!token) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }

    const gatewayUrl = GATEWAY_URL;
    if (!gatewayUrl) {
      return NextResponse.json(
        { message: "GATEWAY_URL no configurada" },
        { status: 500 },
      );
    }

    const response = await fetch(`${gatewayUrl}/media/${id}/file`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return NextResponse.json(
        { message: errorData?.detail ?? "Error al obtener el archivo" },
        { status: response.status },
      );
    }

    const blob = await response.blob();
    const contentType =
      response.headers.get("content-type") ?? "application/octet-stream";
    const contentDisposition =
      response.headers.get("content-disposition") ?? "";

    return new NextResponse(blob, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": contentDisposition,
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Error al obtener el archivo",
      },
      { status: 500 },
    );
  }
}
