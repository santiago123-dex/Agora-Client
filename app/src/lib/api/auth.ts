import { apiFetch } from "./client";

export type LoginPayload = {
    identifier: string;
    password: string;
};

export type LogoutPayload = {
    refresh_token: string;
}

export type RegisterPayload = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
};

export type LoginResponse = {
    token?: string;
    accessToken?: string;
    access_token?: string;
    refreshToken?: string;
    refresh_token?: string;
    [key: string]: unknown;
};

export type GoogleCodeExchangePayload = {
    code: string;
    state?: string;
};

export type GoogleCodeExchangeResponse = {
    access_token: string;
    refresh_token: string;
    token_type: string;
    expires_in: number;
    session_id: string;
};

export type RefreshTokenPayload = {
    refresh_token: string;
};

export type RefreshTokenResponse = {
    access_token: string;
    refresh_token?: string;
    token_type: string;
    expires_in: number;
};

export async function refreshAccessToken(payload: RefreshTokenPayload) {
    return apiFetch<RefreshTokenResponse>("/public/auth/refresh", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export async function login(payload: LoginPayload) {
    return apiFetch<LoginResponse>("/public/auth/authenticate", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export async function register(payload: RegisterPayload) {
    return apiFetch<void>("/users/create", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export async function exchangeGoogleCode(payload: GoogleCodeExchangePayload) {
    return apiFetch<GoogleCodeExchangeResponse>("/public/auth/google/callback", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export async function logout(payload: LogoutPayload){
    return apiFetch<void>("/public/auth/logout", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}
