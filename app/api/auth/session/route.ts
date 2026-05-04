import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { authCookieOptions } from "@/app/src/lib/auth/cookie-options";
// respuesta de la peticion
type SessionBody = {
    accessToken: string;
    refreshToken?: string;
}

//handler para request http POST
export async function POST(request: Request) {

    const body = (await request.json()) as SessionBody;
    const cookieStore = await cookies();

    if (!body.accessToken) {
        return NextResponse.json(
            { message: "accessToken es requerido" },
            { status: 400 }
        );
    }

    cookieStore.set("agora_access_token", body.accessToken, {
        ...authCookieOptions,
        maxAge: 60 * 60,
    });

    if (body.refreshToken) {
        cookieStore.set("agora_refresh_token", body.refreshToken, {
            ...authCookieOptions,
            maxAge: 60 * 60 * 24 * 30,
        });
    }

    return NextResponse.json({ ok: true });
}

export async function DELETE() {
    const cookieStore = await cookies();

    cookieStore.set("agora_access_token", "", {
        ...authCookieOptions,
        maxAge: 0,
    });

    cookieStore.set("agora_refresh_token", "", {
        ...authCookieOptions,
        maxAge: 0,
    });

    return NextResponse.json({ ok: true });
}



