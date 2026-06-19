"use client";

import Link from "next/link";

const tourNavLinks = [
    {
        label: "Dashboard",
        href: "/demo?step=1",
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
        href: "/demo?step=2",
        svg: (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 7v14" />
                <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
            </svg>
        ),
    },
    {
        label: "Analíticas",
        href: "/demo?step=5",
        svg: (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 3v18h18" />
                <path d="m19 9-5 5-4-4-3 3" />
            </svg>
        ),
    },
    {
        label: "Calendario",
        href: "/demo?step=5",
        svg: (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 2v4" />
                <path d="M16 2v4" />
                <rect width="18" height="18" x="3" y="4" rx="2" />
                <path d="M3 10h18" />
            </svg>
        ),
    },
    {
        label: "Gradebook",
        href: "/demo?step=5",
        svg: (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <path d="M14 2v6h6" />
                <path d="M16 13H8" />
                <path d="M16 17H8" />
                <path d="M10 9H8" />
            </svg>
        ),
    },
    {
        label: "Configuración",
        href: "/demo?step=5",
        svg: (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
        ),
    },
];

export default function DemoLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-[#0b1120] lg:flex-row">
            <aside className="hidden bg-[#275D79] lg:flex lg:min-h-screen lg:w-60 lg:shrink-0 lg:flex-col">
                <div className="flex h-16 items-center gap-2 border-b border-white/10 px-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15 text-lg font-bold text-white">A</div>
                    <h2 className="text-lg font-semibold text-white">Agora</h2>
                </div>

                <div className="flex flex-1 flex-col px-3 py-4">
                    <div className="flex flex-col gap-2">
                        {tourNavLinks.map((link) => (
                            <Link
                                key={`${link.href}-${link.label}`}
                                href={link.href}
                                className="inline-flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/90 transition-colors hover:bg-white/15 hover:text-white"
                            >
                                {link.svg}
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    <div className="mt-auto border-t border-white/10 px-1 py-4">
                        <div className="flex items-center gap-3 rounded-xl px-2 py-2 text-white">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#3f7a99] text-sm font-semibold">
                                SF
                            </div>
                            <div className="min-w-0">
                                <p className="truncate text-sm font-medium">Sofia Fernández</p>
                                <p className="truncate text-xs text-white/65">sofia@demo.edu</p>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            <div className="flex flex-1 flex-col">
                <header className="sticky top-0 z-30 bg-slate-50 dark:bg-[#0b1120]">
                    <nav className="flex h-14 items-center gap-3 border-b border-[#ededed] px-4 dark:border-[#1e293b] sm:h-16 sm:px-6">
                        <span className="text-[18px] font-semibold text-[#275D79] dark:text-[#7BB8D4]">Agora</span>

                        <div className="ml-auto flex items-center gap-2">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#dadada] dark:border-slate-600">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
                                    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                                    <line x1="12" y1="19" x2="12" y2="22" />
                                </svg>
                            </div>
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#dadada] dark:border-slate-600">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
                                    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                                    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                                </svg>
                            </div>
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#275D79] bg-[#275D79]">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 8V4H8" />
                                    <rect width="16" height="12" x="4" y="8" rx="2" />
                                    <path d="M2 14h2" />
                                    <path d="M20 14h2" />
                                    <path d="M15 13v2" />
                                    <path d="M9 13v2" />
                                </svg>
                            </div>
                        </div>
                    </nav>
                </header>

                <main className="flex-1">{children}</main>
            </div>
        </div>
    );
}
