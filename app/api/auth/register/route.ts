import { NextResponse } from "next/server";
import { register, type RegisterPayload } from "@/app/src/lib/api/auth";

export async function POST(request: Request) {
    try {
        const body = (await request.json()) as RegisterPayload;
        await register(body);

        return NextResponse.json({ ok: true }, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            {
                message:
                    error instanceof Error
                        ? error.message
                        : "No se pudo crear la cuenta",
            },
            { status: 400 }
        );
    }
}
