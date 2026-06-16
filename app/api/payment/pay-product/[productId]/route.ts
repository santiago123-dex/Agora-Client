import { NextResponse } from "next/server";
import { serverApiFetch } from "@/app/src/lib/api/server-client";
import { ApiError } from "@/app/src/lib/api/client";
import { getAccessTokenFromCookies } from "@/app/src/lib/auth/session-server";

function decodeJwtPayload(token: string): Record<string, unknown> {
  const payload = token.split(".")[1];
  return JSON.parse(Buffer.from(payload, "base64url").toString("utf-8"));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ productId: string }> },
) {
  try {
    const accessToken = await getAccessTokenFromCookies();

    if (!accessToken) {
      return NextResponse.json(
        { message: "No hay sesión activa" },
        { status: 401 },
      );
    }

    const claims = decodeJwtPayload(accessToken);
    const userId = claims.sub as string;

    if (!userId) {
      return NextResponse.json(
        { message: "Token inválido: no se encontró el usuario" },
        { status: 401 },
      );
    }

    const { productId } = await params;

    const data = await serverApiFetch<{ url: string }>(
      `/payment/pay-product/${productId}`,
      {
        method: "GET",
        headers: {
          "X-User-Id": userId,
        },
        refreshOnUnauthorized: true,
      },
    );

    return NextResponse.json(data);
  } catch (error) {
    const status = error instanceof ApiError ? error.status : 500;
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "No se pudo obtener el link de pago",
      },
      { status },
    );
  }
}
