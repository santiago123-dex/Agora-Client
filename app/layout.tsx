import type { Metadata } from "next";
import { DM_Serif_Display, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
});

const dmSerifDisplay = DM_Serif_Display({
    subsets: ["latin"],
    weight: "400",
    variable: "--font-serif-display",
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
    <html lang="es" className={`h-full antialiased ${inter.variable} ${dmSerifDisplay.variable}`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
