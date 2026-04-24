import { useEffect } from "react";
import { Link } from "react-router-dom";
import { XCircle } from "lucide-react";
import Nav from "@/components/landing/Nav";
import Footer from "@/components/landing/Footer";

const PaymentCancel = () => {
  useEffect(() => {
    document.title = "Checkout cancelled — Nexperts Academy";
  }, []);

  return (
    <>
      <Nav />
      <main className="min-h-[70vh] bg-paper px-[5vw] py-24">
        <div className="mx-auto max-w-lg text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-amber-500/30 bg-amber-500/10">
            <XCircle className="h-8 w-8 text-amber-600" />
          </div>
          <h1 className="font-display text-3xl font-medium text-foreground md:text-4xl">Checkout not completed</h1>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            You left Stripe before paying, or the session ended. No charge was made. When you are ready, use{" "}
            <span className="font-medium text-foreground">Secure seat — Pay (Stripe)</span> on the homepage again.
          </p>
          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              to="/#buy-course"
              className="inline-flex items-center justify-center rounded-sm bg-primary px-8 py-3 text-sm font-semibold uppercase tracking-wide text-primary-foreground transition hover:bg-primary/90"
            >
              Try checkout again
            </Link>
            <Link
              to="/#enquire"
              className="inline-flex items-center justify-center rounded-sm border border-border px-8 py-3 text-sm font-semibold uppercase tracking-wide text-foreground transition hover:bg-muted"
            >
              Enquire instead
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default PaymentCancel;
