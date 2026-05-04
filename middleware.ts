import { NextRequest, NextResponse } from "next/server";


const PUBLIC_AUTH_ROUTES = ["/auth/login", "/auth/register" ];
const PROTECTED_ROUTES = ["/dashboard"];

export function middleware(request: NextRequest){

   const { pathname } = request.nextUrl;

    const accessToken = request.cookies.get("agora_access_token")?.value;
    const isAuthenticated = Boolean(accessToken);

    const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
        pathname.startsWith(route)
    );

    const isPublicAuthRoute = PUBLIC_AUTH_ROUTES.some((route) =>
        pathname.startsWith(route)
    );

    if (isProtectedRoute && !isAuthenticated) {
        return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    if (isPublicAuthRoute && isAuthenticated) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();

}

export const config = {
    matcher: ["/dashboard/:path*", "/auth/login", "/auth/register"],
}