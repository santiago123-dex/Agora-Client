import { NextResponse } from "next/server";
import { serverApiFetch } from "@/app/src/lib/api/server-client";
import { ApiError } from "@/app/src/lib/api/client";

export async function GET() {
  try {
    const data = await serverApiFetch("/payment/products", {
      method: "GET",
    });
    return NextResponse.json(data);
  } catch (error) {
    const status = error instanceof ApiError ? error.status : 500;
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "No se pudieron obtener los productos",
      },
      { status },
    );
  }
}
