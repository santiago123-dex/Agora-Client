"use client";

import Image from "next/image";
import logo from "@/app/src/features/auth/components/assets/logo.png"
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { register } from "@/app/src/lib/api/auth";
import { Eye, EyeOff, Loader2, Lock, Mail, User, UserRound } from "lucide-react";

export default function RegisterForm() {

  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const googleRedirectUri = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI;

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const handleGoogleRegister = () => {
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
  }

  const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      await register(formData);
      router.push("/auth/login?registered=1");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo crear la cuenta");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="auth-page relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-[#dceef5] px-6 py-10 dark:bg-slate-950">
            <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-[#275D79]/10 blur-3xl dark:opacity-20" />
            <div className="absolute -bottom-16 right-12 h-56 w-56 rounded-full bg-[#9DC2F8]/20 blur-3xl dark:opacity-20" />
            <div className="absolute -right-12 top-1/3 h-80 w-80 rounded-full bg-[#275D79]/8 blur-3xl dark:opacity-20" />

      <div className="z-10 w-full max-w-md rounded-2xl border border-slate-200/50 bg-white/80 px-8 py-10 shadow-[0_2px_0_0_rgba(39,93,121,0.12),0_24px_70px_rgba(16,57,80,0.1)] backdrop-blur-xl dark:border-slate-700/50 dark:bg-slate-900/80 sm:px-10">
        <div className="flex flex-col items-center text-center">
          <Image
            src={logo}
            alt="Logo Agora"
            className="logo-light h-16 w-24 object-contain"
          />

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-[#275D79]">
            AGORA
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Creá tu cuenta para empezar
          </p>
        </div>

        {error ? (
          <p className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm text-red-600">
            {error}
          </p>
        ) : null}

        <form className="mt-7 space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="reg-firstname" className="mb-1.5 block text-sm font-medium text-slate-700">
                Nombre
              </label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="reg-firstname"
                  type="text"
                  name="firstName"
                  placeholder="Santiago"
                  value={formData.firstName}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, firstName: event.target.value }))
                  }
                  required
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#275D79] focus:bg-white focus:ring-2 focus:ring-[#275D79]/15"
                  autoComplete="given-name"
                />
              </div>
            </div>
            <div>
              <label htmlFor="reg-lastname" className="mb-1.5 block text-sm font-medium text-slate-700">
                Apellido
              </label>
              <div className="relative">
                <UserRound className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="reg-lastname"
                  type="text"
                  name="lastName"
                  placeholder="Fajardo"
                  value={formData.lastName}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, lastName: event.target.value }))
                  }
                  required
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#275D79] focus:bg-white focus:ring-2 focus:ring-[#275D79]/15"
                  autoComplete="family-name"
                />
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="reg-email" className="mb-1.5 block text-sm font-medium text-slate-700">
              Correo electrónico
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                id="reg-email"
                type="email"
                name="email"
                placeholder="tu@email.com"
                value={formData.email}
                onChange={(event) =>
                  setFormData((prev) => ({ ...prev, email: event.target.value }))
                }
                required
                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#275D79] focus:bg-white focus:ring-2 focus:ring-[#275D79]/15"
                autoComplete="email"
              />
            </div>
          </div>

          <div>
            <label htmlFor="reg-password" className="mb-1.5 block text-sm font-medium text-slate-700">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                id="reg-password"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(event) =>
                  setFormData((prev) => ({ ...prev, password: event.target.value }))
                }
                required
                minLength={6}
                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-10 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#275D79] focus:bg-white focus:ring-2 focus:ring-[#275D79]/15"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400 hover:text-slate-600"
                tabIndex={-1}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#275D79] text-sm font-semibold text-white shadow-md transition hover:bg-[#1f4a61] disabled:cursor-not-allowed disabled:bg-[#7ba2b4] disabled:shadow-none"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creando cuenta...
              </>
            ) : (
              "Crear cuenta"
            )}
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-3 text-slate-400 dark:bg-slate-900">O registrate con</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGoogleRegister}
          className="inline-flex h-11 w-full cursor-pointer items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Google
          </button>

        <p className="mt-8 text-center text-sm text-slate-500">
          ¿Ya tenés cuenta?{" "}
          <Link href="/auth/login" className="font-semibold text-[#275D79] hover:text-[#1f4a61] dark:text-[#7BB8D4] dark:hover:text-[#9DD0E8]">
            Iniciar sesión
          </Link>
        </p>
      </div>
    </section>
  );
}
