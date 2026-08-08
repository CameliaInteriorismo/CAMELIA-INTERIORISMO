import { Hero } from "@/features/home/Hero";
import { AnimatedPhrase } from "@/features/home/AnimatedPhrase";
import { ServiceTabs } from "@/features/home/ServiceTabs";
import { DetailGrid } from "@/features/home/DetailGrid";
import { Testimonials } from "@/features/home/Testimonials";
import { CtaBanner } from "@/features/home/CtaBanner";
import { PartnerLogos } from "@/features/home/PartnerLogos";

export default function Home() {
  return (
    <>
      <Hero />
      <AnimatedPhrase />
      <ServiceTabs />
      <DetailGrid />
      <Testimonials />
      <CtaBanner />
      <PartnerLogos />
    </>
  );
}
