import { useState, type FormEvent } from "react";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { normalizeMalaysiaPhone } from "@/lib/phone";

const GSHEET_WEBHOOK_URL = import.meta.env.VITE_GSHEET_WEBHOOK_URL;
const MIN_LOADING_MS = 1100;

const Enquire = () => {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") || "").trim();
    const phoneLocal = String(fd.get("phone_local") || "").trim();
    const phone = normalizeMalaysiaPhone(phoneLocal);
    const email = String(fd.get("email") || "").trim();
    const message = String(fd.get("message") || "").trim();

    if (!name || !phone || !email.includes("@")) {
      toast.error("Please fill in your name, Malaysian mobile number, and a valid email.");
      return;
    }

    if (!GSHEET_WEBHOOK_URL) {
      toast.error("Form endpoint is not configured yet.");
      return;
    }

    setSubmitting(true);

    // Leading apostrophe helps Google Sheets treat the cell as plain text when Apps Script appends a row.
    const phoneForSheet = `'${phone}`;

    const payload = new URLSearchParams({
      name,
      phone: phoneForSheet,
      email,
      message,
      submittedAt: new Date().toISOString(),
      source: window.location.href,
    });

    try {
      const start = Date.now();

      // Google Apps Script endpoints commonly work best with urlencoded form data.
      await fetch(GSHEET_WEBHOOK_URL, {
        method: "POST",
        mode: "no-cors",
        body: payload,
      });

      const elapsed = Date.now() - start;
      if (elapsed < MIN_LOADING_MS) {
        await new Promise((resolve) => setTimeout(resolve, MIN_LOADING_MS - elapsed));
      }

      setSubmitting(false);
      setDone(true);
      toast.success("Enquiry received — we'll be in touch within 24 hours.");
    } catch {
      setSubmitting(false);
      toast.error("Couldn't submit your enquiry. Please try again.");
    }
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
              "Limited offer price locked in: RM 399 (excluding 8% SST)",
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
          ) : submitting ? (
            <div className="py-10" role="status" aria-live="polite">
              <div className="w-12 h-12 rounded-full bg-primary-glow/15 border border-primary-glow/30 flex items-center justify-center mx-auto mb-4">
                <Loader2 className="w-5 h-5 text-primary-glow animate-spin" />
              </div>
              <div className="text-center mb-7">
                <div className="font-display text-2xl text-white mb-1.5">Submitting your enquiry</div>
                <p className="text-sm text-white/50 leading-relaxed">
                  Please hold on while we securely send your details.
                </p>
              </div>
              <div className="flex flex-col gap-2.5">
                {[
                  "Validating your details",
                  "Sending to admissions desk",
                  "Reserving your seat request",
                ].map((step, i) => (
                  <div
                    key={step}
                    className="relative overflow-hidden rounded-sm border border-white/10 bg-white/[0.03] px-3.5 py-2.5"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  >
                    <div className="absolute inset-y-0 -left-1/2 w-1/2 bg-gradient-to-r from-transparent via-primary-glow/20 to-transparent animate-[shimmer_1.6s_linear_infinite]" />
                    <div className="relative flex items-center gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-glow animate-pulse-dot" />
                      <span className="text-xs text-white/70">{step}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              <div className="font-mono text-[0.58rem] font-semibold tracking-widest uppercase text-primary-glow mb-5">
                Enquiry Form
              </div>
              <div className="flex flex-col gap-4">
                {[
                  { name: "name", label: "Full Name", placeholder: "Your name", type: "text" },
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
                    Mobile (WhatsApp)
                  </span>
                  <div className="flex rounded-sm border border-white/10 bg-white/[0.04] focus-within:border-primary-glow/50 focus-within:bg-white/[0.06] transition-colors overflow-hidden">
                    <span className="shrink-0 px-3 py-3 text-sm text-white/55 border-r border-white/10 bg-white/[0.03] select-none">
                      +60
                    </span>
                    <input
                      type="tel"
                      name="phone_local"
                      inputMode="numeric"
                      autoComplete="tel-national"
                      placeholder="11-1221-6870"
                      required
                      className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm text-white placeholder:text-white/25 focus:outline-none"
                    />
                  </div>
                  <span className="text-[0.65rem] text-white/30">Country code +60 is fixed — enter your Malaysian number only.</span>
                </label>
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
