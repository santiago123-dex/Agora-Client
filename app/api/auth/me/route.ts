import { NextResponse } from "next/server";
import { serverApiFetch } from "@/app/src/lib/api/server-client";

export async function GET() {
    try {
        const data = await serverApiFetch("/users/get-user", {
            method: "GET",
        });

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(
            {
                message:
                    error instanceof Error
                        ? error.message
                        : "No se pudo obtener el usuario",
            },
            { status: 401 }
        );
    }
}
