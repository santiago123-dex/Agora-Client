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

  if (!response.ok) {
    if (response.status === 401 && typeof window !== "undefined") {
      await clearSessionCookies().catch(() => null);
      window.location.href = "/auth/login";
    }

    const errorData = await response.json().catch(() => null);
    throw new ApiError(
      errorData?.message ?? "Ocurrió un error en la petición",
      response.status,
      errorData,
    );
  }

  const data = await response.json().catch(() => null);
  return data as T;
}
