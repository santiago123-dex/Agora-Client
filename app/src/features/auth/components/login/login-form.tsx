import Image from "next/image";
import logo from "@/app/src/features/auth/components/assets/logo.png"
import backgroundFormLogin from "@/app/src/features/auth/components/assets/backgroundFormLogin.svg"
import Link from "next/link";


const fields = [
    { label: "Email", type: "email", name: "email" },
    { label: "Password", type: "password", name: "password" },
];

export default function LoginForm() {
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
                        Login in your account to continue
                    </p>
                </div>

                <form className="mt-10 space-y-4">
                    {fields.map((field) => (
                        <label key={field.name} className="block">
                            <span className="sr-only">{field.label}</span>
                            <input
                                type={field.type}
                                name={field.name}
                                placeholder={field.label}
                                className="h-11 w-full rounded-lg border border-white/45 bg-transparent px-4 text-sm text-white outline-none placeholder:text-white/70 transition focus:border-white focus:ring-2 focus:ring-white/25"
                            />
                        </label>
                    ))}

                    <div className="mt-2 h-11 w-full rounded-full bg-white text-sm font-medium text-slate-700 transition hover:bg-slate-100 flex cursor-pointer">
                        <Link href="/dashboard" className="w-full text-center h-full flex justify-center items-center">

                            Sign In

                        </Link>
                    </div>
                </form>

                <div className="mt-12 flex justify-center">
                    <Link href="/">
                        <button
                            type="button"
                            className="inline-flex h-11 items-center justify-center gap-3 rounded-full bg-white px-5 text-sm font-medium text-slate-800 shadow-sm transition hover:bg-slate-100"
                        >
                            <span className="text-xl leading-none">
                                <span className="text-[#EA4335]">G</span>
                                <span className="text-[#FBBC05]">o</span>
                                <span className="text-[#34A853]">o</span>
                                <span className="text-[#4285F4]">g</span>
                                <span className="text-[#EA4335]">l</span>
                                <span className="text-[#4285F4]">e</span>
                            </span>
                            Continue with Google
                        </button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
