import { cookies } from "next/headers";
import { refreshAccessToken } from "@/app/src/lib/api/auth";
import { authCookieOptions } from "@/app/src/lib/auth/cookie-options";

export async function refreshSession() {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("agora_refresh_token")?.value;

    if (!refreshToken) {
        throw new Error("No hay refresh token disponible");
    }

    try {
        const response = await refreshAccessToken({
            refresh_token: refreshToken,
        });

        cookieStore.set("agora_access_token", response.access_token, {
            //opciones de configuracion de la cookie
            ...authCookieOptions,
            //la cookie expira en 1 hora
            maxAge: 60 * 60,
        });

        if (response.refresh_token) {
            cookieStore.set("agora_refresh_token", response.refresh_token, {
                ...authCookieOptions,
                maxAge: 60 * 60 * 24 * 30,
            });
        }

        return response;
    } catch (error) {
        cookieStore.set("agora_access_token", "", {
            ...authCookieOptions,
            maxAge: 0,
        });

        cookieStore.set("agora_refresh_token", "", {
            ...authCookieOptions,
            maxAge: 0,
        });

        throw error;
    }
}
