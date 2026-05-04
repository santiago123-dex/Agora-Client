import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { logout } from "@/app/src/lib/api/auth";

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
};

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
            ...cookieOptions,
            maxAge: 0,
        });

        cookieStore.set("agora_refresh_token", "", {
            ...cookieOptions,
            maxAge: 0,
        });
    }

    return NextResponse.json({ ok: true });
}
