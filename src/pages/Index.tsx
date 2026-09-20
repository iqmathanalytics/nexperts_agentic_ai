import { lazy, Suspense, useEffect } from "react";
import Nav from "@/components/landing/Nav";
import Hero from "@/components/landing/Hero";
import Stats from "@/components/landing/Stats";
import Enquire from "@/components/landing/Enquire";
import Footer from "@/components/landing/Footer";
import { LazyWhenVisible } from "@/components/perf/LazyWhenVisible";
import { useReveal } from "@/hooks/useReveal";
import { useLandingAnalytics } from "@/hooks/useLandingAnalytics";
import {
  LANDING_CANONICAL_URL,
  LANDING_META_DESCRIPTION,
  LANDING_PAGE_TITLE,
  LANDING_ROBOTS,
} from "@/lib/landing-seo";

const HackathonShowcase = lazy(() => import("@/components/landing/HackathonShowcase"));
const LiveDemoSection = lazy(() => import("@/components/landing/LiveDemoSection"));
const WhoCanJoin = lazy(() => import("@/components/landing/WhoCanJoin"));
const Objectives = lazy(() => import("@/components/landing/Objectives"));
const Curriculum = lazy(() => import("@/components/landing/Curriculum"));
const Outcomes = lazy(() => import("@/components/landing/Outcomes"));
const About = lazy(() => import("@/components/landing/About"));
const FAQ = lazy(() => import("@/components/landing/FAQ"));

const SectionFallback = ({ h = 420 }: { h?: number }) => (
  <div className="w-full bg-transparent" style={{ minHeight: h }} aria-hidden />
);

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

        <LazyWhenVisible minHeight={560} rootMargin="280px 0px">
          <Suspense fallback={<SectionFallback h={560} />}>
            <HackathonShowcase />
          </Suspense>
        </LazyWhenVisible>

        <LazyWhenVisible minHeight={720} rootMargin="280px 0px">
          <Suspense fallback={<SectionFallback h={720} />}>
            <LiveDemoSection />
          </Suspense>
        </LazyWhenVisible>

        <LazyWhenVisible minHeight={480}>
          <Suspense fallback={<SectionFallback />}>
            <WhoCanJoin />
          </Suspense>
        </LazyWhenVisible>

        <LazyWhenVisible minHeight={480}>
          <Suspense fallback={<SectionFallback />}>
            <Objectives />
          </Suspense>
        </LazyWhenVisible>

        <LazyWhenVisible minHeight={520}>
          <Suspense fallback={<SectionFallback h={520} />}>
            <Curriculum />
          </Suspense>
        </LazyWhenVisible>

        <LazyWhenVisible minHeight={420}>
          <Suspense fallback={<SectionFallback />}>
            <Outcomes />
          </Suspense>
        </LazyWhenVisible>

        <LazyWhenVisible minHeight={520}>
          <Suspense fallback={<SectionFallback h={520} />}>
            <About />
          </Suspense>
        </LazyWhenVisible>

        <LazyWhenVisible minHeight={480}>
          <Suspense fallback={<SectionFallback />}>
            <FAQ />
          </Suspense>
        </LazyWhenVisible>

        {/* Keep enquire in the initial tree so #enquire CTAs always resolve */}
        <Enquire />
      </main>
      <Footer />
    </>
  );
};

export default Index;
