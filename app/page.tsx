import { HeroSection } from "./components/sections/HeroSection";
import { StatsSection } from "./components/sections/StatsSection";
import { FeaturesSection } from "./components/sections/FeaturesSection";
import { HowItWorksSection } from "./components/sections/HowItWorksSection";
import { CTASection } from "./components/sections/CTASection";

export default function Home() {
  return (
    <main className="flex flex-col items-center min-h-screen bg-white">
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <HowItWorksSection />
      <CTASection />
    </main>
  );
}
