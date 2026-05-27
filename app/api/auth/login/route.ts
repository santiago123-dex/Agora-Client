import { NextResponse } from "next/server";
import { login, type LoginPayload } from "@/app/src/lib/api/auth";
import { ApiError } from "@/app/src/lib/api/client";

export async function POST(request: Request) {
    try {
        const body = (await request.json()) as LoginPayload;
        const response = await login(body);

        return NextResponse.json(response);
    } catch (error) {
        const status = error instanceof ApiError ? error.status : 500;

        return NextResponse.json(
            {
                message:
                    error instanceof Error
                        ? error.message
                        : "No se pudo iniciar sesión",
            },
            { status }
        );
    }
}
