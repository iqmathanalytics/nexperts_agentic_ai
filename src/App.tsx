import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import RouteAnalytics from "@/components/analytics/RouteAnalytics";
import { RouteFallback } from "@/components/perf/LazyWhenVisible";
import Index from "./pages/Index.tsx";

const GenerativeAiCorporate = lazy(() => import("./pages/GenerativeAiCorporate.tsx"));
const PaymentSuccess = lazy(() => import("./pages/PaymentSuccess.tsx"));
const PaymentCancel = lazy(() => import("./pages/PaymentCancel.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));

const App = () => (
  <TooltipProvider delayDuration={300}>
    <Toaster />
    <Sonner />
    <BrowserRouter>
      <RouteAnalytics />
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/generative-ai-corporate" element={<GenerativeAiCorporate />} />
          <Route path="/payment/success" element={<PaymentSuccess />} />
          <Route path="/payment/cancel" element={<PaymentCancel />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </TooltipProvider>
);

export default App;
