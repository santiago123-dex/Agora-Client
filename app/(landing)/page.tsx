import NavbarLanding from "@/app/src/features/landing/components/navbar/navbar";
import HeroSection from "@/app/src/features/landing/components/hero/hero-section";
import FeatureSection from "../src/features/landing/components/features/features-section";
import ProcessSection from "../src/features/landing/components/process/process-section";
import CtaSection from "../src/features/landing/components/cta/cta-section";
import FooterSection from "../src/features/landing/components/footer/footer-section";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-950">
      <NavbarLanding />
      <main className="mx-auto flex w-full flex-col pt-12 lg:pt-16">
        <HeroSection />
        <FeatureSection></FeatureSection>
        <ProcessSection></ProcessSection>
        <CtaSection></CtaSection>
      </main>
      <FooterSection />
    </div>
  );
}
