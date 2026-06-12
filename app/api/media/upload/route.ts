import { NextRequest, NextResponse } from "next/server";
import { getAccessTokenFromCookies } from "@/app/src/lib/auth/session-server";
import { GATEWAY_URL } from "@/app/src/lib/api/config";

export async function POST(request: NextRequest) {
  try {
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

    const body = await request.blob();

    const response = await fetch(`${gatewayUrl}/media/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": request.headers.get("content-type") ?? "multipart/form-data",
      },
      body,
      cache: "no-store",
      duplex: "half",
    } as RequestInit & { duplex: string });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return NextResponse.json(
        { message: data?.detail ?? data?.message ?? "Error al subir archivo" },
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
            : "Error al subir archivo",
      },
      { status: 500 },
    );
  }
}
