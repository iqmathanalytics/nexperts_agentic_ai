import { useEffect } from "react";
import DemoNav from "@/components/demo/DemoNav";
import DemoBodyContent from "@/components/demo/DemoBodyContent";
import Footer from "@/components/landing/Footer";
import "@/styles/demo-page.css";
import "@/styles/demo-page-fixes.css";

const Demo = () => {
  useEffect(() => {
    window.scrollTo(0, 0);

    document.title = "See AI Work. Then Build It. — Nexperts AI Demos";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        "content",
        "Free live Agentic AI (20 Jun 2026) and Vibe Coding (21 Jun 2026) demos in Malaysia. Register for 2-hour Microsoft Teams sessions, 10AM–12PM MYT.",
      );
    }

    const fontHref =
      "https://fonts.googleapis.com/css2?family=Outfit:wght@200;300;400;500;600;700&family=Plus+Jakarta+Sans:ital,wght@0,200;0,300;0,400;0,500;1,300&display=swap";
    let link = document.querySelector('link[data-demo-fonts="true"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = fontHref;
      link.setAttribute("data-demo-fonts", "true");
      document.head.appendChild(link);
    }
  }, []);

  return (
    <div className="demo-page min-h-screen">
      <DemoNav />
      <DemoBodyContent />
      <Footer />
    </div>
  );
};

export default Demo;
