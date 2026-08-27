import { useState, type FormEvent } from "react";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { CONTACT_EMAIL, CONTACT_MAILTO } from "@/lib/contact";
import {
  GENERATIVE_AI_CORPORATE_META,
  GENERATIVE_AI_CORPORATE_PRICE,
} from "@/lib/generative-ai-corporate";
import { GSHEET_WEBHOOK_URL, postToGsheetClient } from "@/lib/gsheet-client";
import { normalizeMalaysiaPhone } from "@/lib/phone";
import { GENERATIVE_AI_CORPORATE_PROGRAMME } from "@/lib/programme-source";
import { trackConversion, trackEvent } from "@/lib/analytics";
import { WHATSAPP_HREF } from "@/lib/whatsapp";

const MIN_LOADING_MS = 1100;

const enquiryEmailApiUrl = () => {
  const base = (import.meta.env.VITE_CHECKOUT_API_URL as string | undefined)?.replace(/\/$/, "") ?? "";
  return `${base}/api/send-enquiry-emails`;
};

/** Same Leads sheet payload used by Agentic / Vibe enquiry forms. */
function buildCorporateLeadFields(input: {
  name: string;
  phone: string;
  email: string;
  message: string;
}) {
  const phoneForSheet = input.phone.startsWith("'") ? input.phone : `'${input.phone}`;
  return {
    sheet: "Leads",
    name: input.name,
    phone: phoneForSheet,
    email: input.email,
    message: input.message || "Generative AI Corporate page enquiry",
    submittedAt: new Date().toISOString(),
    source: typeof window !== "undefined" ? window.location.href : GENERATIVE_AI_CORPORATE_META.path,
    programmePage: GENERATIVE_AI_CORPORATE_PROGRAMME.programmePage,
    course: GENERATIVE_AI_CORPORATE_PROGRAMME.course,
    channel: "corporate_page",
  };
}

async function logCorporateLeadToSheet(fields: ReturnType<typeof buildCorporateLeadFields>) {
  if (!GSHEET_WEBHOOK_URL) return false;
  try {
    await postToGsheetClient(fields);
    return true;
  } catch {
    return false;
  }
}

