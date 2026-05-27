"use client";

import Image from "next/image";
import logo from "@/app/src/features/auth/components/assets/logo.png"
import backgroundFormRegister from "@/app/src/features/auth/components/assets/backgroundFormRegister.svg"
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { register } from "@/app/src/lib/api/auth";

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
    // prevenir la recarga de la pagina 
    event.preventDefault();
    // establecer el estado de envio 
    setIsSubmitting(true);
    // limpiar errores 
    setError("");

    try {
      await register(formData);
      // redirigir al login con un mensaje de exito
      router.push("/auth/login?registered=1");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo crear la cuenta");
    } finally {
      setIsSubmitting(false);
    }

  }

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-10">
      <Image
        src={backgroundFormRegister}
        alt=""
        fill
        priority
        aria-hidden="true"
        className="object-cover object-center"
      />

      <div className="absolute -left-24 top-20 h-80 w-80 rounded-full bg-white/70 blur-3xl" />
      <div className="absolute bottom-12 left-1/5 h-64 w-64 rounded-full bg-[#9DC2F8]/50 blur-3xl" />
      <div className="absolute -right-10 top-1/3 h-96 w-96 rounded-full bg-[#6eaef6]/30 blur-3xl" />

      <div className=" z-10 w-full max-w-120 rounded-[1.6rem] bg-[#2c6888] px-6 py-10 text-white shadow-[0_24px_70px_rgba(16,57,80,0.28)] sm:px-7">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center justify-center ">
            <Image
              src={logo}
              alt="Logo Agora"
              className="h-18 w-28 object-contain brightness-1000"
            />


          </div>

          <h1 className="text-[2rem] font-bold tracking-[0.08em]">
            AGORA
          </h1>
          <p className="mt-2 text-2xl font-semibold">Bienvenidos a Agora</p>
          <p className="mt-2 text-[1.9rem] font-bold leading-tight">
            Create your account
          </p>
        </div>

        <form className="mt-10 space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="sr-only">First name</span>
            <input
              type="text"
              name="firstName"
              placeholder="First name"
              value={formData.firstName}
              onChange={(event) =>
                // prev es el estado anterior
                // lo copia y cambia el valor de firstName
                setFormData((prev) => ({ ...prev, firstName: event.target.value }))
              }
              required
              className="h-11 w-full rounded-lg border border-white/45 bg-transparent px-4 text-sm text-white outline-none placeholder:text-white/70 transition focus:border-white focus:ring-2 focus:ring-white/25"
            />
          </label>
          <label className="block">
            <span className="sr-only">Last name</span>
            <input
              type="text"
              name="lastName"
              placeholder="Last name"
              value={formData.lastName}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, lastName: event.target.value }))
              }
              required
              className="h-11 w-full rounded-lg border border-white/45 bg-transparent px-4 text-sm text-white outline-none placeholder:text-white/70 transition focus:border-white focus:ring-2 focus:ring-white/25"
            />
          </label>
          <label className="block">
            <span className="sr-only">Email</span>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, email: event.target.value }))
              }
              required
              className="h-11 w-full rounded-lg border border-white/45 bg-transparent px-4 text-sm text-white outline-none placeholder:text-white/70 transition focus:border-white focus:ring-2 focus:ring-white/25"
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
              required
              className="h-11 w-full rounded-lg border border-white/45 bg-transparent px-4 text-sm text-white outline-none placeholder:text-white/70 transition focus:border-white focus:ring-2 focus:ring-white/25"
            />
          </label>
          {error ? <p className="text-sm text-rose-200">{error}</p> : null}
          <div className="mt-2 h-11 w-full text-sm font-medium text-slate-700 flex">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex h-11 w-full cursor-pointer items-center justify-center rounded-full bg-white text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:bg-slate-200"
            >
                {isSubmitting ? "Creating account..." : "Create account"}
            </button>
          </div>
        </form>

        <div className="mt-12 flex justify-center">
            <button
              type="button"
              onClick={handleGoogleRegister}
              className="inline-flex h-11 items-center justify-center gap-3 rounded-full bg-white px-5 text-sm font-medium text-slate-800 shadow-sm transition hover:bg-slate-100"
            >
              Continue with Google
            </button>
        </div>
      </div>
    </section>
  );
}
