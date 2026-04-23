import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { toast } from "sonner";

const Enquire = () => {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") || "").trim();
    const phone = String(fd.get("phone") || "").trim();
    const email = String(fd.get("email") || "").trim();

    if (!name || !phone || !email.includes("@")) {
      toast.error("Please fill in your name, phone and a valid email.");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setDone(true);
      toast.success("Enquiry received — we'll be in touch within 24 hours.");
    }, 700);
  };

  return (
    <section id="enquire" className="px-[5vw] py-20 md:py-28 bg-obsidian relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-50" />
      <div className="absolute -top-32 left-1/3 w-[500px] h-[500px] rounded-full pointer-events-none"
           style={{ background: "radial-gradient(circle, hsl(var(--primary-glow) / 0.15), transparent 65%)" }} />

      <div className="relative max-w-5xl mx-auto grid lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-16 items-start">
        <div className="reveal">
          <div className="flex items-center gap-2.5 mb-4">
            <span className="w-3.5 h-px bg-primary-glow/60" />
            <span className="font-mono text-[0.62rem] font-semibold tracking-[0.2em] uppercase text-primary-glow">
              Reserve Your Seat
            </span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-light text-white leading-[1.05] mb-5 text-balance">
            Founding cohort.<br />
            <em className="not-italic italic text-primary-glow">Limited seats.</em>
          </h2>
          <p className="text-base font-light text-white/50 leading-[1.85] mb-7 max-w-md">
            Drop your details and we'll send you the cohort schedule, payment details, and a calendar invite for a
            short discovery call. No spam, no upsells.
          </p>

          <ul className="flex flex-col gap-3 text-sm text-white/70">
            {[
              "Full curriculum PDF emailed within minutes",
              "Personal call with our programme advisor",
              "Founding cohort price locked in: RM 1,899",
              "No payment required to enquire",
            ].map((t) => (
              <li key={t} className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-success mt-0.5 shrink-0" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>

        <form
          onSubmit={submit}
          className="reveal bg-obsidian-soft border border-white/[0.08] rounded-md p-7 md:p-8 backdrop-blur"
        >
          {done ? (
            <div className="text-center py-10">
              <div className="w-12 h-12 rounded-full bg-success/15 border border-success/30 flex items-center justify-center mx-auto mb-4">
                <Check className="w-5 h-5 text-success" />
              </div>
              <div className="font-display text-2xl text-white mb-2">Thank you.</div>
              <p className="text-sm text-white/50 leading-relaxed">
                We've received your enquiry. Expect a message from our team within 24 hours.
              </p>
            </div>
          ) : (
            <>
              <div className="font-mono text-[0.58rem] font-semibold tracking-widest uppercase text-primary-glow mb-5">
                Enquiry Form
              </div>
              <div className="flex flex-col gap-4">
                {[
                  { name: "name", label: "Full Name", placeholder: "Your name", type: "text" },
                  { name: "phone", label: "Mobile (WhatsApp)", placeholder: "+60 12-345 6789", type: "tel" },
                  { name: "email", label: "Email", placeholder: "you@email.com", type: "email" },
                ].map((f) => (
                  <label key={f.name} className="flex flex-col gap-1.5">
                    <span className="font-mono text-[0.6rem] tracking-widest uppercase text-white/40">
                      {f.label}
                    </span>
                    <input
                      type={f.type}
                      name={f.name}
                      placeholder={f.placeholder}
                      required
                      className="bg-white/[0.04] border border-white/10 rounded-sm px-3.5 py-3 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-primary-glow/50 focus:bg-white/[0.06] transition-colors"
                    />
                  </label>
                ))}
                <label className="flex flex-col gap-1.5">
                  <span className="font-mono text-[0.6rem] tracking-widest uppercase text-white/40">
                    Anything we should know? <span className="text-white/25">(optional)</span>
                  </span>
                  <textarea
                    name="message"
                    rows={3}
                    placeholder="Background, questions, etc."
                    className="bg-white/[0.04] border border-white/10 rounded-sm px-3.5 py-3 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-primary-glow/50 focus:bg-white/[0.06] transition-colors resize-none"
                  />
                </label>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="mt-6 w-full inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-sm bg-success text-obsidian font-semibold text-xs tracking-wider uppercase hover:bg-success/90 hover:-translate-y-0.5 hover:shadow-[0_8px_28px_-4px_hsl(var(--success)/0.4)] transition-all disabled:opacity-60 disabled:cursor-wait"
              >
                {submitting ? "Sending…" : "Send My Enquiry"}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <p className="text-[0.65rem] text-white/30 text-center mt-3 leading-relaxed">
                By submitting, you agree to be contacted by Nexperts Academy about this programme.
              </p>
            </>
          )}
        </form>
      </div>
    </section>
  );
};

export default Enquire;
