


type SaveSessionParams = {
    accessToken: string;
    refreshToken?: string;
};

export async function saveSessionInCookies({
    accessToken,
    refreshToken,
}: SaveSessionParams) {
    const response = await fetch("/api/auth/session", {
        method: "POST",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            accessToken,
            refreshToken,
        }),
    });

    if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.message ?? "No se pudo guardar la sesión");
    }

    return response.json();
}

export async function clearSessionCookies() {
    const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "same-origin",
    });

    if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.message ?? "No se pudo cerrar la sesión");
    }

    return response.json();
}
