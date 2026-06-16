import { getAccessTokenFromCookies } from "@/app/src/lib/auth/session-server";
import { refreshSession } from "@/app/src/lib/auth/refresh-session";
import { ApiError } from "./client";

import { GATEWAY_URL } from "./config";

type ServerApiFetchOptions = RequestInit & {
    headers?: HeadersInit;
    refreshOnUnauthorized?: boolean;
};

export async function serverApiFetch<T>(
    path: string,
    options: ServerApiFetchOptions = {}
): Promise<T> {
    if (!GATEWAY_URL) {
        throw new ApiError("GATEWAY_URL no está configurada", 500);
    }

    const { headers, refreshOnUnauthorized = true, ...rest } = options;

    const makeRequest = async (token: string) => {
        const response = await fetch(`${GATEWAY_URL}${path}`, {
            ...rest,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                ...(headers ?? {}),
            },
            cache: "no-store",
        });

        return response;
    };

    let token = await getAccessTokenFromCookies();

    if (!token) {
        throw new ApiError("No hay sesión activa", 401);
    }

    let response = await makeRequest(token);

    if (response.status === 401 && refreshOnUnauthorized) {
        const refreshed = await refreshSession();
        response = await makeRequest(refreshed.access_token);
    }

    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new ApiError(
            errorData?.message ?? "Ocurrió un error en la petición",
            response.status,
            errorData
        );
    }

    const data = await response.json().catch(() => null);
    return data as T;
}
