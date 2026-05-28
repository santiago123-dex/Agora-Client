"use client";

import Image from "next/image";
import logo from "@/public/images/logo-cropped.png";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { clearSessionCookies } from "@/app/src/lib/auth/session-client";

const navLinks = [
  {
    label: "Dashboard",
    href: "/dashboard",
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="7" height="9" x="3" y="3" rx="1" />
        <rect width="7" height="5" x="14" y="3" rx="1" />
        <rect width="7" height="9" x="14" y="12" rx="1" />
        <rect width="7" height="5" x="3" y="16" rx="1" />
      </svg>
    ),
  },
  {
    label: "Mis Espacios",
    href: "/dashboard/workspace",
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 7v14" />
        <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
      </svg>
    ),
  },
  {
    label: "Configuración",
    href: "/dashboard/configuration",
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 10.27 7 3.34" />
        <path d="m11 13.73-4 6.93" />
        <path d="M12 22v-2" />
        <path d="M12 2v2" />
        <path d="M14 12h8" />
        <path d="m17 20.66-1-1.73" />
        <path d="m17 3.34-1 1.73" />
        <path d="M2 12h2" />
        <path d="m20.66 17-1.73-1" />
        <path d="m20.66 7-1.73 1" />
        <path d="m3.34 17 1.73-1" />
        <path d="m3.34 7 1.73 1" />
        <circle cx="12" cy="12" r="2" />
        <circle cx="12" cy="12" r="8" />
      </svg>
    ),
  },
  {
    label: "Suscripción",
    href: "/dashboard/suscription",
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
        <line x1="1" y1="10" x2="23" y2="10" />
      </svg>
    ),
  },
];

type CurrentUser = {
  fullName?: string;
  firstName?: string;
  lastName?: string;
  first_name?: string;
  last_name?: string;
  name?: string;
  email?: string;
  username?: string;
  profileUnavailable?: boolean;
  profile?: {
    fullName?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
  };
};


function normalizeCurrentUser(data: unknown): CurrentUser | null {
  if (!data || typeof data !== "object") {
    return null;
  }

  const payload = data as { user?: unknown; data?: unknown };
  const rawUser =
    payload.user && typeof payload.user === "object"
      ? payload.user
      : payload.data && typeof payload.data === "object"
        ? payload.data
        : data;

  const user = rawUser as CurrentUser;
  const firstName = user.firstName ?? user.first_name ?? user.profile?.firstName;
  const lastName = user.lastName ?? user.last_name ?? user.profile?.lastName;
  const name =
    user.fullName ??
    user.profile?.fullName ??
    user.name ??
    [firstName, lastName].filter(Boolean).join(" ");

  return {
    ...user,
    firstName,
    lastName,
    email: user.email ?? user.profile?.email,
    name,
  };
}


