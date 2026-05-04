import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { logout } from "@/app/src/lib/api/auth";
import { authCookieOptions } from "@/app/src/lib/auth/cookie-options";

export async function POST() {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("agora_refresh_token")?.value;

    try {
        if (refreshToken) {
            await logout({
                refresh_token: refreshToken,
            });
        }
    } catch {
    } finally {
        cookieStore.set("agora_access_token", "", {
            ...authCookieOptions,
            maxAge: 0,
        });

        cookieStore.set("agora_refresh_token", "", {
            ...authCookieOptions,
            maxAge: 0,
        });
    }

    return NextResponse.json({ ok: true });
}
