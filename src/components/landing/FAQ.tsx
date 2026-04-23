import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { WHATSAPP_HREF } from "@/lib/whatsapp";

const faqs = [
  { q: "I have zero Python experience. Can I still join?", a: "Yes — sessions 1–3 cover Python from scratch, focused specifically on what you need for AI engineering. You don't need prior Python, but you do need basic programming knowledge in any language." },
  { q: "Will I get a recording if I miss a session?", a: "Yes, all sessions are recorded and shared within 24 hours. However, this is a live, intensive programme — we strongly recommend attending live to do the exercises in real-time alongside the instructor." },
  { q: "What happens after I complete the programme?", a: "You receive a Professional Certificate, lifetime access to materials, and entry into our private alumni community. We also help connect strong graduates with hiring partners." },
  { q: "Why is the limited offer RM 399 (excluding 8% SST) when the international rate is RM 12,000+?", a: "We're building our first community of AI engineers in Malaysia. In exchange for your commitment, attendance and feedback, you get the international curriculum at a nominal fee. Future cohorts will be priced at RM 4,000+." },
  { q: "Is this programme HRDC claimable?", a: "We are working on HRDC accreditation for future cohorts. The founding cohort price is set independently of HRDC funding to keep it accessible." },
  { q: "What's the refund policy?", a: "Full refund within 7 days of payment if you haven't attended more than 2 sessions. After that, we work with you on case-by-case basis but cannot guarantee refunds given the small cohort size." },
  { q: "What hardware do I need?", a: "Any laptop (Windows, macOS or Linux) with at least 8GB RAM and stable internet. We use cloud platforms (Azure, OpenAI, HuggingFace) so heavy local compute is not required." },
  { q: "Will I be able to find a job after this?", a: "We don't guarantee jobs — no honest course can. What we guarantee is that you'll leave with deployable skills, a portfolio project, and a professional certificate that demonstrates real capability to employers." },
];

const FAQ = () => {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="px-[5vw] py-20 md:py-24 bg-paper">
      <div className="grid lg:grid-cols-[1fr_2fr] gap-10 lg:gap-16 items-start">
        <div className="reveal lg:sticky lg:top-24">
          <div className="eyebrow mb-3.5">Frequently Asked</div>
          <h2 className="display text-foreground text-balance">
            Questions you<br /><em>probably have.</em>
          </h2>
          <p className="body-prose mt-4">
            Still unsure? <a href={WHATSAPP_HREF} target="_blank" rel="noopener" className="text-primary underline underline-offset-4 hover:text-primary-glow">Message us on WhatsApp</a> — we usually reply within an hour.
          </p>
        </div>

        <div className="reveal">
          <div className="border-t border-border">
            {faqs.map((f, i) => {
              const isOpen = open === i;
              return (
                <div key={i} className="border-b border-border">
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="w-full flex items-start justify-between gap-6 text-left py-5 group"
                  >
                    <span className={`text-base font-medium leading-snug transition-colors ${isOpen ? "text-primary" : "text-foreground group-hover:text-primary"}`}>
                      {f.q}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 mt-1.5 shrink-0 transition-transform ${isOpen ? "rotate-180 text-primary" : "text-ink-faint"}`}
                    />
                  </button>
                  <div
                    className="overflow-hidden transition-all duration-500"
                    style={{ maxHeight: isOpen ? "400px" : "0px" }}
                  >
                    <p className="pb-5 pr-10 text-sm font-light text-ink-muted leading-[1.8]">{f.a}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