function SidebarUserBlock({
  user,
  isLoggingOut,
  onLogout,
}: {
  user: CurrentUser | null;
  isLoggingOut: boolean;
  onLogout: () => Promise<void>;
}) {
  const displayName =
    user?.fullName ||
    user?.name ||
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    user?.username ||
    "Usuario";

  const displayEmail = user?.email || "Sin correo";

  const initials = useMemo(() => {
    const source =
      user?.fullName ||
      user?.name ||
      [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
      user?.email ||
      "U";

    return source
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("");
  }, [user]);

  return (
    <div className="mt-auto border-t border-white/10 px-1 py-4">
      <div className="flex items-center gap-3 rounded-xl px-2 py-2 text-white">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#3f7a99] text-sm font-semibold">
          {initials}
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{displayName}</p>
          <p className="truncate text-xs text-white/65">{displayEmail}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={onLogout}
        disabled={isLoggingOut}
        className="mt-3 inline-flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm text-white/85 transition hover:bg-white/10 hover:text-white disabled:opacity-60"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m9 21 6-6-6-6" />
          <path d="M15 15H3" />
          <path d="M3 3h12a2 2 0 0 1 2 2v4" />
        </svg>
        {isLoggingOut ? "Cerrando..." : "Cerrar Sesión"}
      </button>
    </div>
  );
}

export default function LayoutDashboard({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const router = useRouter();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);


  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        setIsLoadingUser(true);

        const response = await fetch("/api/auth/me", {
          method: "GET",
          cache: "no-store",
        });

        const data = await response.json().catch(() => null);

        if(response.status === 401){
          await clearSessionCookies();
          router.push("/auth/login");
          router.refresh();
          return;
        }

        if (!response.ok) {
          throw new Error(data?.message ?? "No se pudo cargar el usuario");
        }

        setUser(normalizeCurrentUser(data));
      } catch {
        setUser(null);
      } finally {
        setIsLoadingUser(false);
      }
    };

    loadCurrentUser();
  }, []);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await clearSessionCookies();
      router.push("/auth/login");
      router.refresh();
    } finally {
      setIsLoggingOut(false);
    }
  };

  const renderNavLinks = (isMobile = false) =>
    navLinks.map((link) => {
      const isActive = pathname === link.href;

      return (
        <Link
          key={link.href}
          href={link.href}
          onClick={isMobile ? () => setIsMobileMenuOpen(false) : undefined}
          className={`inline-flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${isActive
              ? "bg-white text-[#275D79] font-semibold"
              : "text-white/90 hover:bg-white/15 hover:text-white"
            }`}
        >
          {link.svg}
          {link.label}
        </Link>
      );
    });

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 lg:flex-row">
      <aside className="hidden bg-[#275D79] lg:flex lg:min-h-screen lg:w-60 lg:shrink-0 lg:flex-col">
        <Link href="/" className="flex h-16 items-center gap-2 border-b border-white/10 px-4">
          <Image src={logo} alt="Logo Agora" className="h-9 w-9 shrink-0 object-contain brightness-1000" />
          <h2 className="text-lg font-semibold text-white">Agora</h2>
        </Link>

        <div className="flex flex-1 flex-col px-3 py-4">
          <div className="flex flex-col gap-2">{renderNavLinks()}</div>

          {!isLoadingUser && (
            <SidebarUserBlock
              user={user}
              isLoggingOut={isLoggingOut}
              onLogout={handleLogout}
            />
          )}
        </div>
      </aside>

      <div className="flex-1">
        <header className="sticky top-0 z-30 bg-slate-50">
          <nav className="flex h-14 items-center gap-3 border-b border-[#ededed] px-4 sm:h-16 sm:px-6">
            <button
              type="button"
              aria-label={isMobileMenuOpen ? "Cerrar menú lateral" : "Abrir menú lateral"}
              aria-expanded={isMobileMenuOpen}
              //Esto es para accesibilidad, le dice al lector de pantalla que este boton controla el menu lateral
              aria-controls="mobile-dashboard-menu"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-[#dadada] bg-white text-[#275D79] lg:hidden"
            >
              {isMobileMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 12h16" />
                  <path d="M4 6h16" />
                  <path d="M4 18h16" />
                </svg>
              )}
            </button>

            <span className="text-[18px] font-semibold text-[#275D79] sm:hidden">Agora</span>
          </nav>
        </header>

        <main>{children}</main>
      </div>

      <div
        className={`fixed inset-0 z-40 bg-black/35 transition-opacity duration-300 lg:hidden ${isMobileMenuOpen ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        onClick={() => setIsMobileMenuOpen(false)}
        aria-hidden="true"
      />

      <aside
        id="mobile-dashboard-menu"
        aria-hidden={!isMobileMenuOpen}
        className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[82vw] bg-[#275D79] shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
          <Link href="/" className="flex items-center gap-2">
            <Image src={logo} alt="Logo Agora" className="h-9 w-9 shrink-0 object-contain brightness-1000" />
            <h2 className="text-lg font-semibold text-white">Agora</h2>
          </Link>

          <button
            type="button"
            aria-label="Cerrar menú lateral"
            onClick={() => setIsMobileMenuOpen(false)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/20 text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        <div className="flex h-[calc(100%-4rem)] flex-col px-3 py-4">
          <div className="flex flex-col gap-2">{renderNavLinks(true)}</div>

          {!isLoadingUser && (
            <SidebarUserBlock
              user={user}
              isLoggingOut={isLoggingOut}
              onLogout={handleLogout}
            />
          )}
        </div>
      </aside>
    </div>
  );
}
