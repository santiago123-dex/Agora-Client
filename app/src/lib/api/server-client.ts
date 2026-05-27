import { getAccessTokenFromCookies } from "@/app/src/lib/auth/session-server";
import { refreshSession } from "@/app/src/lib/auth/refresh-session";

const API_URL =
    process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL;

type ServerApiFetchOptions = RequestInit & {
    headers?: HeadersInit;
};

export async function serverApiFetch<T>(
    path: string,
    options: ServerApiFetchOptions = {}
): Promise<T> {
    if (!API_URL) {
        throw new Error("API_URL no está configurada");
    }

    const { headers, ...rest } = options;

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
        throw new Error("No hay sesión activa");
    }

    let { response, data } = await makeRequest(token);

    if (response.status === 401) {
        const refreshed = await refreshSession();
        token = refreshed.access_token;

        const retry = await makeRequest(token);
        response = retry.response;
        data = retry.data;
    }

    if (!response.ok) {
        throw new Error(data?.message ?? "Ocurrió un error en la petición");
    }

    return data as T;
}
