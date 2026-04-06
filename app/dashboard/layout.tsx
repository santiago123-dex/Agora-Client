"use client";

import Image from "next/image";
import logo from "@/public/images/logo.png"
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";


    const navLinks = [
    {label : "Dashboard", href : "/dashboard", svg: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-layout-dashboard-icon lucide-layout-dashboard"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>},
    {label : "Mis Espacios", href: "/dashboard/workspace", svg: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-book-open-icon lucide-book-open"><path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/></svg>},
    {label : "Configurarion", href : "/dashboard/configuration", svg: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-cog-icon lucide-cog"><path d="M11 10.27 7 3.34"/><path d="m11 13.73-4 6.93"/><path d="M12 22v-2"/><path d="M12 2v2"/><path d="M14 12h8"/><path d="m17 20.66-1-1.73"/><path d="m17 3.34-1 1.73"/><path d="M2 12h2"/><path d="m20.66 17-1.73-1"/><path d="m20.66 7-1.73 1"/><path d="m3.34 17 1.73-1"/><path d="m3.34 7 1.73 1"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="12" r="8"/></svg> }
    
];

export default function LayoutDashboard({
    children,
}: Readonly<{
    children : React.ReactNode;
}>) {

    const pathname = usePathname();

  return (
    <div className="min-h-screen flex">
        <aside className="lg:min-w-60 bg-[#275D79]">
            <div className="flex items-center text-center h-16 px-2 border-b border-[#ededed]/10">
                <Image 
                    src={logo}
                    alt="Logo Agora"
                    className="h-11 w-18 brightness-1000"
                />
                <h2 className="text-white font-bold text-xl">Agora</h2>
            </div>
            <div className="flex flex-col py-4 px-2">
                {navLinks.map((link) =>{
                    const isActive = pathname == link.href;

                    return (
                        <Link
                        key={link.href}
                        href={link.href}
                        className={`flex gap-2 px-3 py-3 rounded-lg${
                            isActive ? "bg-white text-white font-semibold"
                            : "bg-white text-white hover:text-white"
                        }`}>
                        {link.svg}
                        {link.label}
                        </Link>
                    )
                })}
            </div>
        </aside>
        <div className="flex-1">
            <header className="">
                <nav className="border-b border-[#ededed] h-16 flex items-center px-7">
                    <input type="text" className="w-[30%] text-[#275d79] box-border py-1 px-6 border border-[#dadada] rounded-md bg-[#ddecf1] placeholder:text-[#275D79] focus:border-[#dadada] focus:outline-none focus:ring-0" placeholder="/Configuration"/>
                </nav>
            </header>
            <main>{children}</main>
        </div>
    </div>
  )
}
