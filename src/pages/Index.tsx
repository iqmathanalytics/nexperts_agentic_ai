import { useEffect } from "react";

const Index = () => {
  useEffect(() => {
    document.title =
      "Professional Agentic AI Engineering — Nexperts Academy Malaysia";
    const meta =
      document.querySelector('meta[name="description"]') ||
      Object.assign(document.createElement("meta"), { name: "description" });
    meta.setAttribute(
      "content",
      "Live, instructor-led Agentic AI Engineering programme in Malaysia. 20 sessions, 80 hours, founding cohort RM 1,899."
    );
    if (!meta.parentNode) document.head.appendChild(meta);
  }, []);

  return (
    <main className="h-screen w-screen">
      <h1 className="sr-only">
        Professional Agentic AI Engineering — Nexperts Academy Malaysia
      </h1>
      <iframe
        src="/landing.html"
        title="Professional Agentic AI Engineering Course"
        className="h-full w-full border-0"
      />
    </main>
  );
};

export default Index;
