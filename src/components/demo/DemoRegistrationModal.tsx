import { useState, type FormEvent } from "react";
import { Calendar, Loader2, Mail, Phone, User } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DEMO_PROGRAMMES, DEMO_SEATS_NOTE, DEMO_TIME_SLOT, type DemoProgramme } from "@/lib/demo-sessions";
import { cn } from "@/lib/utils";
import { normalizeMalaysiaPhone } from "@/lib/phone";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  programme: DemoProgramme | null;
};

const registerDemoApiUrl = () => {
  const base = (import.meta.env.VITE_CHECKOUT_API_URL as string | undefined)?.replace(/\/$/, "") ?? "";
  return `${base}/api/register-demo`;
};

const fieldClass =
  "w-full rounded-lg border border-white/12 bg-[#141b25] px-3.5 py-2.5 text-sm text-[#dde1ea] placeholder:text-white/30 transition-colors focus:border-[#00d4aa]/45 focus:outline-none focus:ring-2 focus:ring-[#00d4aa]/15";

const DemoRegistrationModal = ({ open, onOpenChange, programme }: Props) => {
  const [submitting, setSubmitting] = useState(false);
  const config = programme ? DEMO_PROGRAMMES[programme] : null;
  const session = config?.session;
  const isVibe = config?.accentClass === "vibe";
  const accentDim = isVibe ? "rgba(56,189,248,0.1)" : "rgba(0,212,170,0.1)";
  const accentColor = isVibe ? "#38bdf8" : "#00d4aa";
  const focusRing = isVibe ? "focus-within:border-sky-400/50 focus-within:ring-sky-400/15" : "focus-within:border-[#00d4aa]/45 focus-within:ring-[#00d4aa]/15";

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!config || !session || submitting) return;

    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") || "").trim();
    const phoneLocal = String(fd.get("phone_local") || "").trim();
    const phone = normalizeMalaysiaPhone(phoneLocal);
    const email = String(fd.get("email") || "").trim();

    if (!name || !email.includes("@") || !phone) {
      toast.error("Please enter your name, valid email, and Malaysian mobile number.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(registerDemoApiUrl(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          demoType: config.key,
          demoTitle: config.title,
          sessionDate: session.id,
          sessionDateLabel: session.label,
          source: window.location.href,
        }),
      });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; emailSent?: boolean };
      if (!res.ok || !json.ok) {
        toast.error(json.error || "Could not save your registration. Please try again.");
        return;
      }
      toast.success(
        json.emailSent
          ? `You're registered! Check your email for Microsoft Teams joining details.`
          : `You're registered for ${config.title} on ${session.shortLabel}.`,
      );
      onOpenChange(false);
    } catch {
      toast.error("Could not submit registration. Check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "demo-registration-dialog z-[200] w-[calc(100%-2rem)] max-w-xl gap-0 overflow-hidden border-white/10 bg-[#0b0f14] p-0 text-[#dde1ea] shadow-2xl sm:rounded-2xl",
          isVibe && "demo-registration-dialog--vibe",
        )}
      >
        <div
          className="border-b border-white/[0.06] px-5 py-5 sm:px-7 sm:py-6"
          style={{ background: `linear-gradient(180deg, ${accentDim} 0%, transparent 100%)` }}
        >
          <DialogHeader className="space-y-2 text-left">
            <DialogTitle className="font-display text-xl font-medium leading-snug text-white sm:text-2xl">
              {config ? config.registerLabel : "Demo registration"}
            </DialogTitle>
            <DialogDescription className="text-[0.8125rem] leading-relaxed text-white/55">
              {DEMO_TIME_SLOT} · {DEMO_SEATS_NOTE}
            </DialogDescription>
          </DialogHeader>
        </div>

        {config && session && (
          <form onSubmit={submit} className="space-y-5 px-5 py-5 sm:space-y-6 sm:px-7 sm:py-6">
            <input type="hidden" name="sessionDate" value={session.id} />

            <div
              className="rounded-xl border px-4 py-4 sm:px-5"
              style={{
                borderColor: `${accentColor}40`,
                backgroundColor: accentDim,
              }}
            >
              <div className="flex items-center gap-1.5 text-[0.65rem] font-semibold uppercase tracking-wider" style={{ color: accentColor }}>
                <Calendar className="h-3.5 w-3.5" aria-hidden />
                Your session
              </div>
              <div className="mt-3 grid grid-cols-3 gap-3 text-center sm:gap-4">
                <div>
                  <div className="text-[0.65rem] uppercase tracking-wider text-white/40">Date</div>
                  <div className="mt-1 text-sm font-semibold text-white">{session.dateDisplay}</div>
                </div>
                <div>
                  <div className="text-[0.65rem] uppercase tracking-wider text-white/40">Day</div>
                  <div className="mt-1 text-sm font-semibold text-white">{session.day}</div>
                </div>
                <div>
                  <div className="text-[0.65rem] uppercase tracking-wider text-white/40">Time</div>
                  <div className="mt-1 text-sm font-semibold text-white leading-snug">{session.time}</div>
                </div>
              </div>
              <p className="mt-3 text-center text-xs text-white/50">MYT · Confirmation email includes Microsoft Teams link &amp; passcode</p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="block space-y-1.5 sm:col-span-2">
                <span className="flex items-center gap-1.5 text-[0.65rem] font-semibold uppercase tracking-wider text-white/45">
                  <User className="h-3.5 w-3.5" aria-hidden />
                  Full name
                </span>
                <input name="name" required autoComplete="name" className={fieldClass} placeholder="Your name" />
              </label>

              <label className="block space-y-1.5">
                <span className="flex items-center gap-1.5 text-[0.65rem] font-semibold uppercase tracking-wider text-white/45">
                  <Phone className="h-3.5 w-3.5" aria-hidden />
                  Mobile (MY)
                </span>
                <div className={cn("flex overflow-hidden rounded-lg border border-white/12 bg-[#141b25] focus-within:ring-2", focusRing)}>
                  <span className="flex items-center border-r border-white/10 px-3 text-sm text-white/45">+60</span>
                  <input
                    name="phone_local"
                    required
                    inputMode="tel"
                    autoComplete="tel"
                    className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm text-[#dde1ea] placeholder:text-white/30 focus:outline-none"
                    placeholder="11-1221 6870"
                  />
                </div>
              </label>

              <label className="block space-y-1.5">
                <span className="flex items-center gap-1.5 text-[0.65rem] font-semibold uppercase tracking-wider text-white/45">
                  <Mail className="h-3.5 w-3.5" aria-hidden />
                  Email
                </span>
                <input
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className={fieldClass}
                  placeholder="you@email.com"
                />
              </label>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className={cn("demo-modal-submit mt-1 w-full py-3 text-[0.9375rem]", config.accentClass)}
            >
              {submitting ? (
                <span className="inline-flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving your spot…
                </span>
              ) : (
                "Confirm registration"
              )}
            </button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DemoRegistrationModal;
