import { useState, type FormEvent } from "react";
import { ArrowRight, CreditCard, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { normalizeMalaysiaPhone } from "@/lib/phone";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const checkoutApiUrl = () => {
  const base = (import.meta.env.VITE_CHECKOUT_API_URL as string | undefined)?.replace(/\/$/, "") ?? "";
  return `${base}/api/create-checkout-session`;
};

const CourseCheckout = () => {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const startCheckout = async (fd: FormData) => {
    const name = String(fd.get("name") || "").trim();
    const email = String(fd.get("email") || "").trim();
    const phoneLocal = String(fd.get("phone_local") || "").trim();
    const phone = normalizeMalaysiaPhone(phoneLocal);
    const message = String(fd.get("message") || "").trim();

    if (!name || !email.includes("@")) {
      setFormError("Please enter your full name and a valid email.");
      return;
    }
    if (!phone) {
      setFormError("Please enter a valid Malaysian mobile number (after +60).");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(checkoutApiUrl(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, message }),
      });
      const data = (await res.json()) as { url?: string; error?: string };

      if (!res.ok || !data.url) {
        const msg = data.error || "Payment could not be started. Please try again or contact us.";
        setFormError(msg);
        toast.error(msg);
        setSubmitting(false);
        return;
      }

      toast.success("Redirecting to secure Stripe checkout…");
      window.location.assign(data.url);
    } catch {
      setFormError("Network error — check your connection or try again shortly.");
      toast.error("Could not reach the payment server.");
      setSubmitting(false);
    }
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    const fd = new FormData(e.currentTarget);
    await startCheckout(fd);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-sm border border-primary-glow/40 bg-primary-glow/10 text-primary-glow font-semibold text-xs tracking-wider uppercase hover:bg-primary-glow/15 hover:-translate-y-0.5 transition-all"
        id="buy-course"
      >
        <CreditCard className="w-3.5 h-3.5" />
        Secure seat — Pay (Stripe)
      </button>

      <Dialog open={open} onOpenChange={(v) => !submitting && setOpen(v)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto border-white/10 bg-obsidian text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl text-white">Course checkout</DialogTitle>
            <DialogDescription className="text-white/55">
              Enter the same details we use for your cohort record. You will be redirected to Stripe to complete RM
              399 (+ SST). If you close Stripe without paying, you can try again from here.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            {formError && (
              <div
                className="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200"
                role="alert"
              >
                {formError}
              </div>
            )}

            <label className="flex flex-col gap-1.5">
              <span className="font-mono text-[0.6rem] tracking-widest uppercase text-white/40">Full name</span>
              <input
                name="name"
                required
                autoComplete="name"
                className="rounded-sm border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white placeholder:text-white/25 focus:border-primary-glow/50 focus:outline-none"
                placeholder="As on your ID / invoice"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="font-mono text-[0.6rem] tracking-widest uppercase text-white/40">Email</span>
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                className="rounded-sm border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white placeholder:text-white/25 focus:border-primary-glow/50 focus:outline-none"
                placeholder="you@email.com"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="font-mono text-[0.6rem] tracking-widest uppercase text-white/40">Mobile (WhatsApp)</span>
              <div className="flex overflow-hidden rounded-sm border border-white/10 bg-white/[0.04] focus-within:border-primary-glow/50">
                <span className="shrink-0 border-r border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-white/55">
                  +60
                </span>
                <input
                  name="phone_local"
                  type="tel"
                  inputMode="numeric"
                  required
                  autoComplete="tel-national"
                  className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none"
                  placeholder="11-1221-6870"
                />
              </div>
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="font-mono text-[0.6rem] tracking-widest uppercase text-white/40">
                Note <span className="text-white/25">(optional)</span>
              </span>
              <textarea
                name="message"
                rows={2}
                className="resize-none rounded-sm border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white placeholder:text-white/25 focus:border-primary-glow/50 focus:outline-none"
                placeholder="Company name, invoice needs, etc."
              />
            </label>

            <DialogFooter className="gap-2 sm:gap-2">
              <Button
                type="button"
                variant="outline"
                className="border-white/15 bg-transparent text-white hover:bg-white/10"
                disabled={submitting}
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="bg-success text-obsidian hover:bg-success/90"
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Starting checkout…
                  </>
                ) : (
                  <>
                    Continue to Stripe
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CourseCheckout;
