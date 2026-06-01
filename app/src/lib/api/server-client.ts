import { getAccessTokenFromCookies } from "@/app/src/lib/auth/session-server";
import { refreshSession } from "@/app/src/lib/auth/refresh-session";
import { ApiError } from "./client";

const API_URL =
    process.env.NEXT_PUBLIC_GATEWAY_URL ??
    process.env.NEXT_PUBLIC_API_URL;

type ServerApiFetchOptions = RequestInit & {
    headers?: HeadersInit;
    refreshOnUnauthorized?: boolean;
};

export async function serverApiFetch<T>(
    path: string,
    options: ServerApiFetchOptions = {}
): Promise<T> {
    if (!API_URL) {
        throw new ApiError("API_URL no está configurada", 500);
    }

    const { headers, refreshOnUnauthorized = true, ...rest } = options;

    const makeRequest = async (token: string) => {
        const response = await fetch(`${API_URL}${path}`, {
            ...rest,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                ...(headers ?? {}),
            },
            cache: "no-store",
        });

        const data = await response.json().catch(() => null);

        return { response, data };
    };

    let token = await getAccessTokenFromCookies();

    if (!token) {
        throw new ApiError("No hay sesión activa", 401);
    }

    let { response, data } = await makeRequest(token);

    if (response.status === 401 && refreshOnUnauthorized) {
        const refreshed = await refreshSession();
        token = refreshed.access_token;

        const retry = await makeRequest(token);
        response = retry.response;
        data = retry.data;
    }

    if (!response.ok) {
        throw new ApiError(
            data?.message ?? "Ocurrió un error en la petición",
            response.status,
            data
        );
    }

    return data as T;
}
