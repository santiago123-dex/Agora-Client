import { NextResponse } from "next/server";
import { serverRegister } from "@/app/src/lib/api/auth-server";
import { ApiError } from "@/app/src/lib/api/client";
import type { RegisterPayload } from "@/app/src/lib/api/auth";

export async function POST(request: Request) {
    try {
        const body = (await request.json()) as RegisterPayload;
        await serverRegister(body);

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
