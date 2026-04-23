import { useEffect } from "react";
import Nav from "@/components/landing/Nav";
import Hero from "@/components/landing/Hero";
import Stats from "@/components/landing/Stats";
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
      "Live, instructor-led Agentic AI Engineering programme in Malaysia. 20 sessions, 80 hours. Founding cohort RM 1,899 — save 97% off market rate."
    );
    ensureMeta("viewport", "width=device-width, initial-scale=1");
  }, []);

  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Stats />
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
