import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
    subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Agora",
  description: "Plataforma de Gestion de tareas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`h-full antialiased ${inter.className}`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
