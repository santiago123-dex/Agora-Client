"use client";

import Image from "next/image";
import logo from "@/app/src/features/auth/components/assets/logo.png";
import backgroundFormLogin from "@/app/src/features/auth/components/assets/backgroundFormLogin.svg";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { login } from "@/app/src/lib/api/auth";
import { saveSessionInCookies } from "@/app/src/lib/auth/session-client";

export default function LoginForm() {
    const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const googleRedirectUri = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI;

    const router = useRouter();
    const searchParams = useSearchParams();
    const [formData, setFormData] = useState({
        identifier: "",
        password: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const registered = searchParams.get("registered") === "1";

    const handleGoogleLogin = () => {
        if (!googleClientId || !googleRedirectUri) {
            setError("Faltan las variables de entorno de Google OAuth.");
            return;
        }

        const state = crypto.randomUUID();
        sessionStorage.setItem("google_oauth_state", state);

        const params = new URLSearchParams({
            client_id: googleClientId,
            redirect_uri: googleRedirectUri,
            response_type: "code",
            scope: "openid email profile",
            state,
            access_type: "offline",
            prompt: "consent",
        });

        window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    };

    const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = async (event) => {
        // prevenir la recarga de la pagina 
        event.preventDefault();
        // establecer el estado de envio 
        setIsSubmitting(true);
        // limpiar errores 
        setError("");

        try {
            const response = await login(formData);
            const accessToken =
                response.accessToken ?? response.access_token ?? response.token;
            const refreshToken =
                response.refreshToken ?? response.refresh_token;

            if (!accessToken) {
                throw new Error("La respuesta del login no devolvió token");
            }

            await saveSessionInCookies({accessToken, refreshToken});
            router.push("/dashboard");
            router.refresh();
            
        } catch (err) {
            setError(err instanceof Error ? err.message : "No se pudo iniciar sesión");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-10">
            <Image
                src={backgroundFormLogin}
                alt=""
                fill
                priority
                aria-hidden="true"
                className="object-cover object-center"
            />

            <div className="z-10 w-full max-w-120 rounded-[1.6rem] bg-[#2c6888] px-6 py-10 text-white shadow-[0_24px_70px_rgba(16,57,80,0.28)] sm:px-7">
                <div className="flex flex-col items-center text-center">
                    <div className="flex items-center justify-center">
                        <Image
                            src={logo}
                            alt="Logo Agora"
                            className="h-18 w-28 object-contain brightness-1000"
                        />
                    </div>

                    <h1 className="text-[2rem] font-bold tracking-[0.08em]">AGORA</h1>
                    <p className="mt-2 text-2xl font-semibold">Bienvenidos a Agora</p>
                    <p className="mt-2 text-[1.9rem] font-bold leading-tight">
                        Login in your account to continue
                    </p>
                </div>

                <form className="mt-10 space-y-4" onSubmit={handleSubmit}>
                    <label className="block">
                        <span className="sr-only">Email</span>
                        <input
                            type="email"
                            name="identifier"
                            placeholder="Email"
                            value={formData.identifier}
                            onChange={(event) =>
                                setFormData((prev) => ({ ...prev, identifier: event.target.value }))
                            }
                            className="h-11 w-full rounded-lg border border-white/45 bg-transparent px-4 text-sm text-white outline-none placeholder:text-white/70 transition focus:border-white focus:ring-2 focus:ring-white/25"
                            required
                        />
                    </label>

                    <label className="block">
                        <span className="sr-only">Password</span>
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={(event) =>
                                setFormData((prev) => ({ ...prev, password: event.target.value }))
                            }
                            className="h-11 w-full rounded-lg border border-white/45 bg-transparent px-4 text-sm text-white outline-none placeholder:text-white/70 transition focus:border-white focus:ring-2 focus:ring-white/25"
                            required
                        />
                    </label>

                    {registered ? (
                        <p className="text-sm text-emerald-100">
                            Cuenta creada correctamente. Ahora inicia sesión.
                        </p>
                    ) : null}

                    {error ? <p className="text-sm text-rose-200">{error}</p> : null}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="mt-2 flex h-11 w-full cursor-pointer items-center justify-center rounded-full bg-white text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:bg-slate-200"
                    >
                        {isSubmitting ? "Signing in..." : "Sign In"}
                    </button>
                </form>

                <div className="mt-12 flex justify-center">
                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        className="inline-flex h-11 items-center justify-center gap-3 rounded-full bg-white px-5 text-sm font-medium text-slate-800 shadow-sm transition hover:bg-slate-100"
                    >
                        Continue with Google
                    </button>
                </div>
            </div>
        </section>
    );
}
