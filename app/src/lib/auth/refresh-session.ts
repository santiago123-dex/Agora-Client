import { cookies } from "next/headers";
import { refreshAccessToken } from "@/app/src/lib/api/auth";

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
};

export async function refreshSession() {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("agora_refresh_token")?.value;

    if (!refreshToken) {
        throw new Error("No hay refresh token disponible");
    }

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

    return response;
}
