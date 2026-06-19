import type { Metadata } from "next";
import { Inter, DM_Serif_Display } from "next/font/google";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/app/src/lib/providers/ThemeProvider";
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
    <html lang="es" className={`h-full antialiased ${inter.variable} ${dmSerifDisplay.variable}`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          {children}
        </ThemeProvider>
        <Toaster
          position="top-right"
          richColors
          closeButton
          toastOptions={{ duration: 3000 }}
        />
      </body>
    </html>
  );
}
