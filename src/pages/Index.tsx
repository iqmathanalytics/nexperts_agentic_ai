import { useEffect } from "react";
import Nav from "@/components/landing/Nav";
import Hero from "@/components/landing/Hero";
import Stats from "@/components/landing/Stats";
import LiveDemoSection from "@/components/landing/LiveDemoSection";
import WhoCanJoin from "@/components/landing/WhoCanJoin";
import Objectives from "@/components/landing/Objectives";
import Curriculum from "@/components/landing/Curriculum";
import Outcomes from "@/components/landing/Outcomes";
import About from "@/components/landing/About";
import FAQ from "@/components/landing/FAQ";
import Enquire from "@/components/landing/Enquire";
import Footer from "@/components/landing/Footer";
import { useReveal } from "@/hooks/useReveal";

const Index = () => {
  useReveal();

  useEffect(() => {
    document.title = "Professional Agentic AI Engineering — Nexperts Academy Malaysia";
    const ensureMeta = (name: string, content: string) => {
      let m = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
      if (!m) {
        m = document.createElement("meta");
        m.name = name;
        document.head.appendChild(m);
      }
      m.content = content;
    };
    ensureMeta(
      "description",
      "Live, instructor-led Agentic AI Engineering programme in Malaysia. 20 sessions, 80 hours. Limited offer RM 399 (excluding 8% SST) — save RM 11,601."
    );
    ensureMeta("viewport", "width=device-width, initial-scale=1");
  }, []);

  return (
    <>
      <Nav />
      <main className="min-w-0 overflow-x-hidden">
        <Hero />
        <Stats />
        <LiveDemoSection />
        <WhoCanJoin />
        <Objectives />
        <Curriculum />
        <Outcomes />
        <About />
        <FAQ />
        <Enquire />
      </main>
      <Footer />
    </>
  );
};

export default Index;
