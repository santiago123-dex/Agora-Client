"use client";

import Image from "next/image";
import logo from "@/public/images/logo-cropped.png";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import {
  BarChart3,
  Bell,
  BookOpen,
  Bot,
  Calendar,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  LayoutDashboard as LayoutDashboardIcon,
  LogOut,
  Menu,
  Moon,
  NotebookText,
  Settings,
  Sun,
  X,
} from "lucide-react";
import { clearSessionCookies } from "@/app/src/lib/auth/session-client";
import { UserContext } from "@/app/src/lib/contexts/UserContext";
import type { CurrentUser } from "@/app/src/lib/contexts/UserContext";
import { useThemeContext } from "@/app/src/lib/providers/ThemeProvider";
import NotificationBell from "@/app/src/features/dashboard/components/dashboardPage/NotificationBell/notificationBell";
import FirstTimeModal from "@/app/src/features/dashboard/components/onboarding/FirstTimeModal";
import { GradingProvider } from "../src/lib/contexts/GradingContext";

const AiChatPanel = dynamic(
  () => import("@/app/src/features/dashboard/components/ai-chat/AiChatPanel"),
  { ssr: false },
);

const navLinks: Array<{
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: number }>;
}> = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboardIcon,
  },
  {
    label: "Mis Espacios",
    href: "/dashboard/workspace",
    icon: BookOpen,
  },
  {
    label: "Analíticas",
    href: "/dashboard/analytics",
    icon: BarChart3,
  },
  {
    label: "Calendario",
    href: "/dashboard/calendar",
    icon: Calendar,
  },
  {
    label: "Gradebook",
    href: "/dashboard/gradebook",
    icon: NotebookText,
  },
  {
    label: "Notificaciones",
    href: "/dashboard/notifications",
    icon: Bell,
  },
  {
    label: "Configuración",
    href: "/dashboard/configuration",
    icon: Settings,
  },
  {
    label: "Suscripción",
    href: "/dashboard/suscription",
    icon: CreditCard,
  },
];

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
  const firstName =
    user.firstName ?? user.first_name ?? user.profile?.firstName;
  const lastName = user.lastName ?? user.last_name ?? user.profile?.lastName;
  const name =
    user.fullName ??
    user.profile?.fullName ??
    user.name ??
    [firstName, lastName].filter(Boolean).join(" ");

  const profile = (rawUser as Record<string, unknown>).profile as
    | Record<string, unknown>
    | undefined;
  const config = profile?.config as Record<string, unknown> | undefined;
  const theme = (config?.theme as string | undefined) ?? "light";
  const avatarUrl =
    (rawUser as Record<string, unknown>).avatarUrl as string | undefined ??
    (profile?.avatarUrl as string | undefined);

  return {
    ...user,
    firstName,
    lastName,
    email: user.email ?? user.profile?.email,
    name,
    theme,
    avatarUrl,
  };
}

