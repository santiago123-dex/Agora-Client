import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { serverRefreshAccessToken } from "@/app/src/lib/api/auth-server";
import { authCookieOptions } from "@/app/src/lib/auth/cookie-options";

export async function POST() {
    const cookieStore = await cookies();

    const refreshToken = cookieStore.get("agora_refresh_token")?.value;

    if (!refreshToken) {
        return NextResponse.json(
            { message: "No hay refresh token disponible" },
            { status: 401 }
        );
    }

    try {
        const response = await serverRefreshAccessToken({
            refresh_token: refreshToken,
        });

        cookieStore.set("agora_access_token", response.access_token, {
            ...authCookieOptions,
            maxAge: 60 * 60,
        });

        if (response.refresh_token) {
            cookieStore.set("agora_refresh_token", response.refresh_token, {
                ...authCookieOptions,
                maxAge: 60 * 60 * 24 * 30,
            });
        }

        return NextResponse.json({ ok: true });
    } catch (error) {
        cookieStore.set("agora_access_token", "", {
            ...authCookieOptions,
            maxAge: 0,
        });

        cookieStore.set("agora_refresh_token", "", {
            ...authCookieOptions,
            maxAge: 0,
        });

        return NextResponse.json(
            {
                message:
                    error instanceof Error
                        ? error.message
                        : "No se pudo refrescar la sesión",
            },
            { status: 401 }
        );
    }
}
