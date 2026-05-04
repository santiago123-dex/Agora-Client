import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// respuesta de la peticion
type SessionBody = {
    accessToken: string;
    refreshToken?: string;
}

const cookieOptions = {
    // solo se puede acceder a la cookie desde el servidor
    httpOnly: true,
    // solo se puede acceder a la cookie desde https
    secure: process.env.NODE_ENV === "production",
    // controla cuándo el navegador envía la cookie si la petición viene desde otro sitio/origen.
    // esto quiere decir que lax no va a enviar la cookie si la peticion viene desde otro sitio
    sameSite: "lax" as const,
    // La cookie se envía en requests a cualquier ruta del dominio
    path: "/",
};

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
        ...cookieOptions,
        maxAge: 60 * 60,
    });

    if (body.refreshToken) {
        cookieStore.set("agora_refresh_token", body.refreshToken, {
            ...cookieOptions,
            maxAge: 60 * 60 * 24 * 30,
        });
    }

    return NextResponse.json({ ok: true });
}

export async function DELETE() {
    const cookieStore = await cookies();

    cookieStore.set("agora_access_token", "", {
        ...cookieOptions,
        maxAge: 0,
    });

    cookieStore.set("agora_refresh_token", "", {
        ...cookieOptions,
        maxAge: 0,
    });

    return NextResponse.json({ ok: true });
}