function SidebarUserBlock({
  user,
  isLoggingOut,
  onLogout,
  collapsed,
}: {
  user: CurrentUser | null;
  isLoggingOut: boolean;
  onLogout: () => Promise<void>;
  collapsed?: boolean;
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
    <div className="mt-auto border-t border-white/10 px-1 py-4 dark:border-white/10">
      <div className="flex items-center gap-3 rounded-xl px-2 py-2 text-white">
        <div className={`h-10 w-10 shrink-0 ${user?.avatarUrl ? "" : "flex items-center justify-center rounded-full bg-[#3f7a99] text-sm font-semibold"}`}>
          {user?.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={displayName}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            initials
          )}
        </div>

        <div className={`min-w-0 transition-opacity duration-200 ${collapsed ? "lg:opacity-0 lg:group-hover/sidebar:opacity-100" : ""}`}>
          <p className="truncate text-sm font-medium">{displayName}</p>
          <p className="truncate text-xs text-white/65">{displayEmail}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={onLogout}
        disabled={isLoggingOut}
        className={`mt-3 inline-flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm text-white/85 transition hover:bg-white/10 hover:text-white disabled:opacity-60 ${collapsed ? "lg:justify-center lg:group-hover/sidebar:justify-start" : ""}`}
      >
        <LogOut size={16} />
        <span className={`transition-opacity duration-200 ${collapsed ? "lg:hidden lg:group-hover/sidebar:inline" : ""}`}>
          {isLoggingOut ? "Cerrando..." : "Cerrar Sesión"}
        </span>
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
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const autoCollapsedRef = useRef(false);
  const { theme, toggleTheme } = useThemeContext();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    if (isAiOpen && !autoCollapsedRef.current) {
      const wide = window.innerWidth >= 1440;
      if (!wide) {
        setSidebarCollapsed(true);
      }
      autoCollapsedRef.current = true;
    }
    if (!isAiOpen) {
      autoCollapsedRef.current = false;
    }
  }, [isAiOpen]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMobileMenuOpen]);

  const loadCurrentUser = useCallback(async () => {
    try {
      setIsLoadingUser(true);

      const response = await fetch("/api/auth/me", {
        method: "GET",
        cache: "no-store",
        credentials: "same-origin",
      });

      const data = await response.json().catch(() => null);

      if (response.status === 401) {
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
  }, []);

  useEffect(() => {
    loadCurrentUser();
  }, [loadCurrentUser]);

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
          className={`group/link relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
            isActive
              ? "bg-white font-semibold text-[#275D79] shadow-sm dark:bg-white dark:text-[#275D79]"
              : "text-white/90 hover:bg-white/15 hover:text-white"
          }`}
        >
          {isActive && (
            <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.5 rounded-r-full bg-white" />
          )}
          <span className="shrink-0">
            {link.icon ? <link.icon size={18} /> : null}
          </span>
          <span className={`transition-opacity duration-200 ${!isMobile && sidebarCollapsed ? "lg:opacity-0 lg:group-hover/sidebar:opacity-100" : ""}`}>
            {link.label}
          </span>
        </Link>
      );
    });

  return (
    <UserContext.Provider
      value={{ user, isLoadingUser, refreshUser: loadCurrentUser }}
    >
      <GradingProvider>
        <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-[#0b1120] lg:flex-row">
            <aside
            className={`hidden bg-[#275D79] lg:flex lg:min-h-screen lg:flex-col transition-all duration-300 overflow-hidden group/sidebar dark:bg-[#141f33] dark:border-r dark:border-[#253245] ${sidebarCollapsed ? "lg:w-16" : "lg:w-60"} shrink-0`}
            >
            <Link
              href="/"
              className="flex h-16 items-center gap-2 border-b border-white/10 px-4 dark:border-[#253245]"
            >
              <Image
                src={logo}
                alt="Logo Agora"
                className="h-9 w-9 shrink-0 object-contain brightness-1000"
              />
              <h2 className={`text-lg font-semibold text-white transition-opacity duration-200 dark:text-white ${sidebarCollapsed ? "lg:opacity-0 lg:group-hover/sidebar:opacity-100" : ""}`}>Agora</h2>
            </Link>

            <div className="flex flex-1 flex-col px-3 py-4">
              <div className="flex flex-col gap-2">{renderNavLinks()}</div>

              {!isLoadingUser && (
                <SidebarUserBlock
                  user={user}
                  isLoggingOut={isLoggingOut}
                  onLogout={handleLogout}
                  collapsed={sidebarCollapsed}
                />
              )}
            </div>
          </aside>

          <div
            className={`flex-1 min-w-0 transition-all duration-300 ${isAiOpen ? "lg:mr-[420px]" : ""}`}
          >
            <header className={`sticky top-0 z-30 transition-shadow duration-300 bg-slate-50 dark:bg-[#0b1120] ${scrolled ? "shadow-sm" : "shadow-none"}`}>
              <nav className="flex h-14 items-center gap-3 border-b border-[#ededed] px-4 dark:border-[#1e293b] sm:h-16 sm:px-6">
                <button
                  type="button"
                  aria-label={
                    isMobileMenuOpen
                      ? "Cerrar menú lateral"
                      : "Abrir menú lateral"
                  }
                  aria-expanded={isMobileMenuOpen}
                  //Esto es para accesibilidad, le dice al lector de pantalla que este boton controla el menu lateral
                  aria-controls="mobile-dashboard-menu"
                  onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-[#dadada] bg-white text-[#275D79] dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 lg:hidden"
                >
                  {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const willExpand = sidebarCollapsed;
                    setSidebarCollapsed(!sidebarCollapsed);
                    if (willExpand && isAiOpen) setIsAiOpen(false);
                  }}
                  className="hidden h-10 w-10 items-center justify-center rounded-md border border-[#dadada] bg-white text-[#275D79] transition hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 lg:inline-flex"
                  aria-label={
                    sidebarCollapsed
                      ? "Expandir menú lateral"
                      : "Colapsar a iconos"
                  }
                >
                  {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                </button>

                <span className="text-[18px] font-semibold text-[#275D79] sm:hidden">
                  Agora
                </span>

                <div className="ml-auto flex items-center gap-2">
                  <button
                    type="button"
                    onClick={toggleTheme}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#dadada] bg-white text-[#275D79] hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
                    aria-label="Cambiar tema"
                  >
                    <Sun size={18} className="hidden dark:block" />
                  <Moon size={18} className="dark:hidden" />
                  </button>
                  <NotificationBell />
                  <button
                    type="button"
                    onClick={() => setIsAiOpen((prev) => !prev)}
                    className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border transition ${
                      isAiOpen
                        ? "border-[#275D79] bg-[#275D79] text-white dark:border-[#275D79] dark:bg-[#275D79]"
                        : "border-[#dadada] bg-white text-[#275D79] hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
                    }`}
                    aria-label={
                      isAiOpen ? "Cerrar asistente" : "Abrir asistente"
                    }
                  >
                    <Bot size={18} />
                  </button>
                </div>
              </nav>
            </header>

            <main className="animate-page-in">{children}</main>
          </div>

          <div
            className={`fixed inset-0 z-40 bg-black/35 transition-opacity duration-300 lg:hidden ${
              isMobileMenuOpen ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />

          <aside
            id="mobile-dashboard-menu"
            aria-hidden={!isMobileMenuOpen}
            className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[82vw] bg-[#275D79] shadow-2xl transition-transform duration-300 ease-in-out dark:bg-[#141f33] dark:border-r dark:border-[#253245] lg:hidden ${
              isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
              <Link href="/" className="flex items-center gap-2">
                <Image
                  src={logo}
                  alt="Logo Agora"
                className="h-9 w-9 shrink-0 object-contain brightness-1000"
                />
                <h2 className="text-lg font-semibold text-white">Agora</h2>
              </Link>

              <button
                type="button"
                aria-label="Cerrar menú lateral"
                onClick={() => setIsMobileMenuOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/20 text-white"
              >
                <X size={17} />
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

          <AiChatPanel
            isOpen={isAiOpen}
            onClose={() => setIsAiOpen(false)}
            workspaceId={(() => {
              const m = pathname.match(/^\/dashboard\/workspace\/(\d+)/);
              return m ? m[1] : undefined;
            })()}
          />
          <FirstTimeModal />
        </div>
      </GradingProvider>
    </UserContext.Provider>
  );
}
