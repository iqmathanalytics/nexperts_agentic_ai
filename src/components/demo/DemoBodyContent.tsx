import { useEffect, useRef, useState } from "react";
import demoBodyHtml from "@/assets/demo-body-fragment.html?raw";
import DemoRegistrationModal from "@/components/demo/DemoRegistrationModal";
import type { DemoProgramme } from "@/lib/demo-sessions";

const DemoBodyContent = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [programme, setProgramme] = useState<DemoProgramme | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const fadeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add("visible"), i * 60);
          }
        });
      },
      { threshold: 0.08 },
    );
    el.querySelectorAll(".fade-in").forEach((node) => fadeObserver.observe(node));

    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const registerBtn = target.closest(".btn-register");
      if (registerBtn) {
        e.preventDefault();
        const card = registerBtn.closest(".demo-card");
        if (card?.classList.contains("vibe")) {
          setProgramme("vibe-coding-demo");
        } else {
          setProgramme("agentic-ai-demo");
        }
        setModalOpen(true);
        return;
      }

      const ucOpen = target.closest(".btn-uc-open");
      if (ucOpen) {
        e.preventDefault();
        document.getElementById("demos")?.scrollIntoView({ behavior: "smooth" });
      }
    };

    el.addEventListener("click", onClick);
    return () => {
      el.removeEventListener("click", onClick);
      fadeObserver.disconnect();
    };
  }, []);

  return (
    <>
      <div ref={containerRef} className="demo-body-root" dangerouslySetInnerHTML={{ __html: demoBodyHtml }} />
      <DemoRegistrationModal open={modalOpen} onOpenChange={setModalOpen} programme={programme} />
    </>
  );
};

export default DemoBodyContent;
