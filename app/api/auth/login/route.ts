import { NextResponse } from "next/server";
import { serverLogin } from "@/app/src/lib/api/auth-server";
import { ApiError } from "@/app/src/lib/api/client";
import type { LoginPayload } from "@/app/src/lib/api/auth";

export async function POST(request: Request) {
    try {
        const body = (await request.json()) as LoginPayload;
        const response = await serverLogin(body);

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
