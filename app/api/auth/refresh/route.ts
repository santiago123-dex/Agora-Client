import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { refreshAccessToken } from "@/app/src/lib/api/auth";

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
};

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
        const response = await refreshAccessToken({
            refresh_token: refreshToken,
        });

        cookieStore.set("agora_access_token", response.access_token, {
            ...cookieOptions,
            maxAge: 60 * 60,
        });

        if (response.refresh_token) {
            cookieStore.set("agora_refresh_token", response.refresh_token, {
                ...cookieOptions,
                maxAge: 60 * 60 * 24 * 30,
            });
        }

        return NextResponse.json({ ok: true });
    } catch (error) {
        cookieStore.set("agora_access_token", "", {
            ...cookieOptions,
            maxAge: 0,
        });

        cookieStore.set("agora_refresh_token", "", {
            ...cookieOptions,
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
