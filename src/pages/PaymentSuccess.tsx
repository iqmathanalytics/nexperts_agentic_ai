import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import Nav from "@/components/landing/Nav";
import Footer from "@/components/landing/Footer";

const PaymentSuccess = () => {
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");
  const [loggingState, setLoggingState] = useState<"idle" | "saving" | "saved" | "error">("idle");

  const logUrl = useMemo(() => {
    const base = (import.meta.env.VITE_CHECKOUT_API_URL as string | undefined)?.replace(/\/$/, "") ?? "";
    return `${base}/api/log-payment`;
  }, []);

  useEffect(() => {
    document.title = "Payment successful — Nexperts Academy";
  }, []);

  useEffect(() => {
    if (!sessionId) return;
    const marker = `payment-log:${sessionId}`;
    if (window.sessionStorage.getItem(marker)) {
      setLoggingState("saved");
      return;
    }
    setLoggingState("saving");
    fetch(logUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: sessionId }),
    })
      .then((r) => {
        if (!r.ok) throw new Error("Failed");
        window.sessionStorage.setItem(marker, "1");
        setLoggingState("saved");
      })
      .catch(() => setLoggingState("error"));
  }, [sessionId, logUrl]);

  return (
    <>
      <Nav />
      <main className="min-h-[70vh] bg-paper px-[5vw] py-24">
        <div className="mx-auto max-w-lg text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-success/30 bg-success/10">
            <CheckCircle2 className="h-8 w-8 text-success" />
          </div>
          <h1 className="font-display text-3xl font-medium text-foreground md:text-4xl">Payment received</h1>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            {sessionId ? (
              <>
                Thank you — Stripe confirmed this session. We will match your payment to your details and email you
                onboarding steps within one business day.
              </>
            ) : (
              <>Thanks — if you completed checkout, our team will verify and email you shortly.</>
            )}
          </p>
          {sessionId ? (
            <p className="mt-2 font-mono text-xs text-muted-foreground/80 break-all">Reference: {sessionId}</p>
          ) : null}
          {sessionId ? (
            <p className="mt-2 text-xs text-muted-foreground">
              {loggingState === "saving" && "Saving payment details to the Payments sheet..."}
              {loggingState === "saved" && "Payment details saved to the Payments sheet."}
              {loggingState === "error" && "Payment was successful, but sheet sync failed. Please contact support with your reference."}
            </p>
          ) : null}
          <Link
            to="/"
            className="mt-10 inline-flex items-center justify-center rounded-sm bg-primary px-8 py-3 text-sm font-semibold uppercase tracking-wide text-primary-foreground transition hover:bg-primary/90"
          >
            Back to home
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default PaymentSuccess;
