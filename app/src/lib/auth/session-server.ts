
import { cookies } from "next/headers";

export async function getAccessTokenFromCookies() {
    const cookieStore = await cookies();
    return cookieStore.get("agora_access_token")?.value;
}

export async function getRefreshTokenFromCookies() {
    const cookieStore = await cookies();
    return cookieStore.get("agora_refresh_token")?.value;
}