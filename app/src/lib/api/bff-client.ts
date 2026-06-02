import { clearSessionCookies } from "@/app/src/lib/auth/session-client";
import { ApiError } from "./client";

export async function bffFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    if (response.status === 401 && typeof window !== "undefined") {
      await clearSessionCookies().catch(() => null);
      window.location.href = "/auth/login";
    }

    throw new ApiError(
      data?.message ?? "Ocurrió un error en la petición",
      response.status,
      data,
    );
  }

  return data as T;
}
