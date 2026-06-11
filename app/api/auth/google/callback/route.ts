import { NextResponse } from "next/server";
import { serverExchangeGoogleCode } from "@/app/src/lib/api/auth-server";
import type { GoogleCodeExchangePayload } from "@/app/src/lib/api/auth";

export async function POST(request: Request) {
    try {
        const body = (await request.json()) as GoogleCodeExchangePayload;
        const response = await serverExchangeGoogleCode(body);

        return NextResponse.json(response);
    } catch (error) {
        return NextResponse.json(
            {
                message:
                    error instanceof Error
                        ? error.message
                        : "Error desconocido al iniciar sesión con Google",
            },
            { status: 400 }
        );
    }
}
