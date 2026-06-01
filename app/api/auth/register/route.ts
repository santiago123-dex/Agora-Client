import { NextResponse } from "next/server";
import { register, type RegisterPayload } from "@/app/src/lib/api/auth";
import { ApiError } from "@/app/src/lib/api/client";

export async function POST(request: Request) {
    try {
        const body = (await request.json()) as RegisterPayload;
        await register(body);

        return NextResponse.json({ ok: true }, { status: 201 });
    } catch (error) {
        const status = error instanceof ApiError ? error.status : 500;

        return NextResponse.json(
            {
                message:
                    error instanceof Error
                        ? error.message
                        : "No se pudo crear la cuenta",
            },
            { status }
        );
    }
}