const CorporateEnquire = () => {
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

    setSubmitting(true);
    trackEvent("form_submit", {
      form_name: "corporate_enquiry_form",
      source: "generative_ai_corporate",
    });

    const leadFields = buildCorporateLeadFields({ name, phone, email, message });

    try {
      const start = Date.now();
      let sheetLogged = false;
      let emailOk = false;
      let warning: string | undefined;

      try {
        const emailRes = await fetch(enquiryEmailApiUrl(), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            email,
            phone,
            message,
            source: leadFields.source,
            course: GENERATIVE_AI_CORPORATE_PROGRAMME.course,
            programmePage: GENERATIVE_AI_CORPORATE_PROGRAMME.programmePage,
            channel: "corporate_page",
          }),
        });

        const emailJson = (await emailRes.json().catch(() => ({}))) as {
          error?: string;
          warning?: string;
          sheetLogged?: boolean;
        };

        emailOk = emailRes.ok;
        sheetLogged = emailJson.sheetLogged === true;
        warning = emailJson.warning;

        if (!emailRes.ok && !GSHEET_WEBHOOK_URL) {
          toast.error(emailJson?.error || "Could not send your enquiry. Please try again or email us directly.");
          setSubmitting(false);
          return;
        }
      } catch {
        // API may be down locally — still attempt the shared Leads sheet webhook below.
        emailOk = false;
      }

      // Same Google Sheet as Agentic / Vibe (Leads tab) — write if server did not confirm.
      if (!sheetLogged) {
        sheetLogged = await logCorporateLeadToSheet(leadFields);
      }

      if (!emailOk && !sheetLogged) {
        toast.error("Couldn't submit your enquiry. Please try again or WhatsApp us.");
        setSubmitting(false);
        return;
      }

      if (warning) {
        toast.warning(warning);
      }

      const elapsed = Date.now() - start;
      if (elapsed < MIN_LOADING_MS) {
        await new Promise((resolve) => setTimeout(resolve, MIN_LOADING_MS - elapsed));
      }

      setSubmitting(false);
      setDone(true);
      trackConversion("generate_lead", {
        source: "generative_ai_corporate",
        form_name: "corporate_enquiry_form",
      });
      toast.success(
        emailOk
          ? "Enquiry received — we'll be in touch within 24 hours."
          : "Enquiry saved — our team will follow up shortly.",
      );
    } catch {
      setSubmitting(false);
      toast.error("Couldn't submit your enquiry. Please try again.");
    }
  };

  return (
    <section id="enquire" className="section-x relative overflow-hidden bg-obsidian py-20 md:py-28">
      <div className="absolute inset-0 grid-bg opacity-50" />
      <div
        className="absolute -top-32 left-1/3 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, hsl(var(--primary-glow) / 0.15), transparent 65%)" }}
      />

      <div className="relative mx-auto grid max-w-5xl grid-cols-1 items-start gap-10 min-w-0 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <div className="reveal min-w-0">
          <div className="flex items-center gap-2.5 mb-4">
            <span className="w-3.5 h-px bg-primary-glow/60" />
            <span className="font-mono text-[0.62rem] font-semibold tracking-[0.2em] uppercase text-primary-glow">
              Corporate Enquiry
            </span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-light text-white leading-[1.05] mb-5 text-balance">
            Bring AI productivity<br />
            <em className="not-italic italic text-primary-glow">to your organisation.</em>
          </h2>
          <p className="text-base font-light text-white/50 leading-[1.85] mb-7 max-w-md">
            Tell us about your team size, departments and goals. We'll share a tailored proposal, schedule options
            and HRD Corp claim guidance.
          </p>

          <ul className="flex flex-col gap-3 text-sm text-white/70">
            {[
              "2 days · 16 hours · hands-on · beginner friendly",
              `${GENERATIVE_AI_CORPORATE_PRICE.display} per pax (${GENERATIVE_AI_CORPORATE_PRICE.sstNote})`,
              "HRD Corp claimable",
              "Customisable by department or organisation-wide",
              "Brochure PDF available for download",
            ].map((t) => (
              <li key={t} className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-success mt-0.5 shrink-0" />
                <span>{t}</span>
              </li>
            ))}
          </ul>

          <a
            href={GENERATIVE_AI_CORPORATE_META.brochurePdf}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 text-sm text-primary-glow hover:text-primary-glow/80 transition-colors"
          >
            Download programme brochure (PDF)
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
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
                We've received your corporate enquiry. Expect a message from our team within 24 hours.
              </p>
              <p className="text-sm text-white/50 leading-relaxed mt-2">
                Need an instant answer?{" "}
                <a href={WHATSAPP_HREF} target="_blank" rel="noopener" className="text-success underline underline-offset-2">
                  WhatsApp us
                </a>{" "}
                or email{" "}
                <a href={CONTACT_MAILTO} className="text-primary-glow underline underline-offset-2">
                  {CONTACT_EMAIL}
                </a>
                .
              </p>
            </div>
          ) : submitting ? (
            <div className="py-10" role="status" aria-live="polite">
              <div className="w-12 h-12 rounded-full bg-primary-glow/15 border border-primary-glow/30 flex items-center justify-center mx-auto mb-4">
                <Loader2 className="w-5 h-5 text-primary-glow animate-spin" />
              </div>
              <div className="text-center mb-7">
                <div className="font-display text-2xl text-white mb-1.5">Submitting your enquiry</div>
                <p className="text-sm text-white/50 leading-relaxed">Please hold on while we securely send your details.</p>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-4 mb-6">
                <div>
                  <label htmlFor="corp-name" className="block font-mono text-[0.58rem] uppercase tracking-wider text-white/40 mb-1.5">
                    Full name *
                  </label>
                  <input
                    id="corp-name"
                    name="name"
                    required
                    autoComplete="name"
                    className="w-full rounded-sm border border-white/[0.1] bg-white/[0.03] px-3.5 py-2.5 text-sm text-white placeholder:text-white/25 focus:border-primary-glow/40 focus:outline-none"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="corp-phone" className="block font-mono text-[0.58rem] uppercase tracking-wider text-white/40 mb-1.5">
                    Mobile (Malaysia) *
                  </label>
                  <input
                    id="corp-phone"
                    name="phone_local"
                    required
                    inputMode="tel"
                    autoComplete="tel"
                    className="w-full rounded-sm border border-white/[0.1] bg-white/[0.03] px-3.5 py-2.5 text-sm text-white placeholder:text-white/25 focus:border-primary-glow/40 focus:outline-none"
                    placeholder="e.g. 012-345 6789"
                  />
                </div>
                <div>
                  <label htmlFor="corp-email" className="block font-mono text-[0.58rem] uppercase tracking-wider text-white/40 mb-1.5">
                    Work email *
                  </label>
                  <input
                    id="corp-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    className="w-full rounded-sm border border-white/[0.1] bg-white/[0.03] px-3.5 py-2.5 text-sm text-white placeholder:text-white/25 focus:border-primary-glow/40 focus:outline-none"
                    placeholder="you@company.com"
                  />
                </div>
                <div>
                  <label htmlFor="corp-message" className="block font-mono text-[0.58rem] uppercase tracking-wider text-white/40 mb-1.5">
                    Team size & goals
                  </label>
                  <textarea
                    id="corp-message"
                    name="message"
                    rows={4}
                    className="w-full rounded-sm border border-white/[0.1] bg-white/[0.03] px-3.5 py-2.5 text-sm text-white placeholder:text-white/25 focus:border-primary-glow/40 focus:outline-none resize-y min-h-[100px]"
                    placeholder="e.g. 25 staff across HR and Finance — want safer AI usage and workflow automation"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="group w-full inline-flex items-center justify-center gap-2 rounded-sm bg-success px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-obsidian transition-all hover:bg-success/90 hover:-translate-y-0.5"
              >
                Request Corporate Proposal
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </>
          )}
        </form>
      </div>
    </section>
  );
};

export default CorporateEnquire;
