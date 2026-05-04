"use client";

import { exchangeGoogleCode } from "@/app/src/lib/api/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { saveSessionInCookies } from "@/app/src/lib/auth/session-client";

export default function GoogleCallbackPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    // const hasRunRef = useRef(false);
    const [error, setError] = useState("");

    useEffect(() => {

        const handleGoogleCallback = async () => {
            const code = searchParams.get("code");
            const state = searchParams.get("state");
            const savedState = sessionStorage.getItem("google_oauth_state");

            if (state && savedState && state !== savedState) {
                setError("El estado de la solicitud no coincide");
                return;
            }

            if (!code) {
                setError("No se recibió el código de autorización");
                return;
            }

            try {
                const response = await exchangeGoogleCode({ code, state: state ?? undefined });

                await saveSessionInCookies({accessToken: response.access_token, refreshToken: response.refresh_token});

                sessionStorage.removeItem("google_oauth_state");

                router.push("/dashboard");
                // se usa refresh para que se actualice el estado de la aplicacion
                router.refresh();
            } catch (err) {
                setError(
                    err instanceof Error ? err.message : "Error desconocido al iniciar sesión con Google"
                );
            }
        };

        handleGoogleCallback();
    }, [router, searchParams]);

    return (
        <section className="flex min-h-screen items-center justify-center bg-white px-6">
            <div className="w-full max-w-md rounded-2xl bg-[#2c6888] p-8 text-center text-white shadow-xl">
                {error ? (
                    <>
                        <h1 className="text-2xl font-bold">Error en Google Login</h1>
                        <p className="mt-4 text-sm text-rose-100">{error}</p>
                    </>
                ) : (
                    <>
                        <h1 className="text-2xl font-bold">Conectando con Google...</h1>
                        <p className="mt-4 text-sm text-white/80">
                            Estamos completando tu inicio de sesión.
                        </p>
                    </>
                )}
            </div>
        </section>
    );
}
