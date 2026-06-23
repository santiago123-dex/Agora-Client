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

    const response = await fetch(`${gatewayUrl}/media/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return NextResponse.json(
        { message: data?.detail ?? "Error al obtener metadata" },
        { status: response.status },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Error al obtener metadata",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(
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

    const response = await fetch(`${gatewayUrl}/media/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      return NextResponse.json(
        { message: data?.detail ?? "Error al eliminar archivo" },
        { status: response.status },
      );
    }

    return NextResponse.json({ status: "deleted" });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Error al eliminar archivo",
      },
      { status: 500 },
    );
  }
}
