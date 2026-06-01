import { NextResponse } from "next/server";
import { serverApiFetch } from "@/app/src/lib/api/server-client";
import { ApiError } from "@/app/src/lib/api/client";

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
        const status = error instanceof ApiError ? error.status : 500;

        return NextResponse.json(
            {
                message:
                    error instanceof Error
                        ? error.message
                        : "No se pudo obtener el usuario",
            },
            { status }
        );
    }
}
