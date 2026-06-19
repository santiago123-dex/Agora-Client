"use client";

import Image from "next/image";
import logo from "@/app/src/features/auth/components/assets/logo.png";
import { exchangeGoogleCode } from "@/app/src/lib/api/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { saveSessionInCookies } from "@/app/src/lib/auth/session-client";
import { Loader2 } from "lucide-react";

function CallbackCard() {
    return (
        <section className="auth-page relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-[#dceef5] px-6 py-10">
            <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-[#275D79]/10 blur-3xl" />
            <div className="absolute -bottom-16 right-12 h-56 w-56 rounded-full bg-[#9DC2F8]/20 blur-3xl" />
            <div className="absolute -right-12 top-1/3 h-80 w-80 rounded-full bg-[#275D79]/8 blur-3xl" />

            <div className="z-10 w-full max-w-md rounded-[1.6rem] border border-slate-200/50 bg-white/80 px-8 py-12 shadow-[0_2px_0_0_rgba(39,93,121,0.12),0_24px_70px_rgba(16,57,80,0.1)] backdrop-blur-xl">
                <div className="flex flex-col items-center text-center">
                    <Image src={logo} alt="Logo Agora" className="logo-light h-16 w-24 object-contain" />

                    <h1 className="mt-4 text-[1.8rem] font-bold tracking-[0.06em] text-[#275D79]">AGORA</h1>

                    <Loader2 className="mt-8 h-8 w-8 animate-spin text-[#275D79]" />
                    <p className="mt-4 text-sm text-slate-500">Conectando con Google...</p>
                </div>
            </div>
        </section>
    );
}

function GoogleCallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        let cancelled = false;

        const handleGoogleCallback = async () => {
            const code = searchParams.get("code");
            const state = searchParams.get("state");
            const savedState = sessionStorage.getItem("google_oauth_state");

            if (state && savedState && state !== savedState) {
                sessionStorage.removeItem("google_oauth_state");
                if (!cancelled) router.push(`/auth/login?google_error=${encodeURIComponent("La solicitud no coincide")}`);
                return;
            }

            if (!code) {
                sessionStorage.removeItem("google_oauth_state");
                if (!cancelled) router.push(`/auth/login?google_error=${encodeURIComponent("No se recibió el código de autorización")}`);
                return;
            }

            try {
                const response = await exchangeGoogleCode({ code, state: state ?? undefined });

                await saveSessionInCookies({
                    accessToken: response.access_token,
                    refreshToken: response.refresh_token,
                });

                sessionStorage.removeItem("google_oauth_state");

                if (!cancelled) {
                    router.push("/dashboard");
                    router.refresh();
                }
            } catch (err) {
                const msg = err instanceof Error ? err.message : "Error al iniciar sesión con Google";
                if (!cancelled) router.push(`/auth/login?google_error=${encodeURIComponent(msg)}`);
            }
        };

        handleGoogleCallback();

        return () => { cancelled = true; };
    }, [router, searchParams]);

    return <CallbackCard />;
}

export default function GoogleCallbackPage() {
    return (
        <Suspense fallback={<CallbackCard />}>
            <GoogleCallbackContent />
        </Suspense>
    );
}
