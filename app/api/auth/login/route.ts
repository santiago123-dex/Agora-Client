import { NextResponse } from "next/server";
import { serverLogin } from "@/app/src/lib/api/auth-server";
import { ApiError } from "@/app/src/lib/api/client";
import type { LoginPayload } from "@/app/src/lib/api/auth";
import { GATEWAY_URL } from "@/app/src/lib/api/config";

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

export async function POST(request: Request) {
    try {
        const body = (await request.json()) as LoginPayload;
        const response = await serverLogin(body);

        const accessToken =
            response.access_token ??
            response.accessToken ??
            response.token;

        if (accessToken && body.identifier && GATEWAY_URL) {
            const claims = decodeJwtPayload(accessToken);
            const sub = typeof claims?.sub === "string" ? claims.sub : undefined;

            try {
                const check = await fetch(`${GATEWAY_URL}/users/get-user`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                    cache: "no-store",
                });

                if (!check.ok) {
                    const createResp = await fetch(`${GATEWAY_URL}/users/create`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            ...(sub ? { Authorization: `Bearer ${accessToken}` } : {}),
                        },
                        body: JSON.stringify({
                            email: body.identifier,
                            password: body.password,
                            firstName: body.identifier.split("@")[0],
                            lastName: "",
                        }),
                        cache: "no-store",
                    });

                    if (!createResp.ok) {
                        const createErr = await createResp.json().catch(() => null);
                        console.log(
                            "[login] create profile failed:",
                            createResp.status,
                            createErr,
                        );
                    } else {
                        console.log("[login] profile created successfully");
                    }
                }
            } catch (e) {
                console.log("[login] ensureUserProfile error:", e);
            }
        }

        return NextResponse.json(response);
    } catch (error) {
        const status = error instanceof ApiError ? error.status : 500;

        return NextResponse.json(
            {
                message:
                    error instanceof Error
                        ? error.message
                        : "No se pudo iniciar sesión",
            },
            { status }
        );
    }
}
