import { useEffect } from "react";
import Nav from "@/components/landing/Nav";
import Hero from "@/components/landing/Hero";
import Stats from "@/components/landing/Stats";
import HackathonShowcase from "@/components/landing/HackathonShowcase";
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
import { useLandingAnalytics } from "@/hooks/useLandingAnalytics";
import {
  LANDING_CANONICAL_URL,
  LANDING_META_DESCRIPTION,
  LANDING_PAGE_TITLE,
  LANDING_ROBOTS,
} from "@/lib/landing-seo";

const Index = () => {
  useReveal();
  useLandingAnalytics();

  useEffect(() => {
    document.title = LANDING_PAGE_TITLE;

    const ensureMeta = (name: string, content: string) => {
      let m = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
      if (!m) {
        m = document.createElement("meta");
        m.name = name;
        document.head.appendChild(m);
      }
      m.content = content;
    };

    const ensureLink = (rel: string, href: string) => {
      let link = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement("link");
        link.rel = rel;
        document.head.appendChild(link);
      }
      link.href = href;
    };

    ensureMeta("description", LANDING_META_DESCRIPTION);
    ensureMeta("robots", LANDING_ROBOTS);
    ensureLink("canonical", LANDING_CANONICAL_URL);

    for (const [property, content] of [
      ["og:title", LANDING_PAGE_TITLE],
      ["og:description", LANDING_META_DESCRIPTION],
      ["og:url", LANDING_CANONICAL_URL],
    ] as const) {
      let m = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null;
      if (!m) {
        m = document.createElement("meta");
        m.setAttribute("property", property);
        document.head.appendChild(m);
      }
      m.content = content;
    }
  }, []);

  return (
    <>
      <Nav />
      <main className="min-w-0 overflow-x-hidden">
        <Hero />
        <Stats />
        <HackathonShowcase />
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
