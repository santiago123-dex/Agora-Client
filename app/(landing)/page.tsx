import type { Metadata } from "next";
import NavbarLanding from "@/app/src/features/landing/components/navbar/navbar";
import HeroSection from "@/app/src/features/landing/components/hero/hero-section";
import FeatureSection from "@/app/src/features/landing/components/features/features-section";
import ProcessSection from "@/app/src/features/landing/components/process/process-section";
import PricingSection from "@/app/src/features/landing/components/pricing/pricing-section";
import DemoSections from "@/app/src/features/landing/components/demo/demo-section";
import TestimonialsSection from "@/app/src/features/landing/components/testimonials/testimonials-section";
import ContactSection from "@/app/src/features/landing/components/contact/contact-section";
import CtaSection from "@/app/src/features/landing/components/cta/cta-section";
import FooterSection from "@/app/src/features/landing/components/footer/footer-section";
import ScrollReveal from "@/app/src/features/landing/components/ScrollReveal";

export const metadata: Metadata = {
    title: "Agora — Plataforma educativa con IA",
    description:
        "Crea espacios de trabajo, asigná tareas y calificá automáticamente con IA. La plataforma educativa que transforma tu forma de enseñar.",
    openGraph: {
        title: "Agora — Plataforma educativa con IA",
        description:
            "Crea espacios de trabajo, asigná tareas y calificá automáticamente con IA.",
        url: "https://agora.app",
        siteName: "Agora",
        locale: "es_AR",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Agora — Plataforma educativa con IA",
        description:
            "Crea espacios de trabajo, asigná tareas y calificá automáticamente con IA.",
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-white text-slate-950 landing-page">
            <NavbarLanding />
            <main className="mx-auto flex w-full flex-col">
                <HeroSection />
                <div className="meander-divider" />
                <ScrollReveal><FeatureSection /></ScrollReveal>
                <div className="meander-divider" />
                <ScrollReveal><ProcessSection /></ScrollReveal>
                <div className="meander-divider" />
                <ScrollReveal><DemoSections /></ScrollReveal>
                <div className="meander-divider" />
                <ScrollReveal><PricingSection /></ScrollReveal>
                <div className="meander-divider" />
                <ScrollReveal><TestimonialsSection /></ScrollReveal>
                <div className="meander-divider" />
                <ScrollReveal><ContactSection /></ScrollReveal>
                <ScrollReveal><CtaSection /></ScrollReveal>
            </main>
            <FooterSection />
        </div>
    );
}
