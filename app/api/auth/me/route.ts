import { NextResponse } from "next/server";
import { serverApiFetch } from "@/app/src/lib/api/server-client";
import { ApiError } from "@/app/src/lib/api/client";
import { getAccessTokenFromCookies } from "@/app/src/lib/auth/session-server";

function decodeJwtPayload(token: string): Record<string, unknown> | null {
    try {
        const payloadBase64 = token.split(".")[1];
        if (!payloadBase64) return null;
        try {
            return JSON.parse(
                Buffer.from(payloadBase64, "base64url").toString("utf-8"),
            );
        } catch {
            return JSON.parse(
                Buffer.from(payloadBase64, "base64").toString("utf-8"),
            );
        }
    } catch {
        return null;
    }
}

export async function GET() {
    const accessToken = await getAccessTokenFromCookies();

    if (!accessToken) {
        return NextResponse.json(
            { message: "No hay sesión activa" },
            { status: 401 },
        );
    }

    try {
        const data = await serverApiFetch("/users/get-user", {
            method: "GET",
            refreshOnUnauthorized: false,
        });

        return NextResponse.json(data);
    } catch (error) {
        const isUnauthorized = error instanceof ApiError && error.status === 401;

        if (isUnauthorized) {
            return NextResponse.json(
                {
                    message:
                        error instanceof Error
                            ? error.message
                            : "No se pudo obtener el usuario",
                },
                { status: 401 },
            );
        }

        const claims = decodeJwtPayload(accessToken);
        const sub =
            typeof claims?.sub === "string" ? claims.sub : undefined;

        return NextResponse.json({
            id: sub ?? claims?.userId ?? claims?.id,
        });
    }
}
