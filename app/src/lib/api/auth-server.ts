import { apiFetch } from "./client";
import type {
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  LogoutPayload,
  GoogleCodeExchangePayload,
  GoogleCodeExchangeResponse,
  RefreshTokenPayload,
  RefreshTokenResponse,
} from "./auth";

export async function serverLogin(payload: LoginPayload) {
  return apiFetch<LoginResponse>("/public/auth/authenticate", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function serverRegister(payload: RegisterPayload) {
  return apiFetch<void>("/users/create", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function serverExchangeGoogleCode(
  payload: GoogleCodeExchangePayload,
) {
  return apiFetch<GoogleCodeExchangeResponse>("/public/auth/google/callback", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function serverLogout(payload: LogoutPayload) {
  return apiFetch<void>("/public/auth/logout", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function serverRefreshAccessToken(
  payload: RefreshTokenPayload,
) {
  return apiFetch<RefreshTokenResponse>("/public/auth/refresh", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
