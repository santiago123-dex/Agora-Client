import { NextResponse } from "next/server";
import { login, type LoginPayload } from "@/app/src/lib/api/auth";

export async function POST(request: Request) {
    try {
        const body = (await request.json()) as LoginPayload;
        const response = await login(body);

        return NextResponse.json(response);
    } catch (error) {
        return NextResponse.json(
            {
                message:
                    error instanceof Error
                        ? error.message
                        : "No se pudo iniciar sesión",
            },
            { status: 401 }
        );
    }
}
