import { NextResponse } from "next/server";
import { serverApiFetch } from "@/app/src/lib/api/server-client";
import { getAccessTokenFromCookies } from "@/app/src/lib/auth/session-server";

export async function GET() {
    const accessToken = await getAccessTokenFromCookies();

    if (!accessToken) {
        return NextResponse.json(
            { message: "No hay sesión activa" },
            { status: 401 }
        );
    }

    try {
        const data = await serverApiFetch("/users/get-user", {
            method: "GET",
            refreshOnUnauthorized: false,
        });

        return NextResponse.json(data);
    } catch (error) {
        console.error("No se pudo obtener el usuario actual", error);

        return NextResponse.json({
            name: "Usuario",
            email: null,
            profileUnavailable: true,
        });
    }
}
