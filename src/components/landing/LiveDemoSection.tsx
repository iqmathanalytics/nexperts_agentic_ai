import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  Bell,
  Bot,
  CalendarDays,
  CheckCircle2,
  Coffee,
  Lightbulb,
  MessageCircle,
  MessagesSquare,
  Package,
  Play,
  Receipt,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Store,
} from "lucide-react";

type LogKind = "plain" | "success" | "tool" | "reason" | "exec";

type LiveLine = { text: string; kind: LogKind; agentIndex: number };

type DeliveryHighlight = {
  title: string;
  body: string;
  variant: "neutral" | "success" | "accent";
};

type ScenarioDelivery = {
  headline: string;
  subhead: string;
  highlights: DeliveryHighlight[];
  /** Plain sentence: who helped you */
  teamLine: string;
};

type AgentDef = {
  id: string;
  label: string;
  Icon: LucideIcon;
};

type ScenarioStep = {
  atMs: number;
  agentIndex: number;
  kind: LogKind;
  text: string;
};

type PromptScenario = {
  id: string;
  title: string;
  tag: string;
  description: string;
  /** Shown in terminal as the orchestrated intent */
  intentLine: string;
  /** Exact user-style prompt shown in the live console */
  livePrompt: string;
  agents: AgentDef[];
  steps: ScenarioStep[];
  delivery: ScenarioDelivery;
  /** When to reveal final card after last log */
  deliveryAtMs: number;
};

const logKindUi: Record<
  LogKind,
  { label: string; chip: string; border: string; icon: LucideIcon; iconClass: string }
> = {
  plain: {
    label: "Update",
    chip: "bg-zinc-800/80 text-zinc-100 border-zinc-600/60",
    border: "border-zinc-600/40",
    iconClass: "text-zinc-200",
    icon: Bot,
  },
  tool: {
    label: "Checking",
    chip: "bg-sky-950/80 text-sky-100 border-sky-400/40",
    border: "border-sky-500/35",
    iconClass: "text-sky-300",
    icon: Sparkles,
  },
  reason: {
    label: "Thinking",
    chip: "bg-amber-950/70 text-amber-50 border-amber-400/40",
    border: "border-amber-500/35",
    iconClass: "text-amber-200",
    icon: Lightbulb,
  },
  exec: {
    label: "Drafting",
    chip: "bg-violet-950/75 text-violet-50 border-violet-400/40",
    border: "border-violet-500/35",
    iconClass: "text-violet-200",
    icon: MessageCircle,
  },
  success: {
    label: "Done",
    chip: "bg-emerald-950/75 text-emerald-50 border-emerald-400/45",
    border: "border-emerald-500/35",
    iconClass: "text-emerald-200",
    icon: CheckCircle2,
  },
};

const highlightCardClass: Record<DeliveryHighlight["variant"], string> = {
  neutral: "border-white/10 bg-white/[0.04]",
  success: "border-emerald-500/25 bg-emerald-500/[0.06]",
  accent: "border-primary-glow/30 bg-primary-glow/[0.07]",
};

const SCENARIOS: PromptScenario[] = [
  {
    id: "kopitiam",
    tag: "F&B",
    title: "Saturday breakfast rush",
    description: "POS-backed pattern: when the queue spikes and what to pre-pull before 8:30am.",
    intentLine:
      "Correlate last 6 Saturdays of QR orders with prep sheets — output a one-glance prep list + WhatsApp for the shift lead.",
    livePrompt:
      "We’re in SS2, kopitiam style. Last few Saturdays the kitchen died around 10am. Pull whatever signals you can from our POS export (Oct–Nov) and tell me what to pre-make + a short WA I can send Kak Lin opening shift.",
    agents: [
      { id: "rush", label: "Rush watch", Icon: Coffee },
      { id: "prep", label: "Prep coach", Icon: Sparkles },
      { id: "ping", label: "Team ping", Icon: MessageCircle },
    ],
    steps: [
      {
        atMs: 380,
        agentIndex: 0,
        kind: "tool",
        text: "Ingested 6× Sat CSV (MYT): 412–518 orders/store · peak velocity 09:12–10:40 · median ticket RM 18.40.",
      },
      {
        atMs: 1850,
        agentIndex: 1,
        kind: "reason",
        text: "Crossed SKUs: kopi O / teh tarik / set half-boiled + kaya toast = 61% of peak mix · grill idle > 7m flagged.",
      },
      {
        atMs: 3400,
        agentIndex: 2,
        kind: "exec",
        text: "Draft WA (BM): “Kak Lin — pre-pull 3× kopi O batch 8:15am, double toast slot 8:45. Extra 40 eggs chilled. I’ll float front if queue >8.”",
      },
      {
        atMs: 4800,
        agentIndex: 1,
        kind: "success",
        text: "Confidence 0.91 on prep window · one human tap to send · kill-switch if public holiday overlay toggled.",
      },
      {
        atMs: 5800,
        agentIndex: -1,
        kind: "plain",
        text: "Stream closed · artefacts hashed · no auto-send executed (demo policy).",
      },
    ],
    delivery: {
      headline: "Sat rush — live prep brief",
      subhead: "Synthetic run styled like a POS + agent mesh handoff (MYT).",
      highlights: [
        {
          title: "Peak window",
          body: "09:12–10:40 MYT · +22% order velocity vs store baseline · queue risk >8 pax sustained 18 min.",
          variant: "accent",
        },
        {
          title: "Prep pull",
          body: "Pre-batch kopi O ×3 @ 08:15 · toast capacity +2 slots @ 08:45 · eggs +40 (chilled).",
          variant: "neutral",
        },
        {
          title: "WA draft",
          body: "BM message to shift lead ready in outbox — send from your device; agents never post autonomously here.",
          variant: "success",
        },
      ],
      teamLine: "Rush watch · Prep coach · Team ping — 3 hops, 1 human send gate.",
    },
    deliveryAtMs: 7000,
  },
  {
    id: "seller",
    tag: "Seller",
    title: "Marketplace chat burst",
    description: "Live inbox triage + SKU truth + bilingual reply drafts.",
    intentLine:
      "23 unread Shopee/Lazada threads in 48h — cluster intents, reconcile stock, return paste-ready BM + English replies with J&T / DHL wording.",
    livePrompt:
      "Bro can help scan my chats? Got 23 unread, mostly “ada stock tak” and “pos today boleh?” — I sell tee SKU TEE-BLK-M / TEE-WHT-S. Need replies I can paste, BM + English, and flag if stock sikit.",
    agents: [
      { id: "inbox", label: "Inbox reader", Icon: MessagesSquare },
      { id: "stock", label: "Stock check", Icon: Package },
      { id: "reply", label: "Reply writer", Icon: ShoppingBag },
    ],
    steps: [
      {
        atMs: 320,
        agentIndex: 0,
        kind: "tool",
        text: "Clustered 23 threads → 11 unique intents · top: stock truth (7) · courier cut-off (5) · size swap (4).",
      },
      {
        atMs: 1650,
        agentIndex: 1,
        kind: "tool",
        text: "SKU ledger sync: TEE-BLK-M qty 14 · TEE-WHT-S qty 3 (low) · promo -15% ended 23:59 Tue — reflected in drafts.",
      },
      {
        atMs: 3100,
        agentIndex: 2,
        kind: "exec",
        text: "Draft A (BM): “Hi, stok TEE-BLK-M ada. Pos hari ini cut-off 2pm via J&T — link jejak dihantar lepas bayar.” Draft B (EN): mirrored + DHL alt line.",
      },
      {
        atMs: 4500,
        agentIndex: 2,
        kind: "success",
        text: "7 paste-ready pairs generated · low-stock SKUs get soft scarcity line · human review queue = ON.",
      },
      { atMs: 5400, agentIndex: -1, kind: "plain", text: "Webhook idle · rate-limit cool · session sealed MYT timestamp." },
    ],
    delivery: {
      headline: "Inbox cleared — bilingual paste pack",
      subhead: "Mirrors a live seller assist run; courier names are examples only.",
      highlights: [
        {
          title: "Intent mix",
          body: "23 msgs → 11 buckets · stock checks 7 · cut-off / courier 5 · exchange/size 4.",
          variant: "neutral",
        },
        {
          title: "Stock truth",
          body: "TEE-BLK-M ×14 · TEE-WHT-S ×3 (flagged low) · promo expiry honoured in copy.",
          variant: "accent",
        },
        {
          title: "Replies",
          body: "BM + EN blocks with J&T / DHL wording · you paste-send; no auto-reply fired in this demo.",
          variant: "success",
        },
      ],
      teamLine: "Inbox reader · Stock check · Reply writer — streamed in ~5.4s wall (simulated).",
    },
    deliveryAtMs: 6400,
  },
  {
    id: "clinic",
    tag: "Clinic",
    title: "Tuesday clinic load",
    description: "Calendar density + SMS cadence + front-desk triage board.",
    intentLine:
      "Pull tomorrow’s EMR slots (de-identified), detect double-book risk, emit BM/English SMS templates + reception one-pager.",
    livePrompt:
      "Clinic in Bangsar — tomorrow’s list feels tight. Can agents show me gaps, who hasn’t confirmed, and give me 160-char SMS templates (BM + English) I can blast through our gateway? No clinical advice please.",
    agents: [
      { id: "slots", label: "Slot finder", Icon: CalendarDays },
      { id: "nudge", label: "Reminder", Icon: Bell },
      { id: "front", label: "Front desk", Icon: Sparkles },
    ],
    steps: [
      {
        atMs: 340,
        agentIndex: 0,
        kind: "tool",
        text: "Calendar API snapshot (MYT): 37 booked / 44 cap · 09:30–11:10 over 85% util · two 10-min buffers auto-suggested.",
      },
      {
        atMs: 1750,
        agentIndex: 1,
        kind: "exec",
        text: "SMS template BM (159c): “Pengingat temujanji esok 10:20am di [Alamat]. Balas YA utk sahkan atau TOLAK utk reschedule.” EN variant parity-checked.",
      },
      {
        atMs: 3200,
        agentIndex: 2,
        kind: "reason",
        text: "Front triage: 6 patients unconfirmed >18h · prioritise WhatsApp-first cohort (opt-in list) · print-friendly PDF queued.",
      },
      {
        atMs: 4500,
        agentIndex: 0,
        kind: "success",
        text: "No-show risk model ↓ est. 14% → 9% if reminders sent before 20:00 MYT (cohort history matched).",
      },
      { atMs: 5400, agentIndex: -1, kind: "plain", text: "PHI scrub verified · audit token attached · gateway send = manual trigger." },
    ],
    delivery: {
      headline: "Tuesday load — ops layer only",
      subhead: "Logistics + reminders; zero diagnostic content (policy-bound demo).",
      highlights: [
        {
          title: "Utilisation",
          body: "37/44 slots · hot band 09:30–11:10 · two buffer inserts suggested for reception.",
          variant: "accent",
        },
        {
          title: "SMS pack",
          body: "BM + EN ≤160 chars · YES/NO confirm tokens · gateway-ready (manual send).",
          variant: "success",
        },
        {
          title: "Front desk",
          body: "6 unconfirmed >18h · ordered call list · PDF one-pager for counter tablet.",
          variant: "neutral",
        },
      ],
      teamLine: "Slot finder · Reminder · Front desk — live-style cadence, human send gate.",
    },
    deliveryAtMs: 6200,
  },
  {
    id: "sme",
    tag: "SME",
    title: "Month-end close assist",
    description: "Receipt OCR lanes + GL tagging + anomaly surfacing for sign-off.",
    intentLine:
      "Folder dump (Grab, Shopee biz, landlord PDFs) → classify to MYR GL buckets, surface duplicates, export accountant CSV.",
    livePrompt:
      "Need month-end pack for accountant — mixed Grab receipts, Shopee biz invoices, one landlord PDF. Tag everything in MYR, flag anything weird, give me totals by category + CSV I can hand off. FYI entity: Nexusbyte Sdn Bhd.",
    agents: [
      { id: "collect", label: "Collector", Icon: Receipt },
      { id: "sort", label: "Sorter", Icon: Store },
      { id: "sheet", label: "Summary", Icon: Sparkles },
      { id: "safe", label: "Safety check", Icon: ShieldCheck },
    ],
    steps: [
      {
        atMs: 300,
        agentIndex: 0,
        kind: "tool",
        text: "OCR lane finished: 52 artefacts · MYR face value roll-up RM 48,220.35 · 3 unreadable scans queued for re-shot.",
      },
      {
        atMs: 1550,
        agentIndex: 1,
        kind: "reason",
        text: "GL mapping: meals RM 6,420 · SaaS USD invoices → MYR @ 4.72 · rent RM 12,000 · misc RM 3,110 (needs receipt #2).",
      },
      {
        atMs: 3000,
        agentIndex: 2,
        kind: "exec",
        text: "Built pivot: category × payee × tax tag suggestion · CSV `close_nov24_draft.csv` staged (checksum SHA-256 logged).",
      },
      {
        atMs: 4200,
        agentIndex: 3,
        kind: "tool",
        text: "Anomaly sweep: duplicate Grab trip RM 18.70 ×2 · personal GrabFood charge flagged (non-corp card tail 42).",
      },
      {
        atMs: 5400,
        agentIndex: 3,
        kind: "success",
        text: "Partner sign-off required before LHDN / e-invoice export — agents stop at draft boundary.",
      },
      { atMs: 6200, agentIndex: -1, kind: "plain", text: "Ledger session locked · diffable audit trail retained 30d (demo TTL)." },
    ],
    delivery: {
      headline: "Nov close — draft accountant pack",
      subhead: "Numbers illustrative; structure mirrors a real SME mesh output.",
      highlights: [
        {
          title: "Roll-up",
          body: "MYR 48,220.35 scanned · 52 docs · 3 rescans requested.",
          variant: "neutral",
        },
        {
          title: "GL split",
          body: "Meals RM 6,420 · Rent RM 12,000 · SaaS FX @ 4.72 · Misc RM 3,110 (pending receipt).",
          variant: "accent",
        },
        {
          title: "Risk flags",
          body: "Duplicate Grab RM 18.70 ×2 · personal card spend isolated for director review.",
          variant: "success",
        },
      ],
      teamLine: "Collector · Sorter · Summary · Safety check — draft-only, human filing gate.",
    },
    deliveryAtMs: 7000,
  },
];

function useLiveClock(active: boolean) {
  const [clock, setClock] = useState(() =>
    new Date().toLocaleTimeString("en-MY", { hour12: true, hour: "2-digit", minute: "2-digit", second: "2-digit" }),
  );
  useEffect(() => {
    if (!active) return;
    const id = window.setInterval(() => {
      setClock(
        new Date().toLocaleTimeString("en-MY", {
          hour12: true,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      );
    }, 110);
    return () => window.clearInterval(id);
  }, [active]);
  return clock;
}

function TypewriterBlock({ text, streamKey }: { text: string; streamKey: number }) {
  const [shown, setShown] = useState("");
  useEffect(() => {
    setShown("");
    if (!text) return;
    const chunk = text.length > 140 ? 3 : text.length > 80 ? 2 : 1;
    let i = 0;
    const id = window.setInterval(() => {
      i = Math.min(text.length, i + chunk);
      setShown(text.slice(0, i));
      if (i >= text.length) window.clearInterval(id);
    }, 16);
    return () => window.clearInterval(id);
  }, [text, streamKey]);
  return <>{shown}</>;
}

function LiveSignalChart({ values }: { values: number[] }) {
  const fillId = useId().replace(/:/g, "");
  const w = 360;
  const h = 72;
  const pad = 6;
  if (values.length < 2) {
    return <div className="h-[96px] w-full rounded-lg bg-zinc-900/60 sm:h-[112px]" />;
  }
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const span = max - min || 1;
  const d = values
    .map((v, i) => {
      const x = pad + (i / (values.length - 1)) * (w - 2 * pad);
      const y = pad + (1 - (v - min) / span) * (h - 2 * pad);
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <div className="relative min-h-[96px] shrink-0 overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-zinc-950 via-[#060a14] to-primary-glow/[0.12] sm:min-h-[112px]">
      <div className="absolute left-3 top-2 flex items-center gap-2 text-[0.62rem] font-semibold uppercase tracking-wider text-zinc-500">
        <Activity className="h-3.5 w-3.5 text-primary-glow" />
        Live signal
      </div>
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="mt-5 block h-[72px] w-full sm:h-[96px]"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden
      >
        <defs>
          <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--primary-glow))" stopOpacity="0.35" />
            <stop offset="100%" stopColor="hsl(var(--primary-glow))" stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.path
          d={`${d} L ${w - pad},${h} L ${pad},${h} Z`}
          fill={`url(#${fillId})`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35 }}
        />
        <motion.path
          d={d}
          fill="none"
          stroke="hsl(var(--primary-glow))"
          strokeWidth={2.2}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        />
      </svg>
    </div>
  );
}

function AgentEnergyBars({
  agents,
  activeNode,
}: {
  agents: AgentDef[];
  activeNode: number;
}) {
  return (
    <div className="flex h-[88px] shrink-0 items-end justify-between gap-1.5 border-t border-white/10 pt-2.5 sm:h-[100px] sm:gap-2 sm:pt-3">
      {agents.map((a, i) => {
        const hot = activeNode === i;
        const done = activeNode > i;
        const h = hot ? 66 : done ? 40 : 18;
        return (
          <div key={a.id} className="flex min-w-0 flex-1 flex-col items-center gap-1">
            <motion.div
              className="relative w-full max-w-[50px] rounded-t-md bg-gradient-to-t from-primary-glow/25 via-primary-glow/55 to-primary-glow shadow-[0_0_20px_-4px_hsl(var(--primary-glow)/0.7)] sm:max-w-[56px]"
              animate={{ height: h }}
              transition={{ type: "spring", stiffness: 380, damping: 26 }}
            />
            <span className="w-full truncate text-center text-[0.5rem] font-medium uppercase tracking-wide text-zinc-500 sm:text-[0.55rem]">
              {a.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function ExecutionDeck({
  scenario,
  isRunning,
  showDelivery,
  activeNode,
  liveLine,
  streamKey,
  signalSeries,
  clock,
  sessionId,
  promptTyped,
  promptKey,
  recentTail,
}: {
  scenario: PromptScenario;
  isRunning: boolean;
  showDelivery: boolean;
  activeNode: number;
  liveLine: LiveLine | null;
  streamKey: number;
  signalSeries: number[];
  clock: string;
  sessionId: string | null;
  promptTyped: boolean;
  promptKey: number;
  recentTail: { text: string; kind: LogKind }[];
}) {
  const ui = liveLine ? logKindUi[liveLine.kind] : logKindUi.plain;
  const Icon = ui.icon;
  const agentWho =
    liveLine && liveLine.agentIndex >= 0 ? scenario.agents[liveLine.agentIndex]?.label ?? "Mesh" : "Control plane";

  return (
    <div className="relative flex h-full min-h-0 w-full min-w-0 flex-col gap-2 overflow-x-hidden overflow-y-hidden p-2.5 text-zinc-100 antialiased sm:p-3 [color-scheme:dark]">
      {isRunning && (
        <motion.div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,hsl(var(--primary-glow)/0.14),transparent_55%)]"
          animate={{ opacity: [0.45, 0.85, 0.45] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      <div className="relative z-[1] flex min-w-0 shrink-0 flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2">
        <div className="flex min-w-0 items-center gap-2 font-mono text-[0.65rem] text-zinc-400">
          <span className="rounded border border-white/10 bg-black/40 px-2 py-0.5 text-zinc-200">{clock}</span>
          <span className="truncate text-zinc-500">MYT</span>
        </div>
        <div className="flex items-center gap-2">
          {sessionId && (
            <span className="hidden max-w-[200px] truncate font-mono text-[0.58rem] text-zinc-500 sm:inline">
              {sessionId}
            </span>
          )}
          <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[0.58rem] font-semibold uppercase tracking-wider text-emerald-300">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
              <span className="relative h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            {isRunning ? "Live" : showDelivery ? "Done" : "Idle"}
          </span>
        </div>
      </div>

      <div className="relative z-[1] max-h-[5.5rem] min-w-0 shrink-0 overflow-y-auto overscroll-contain rounded-xl border border-white/10 bg-black/35 p-2.5 backdrop-blur-sm sm:max-h-[7rem] sm:p-3">
        <div className="mb-1.5 text-[0.58rem] font-semibold uppercase tracking-wider text-zinc-500">User prompt</div>
        <p className="break-words text-[0.78rem] leading-relaxed text-zinc-200 sm:text-[0.82rem]">
          {isRunning || promptTyped ? (
            <TypewriterBlock text={scenario.livePrompt} streamKey={promptKey} />
          ) : (
            <span className="text-zinc-500">Run the agents to stream this prompt in real time.</span>
          )}
        </p>
      </div>

      <div className="relative z-[1] grid min-h-0 min-w-0 flex-1 grid-rows-[auto_auto_minmax(10.5rem,1fr)] gap-2 sm:grid-rows-[auto_auto_minmax(12rem,1fr)]">
        <LiveSignalChart values={signalSeries} />
        <AgentEnergyBars agents={scenario.agents} activeNode={activeNode} />

        <div className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden rounded-xl border border-white/10 bg-gradient-to-b from-zinc-900/90 to-black/80 p-2.5 shadow-inner sm:p-3">
          <div className="mb-2 flex shrink-0 flex-wrap items-center gap-2">
            <span className={`rounded-md border px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-wide ${ui.chip}`}>
              {liveLine ? logKindUi[liveLine.kind].label : "Awaiting"}
            </span>
            <span className="text-[0.65rem] font-medium text-zinc-500">{agentWho}</span>
          </div>
          <div className="min-h-0 min-w-0 flex-1 overflow-y-auto">
            {liveLine ? (
              <p className="break-words text-[0.88rem] leading-relaxed text-zinc-50 sm:text-[0.95rem]">
                <span className="mr-1 inline-flex align-middle">
                  <Icon className={`h-4 w-4 ${ui.iconClass}`} strokeWidth={2} />
                </span>
                <TypewriterBlock text={liveLine.text} streamKey={streamKey} />
              </p>
            ) : (
              <p className="text-sm text-zinc-500">
                {isRunning
                  ? "Negotiating tool graph…"
                  : "Graph + signal chart animate here while agents stream their output."}
              </p>
            )}
          </div>

          {recentTail.length > 0 && (
            <div className="mt-2 flex min-w-0 shrink-0 gap-2 overflow-x-auto pb-1">
              {recentTail.map((t, idx) => (
                <motion.div
                  key={`${idx}-${t.text.slice(0, 12)}`}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="max-w-[200px] shrink-0 rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1.5"
                >
                  <span className="mb-0.5 block text-[0.55rem] font-semibold uppercase tracking-wide text-zinc-500">
                    {logKindUi[t.kind].label}
                  </span>
                  <span className="line-clamp-2 text-[0.65rem] leading-snug text-zinc-400">{t.text}</span>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      <motion.div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-24 bg-gradient-to-t from-primary-glow/[0.07] to-transparent"
        animate={{ opacity: isRunning ? 1 : 0.4 }}
      />
    </div>
  );
}

function DeliveryVisual({ delivery }: { delivery: ScenarioDelivery }) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-emerald-400/20 bg-gradient-to-br from-emerald-500/[0.08] via-transparent to-primary-glow/[0.05] px-4 py-3">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-emerald-300/95">
          What you get
        </p>
        <h3 className="mt-1.5 font-display text-lg font-semibold tracking-tight text-white sm:text-xl">
          {delivery.headline}
        </h3>
        <p className="mt-1.5 text-sm leading-relaxed text-white/55">{delivery.subhead}</p>
      </div>

      <div className="grid gap-2.5 sm:grid-cols-3">
        {delivery.highlights.map((h, i) => (
          <div
            key={`${h.title}-${i}`}
            className={`rounded-xl border p-3.5 shadow-sm transition-colors ${highlightCardClass[h.variant]}`}
          >
            <p className="text-xs font-semibold text-white/90">{h.title}</p>
            <p className="mt-2 text-[0.8rem] leading-relaxed text-white/60">{h.body}</p>
          </div>
        ))}
      </div>

      <div className="flex items-start gap-2 rounded-lg border border-white/10 bg-black/30 px-3 py-2.5">
        <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary-glow/80" />
        <p className="text-[0.78rem] leading-relaxed text-white/50">{delivery.teamLine}</p>
      </div>
    </div>
  );
}

function nodeXPercent(i: number, n: number) {
  return (100 * (i + 1)) / (n + 1);
}

function NeuralGraph({
  agents,
  activeNode,
  gradientId,
}: {
  agents: AgentDef[];
  activeNode: number;
  gradientId: string;
}) {
  const n = agents.length;
  if (n === 0) return null;

  return (
      <div className="relative mx-auto w-full max-w-xl px-1">
      <svg
        className="pointer-events-none absolute left-0 right-0 top-[38px] h-10 w-full overflow-visible"
        viewBox="0 0 100 24"
        preserveAspectRatio="none"
        aria-hidden
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--primary-glow))" stopOpacity="0.12" />
            <stop offset="50%" stopColor="hsl(var(--primary-glow))" stopOpacity="0.95" />
            <stop offset="100%" stopColor="hsl(var(--primary-glow))" stopOpacity="0.12" />
          </linearGradient>
        </defs>
        {Array.from({ length: n - 1 }, (_, i) => {
          const x1 = nodeXPercent(i, n);
          const x2 = nodeXPercent(i + 1, n);
          const lit = activeNode === i || activeNode === i + 1;
          return (
            <line
              key={`e-${i}`}
              x1={x1}
              y1="12"
              x2={x2}
              y2="12"
              strokeWidth={2.2}
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              stroke={lit ? `url(#${gradientId})` : "rgba(255,255,255,0.12)"}
              style={{
                filter: lit ? "drop-shadow(0 0 5px hsl(var(--primary-glow)))" : "none",
                transition: "stroke 0.35s ease, filter 0.35s ease",
              }}
            />
          );
        })}
      </svg>

      <div className={`relative z-10 grid gap-1 sm:gap-2 ${n === 4 ? "grid-cols-4" : "grid-cols-3"}`}>
          {agents.map(({ id, label, Icon }, i) => {
            const pulsing = activeNode === i;
            return (
              <motion.div
                key={id}
                className="flex flex-col items-center gap-1.5"
                layout
                animate={pulsing ? { scale: [1, 1.07, 1] } : { scale: 1 }}
                transition={{ duration: 0.85, repeat: pulsing ? Infinity : 0, ease: "easeInOut" }}
              >
                <div
                  className={`flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full border bg-obsidian-soft transition-shadow duration-300 ${
                    pulsing
                      ? "border-primary-glow/75 shadow-[0_0_22px_-3px_hsl(var(--primary-glow)/0.8)]"
                      : "border-white/10"
                  }`}
                >
                  <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${pulsing ? "text-primary-glow" : "text-white/45"}`} />
                </div>
                <span className="font-mono text-[0.52rem] sm:text-[0.58rem] uppercase tracking-wider text-center text-white/45 leading-tight">
                  {label}
                </span>
              </motion.div>
            );
          })}
      </div>
    </div>
  );
}

const LiveDemoSection = () => {
  const graphGradientId = useId().replace(/:/g, "");
  const [scenarioId, setScenarioId] = useState(SCENARIOS[0].id);
  const [liveLine, setLiveLine] = useState<LiveLine | null>(null);
  const [streamKey, setStreamKey] = useState(0);
  const [promptKey, setPromptKey] = useState(0);
  const [promptTyped, setPromptTyped] = useState(false);
  const [signalSeries, setSignalSeries] = useState<number[]>([8, 10, 9, 14, 17, 15, 19, 22, 21, 24]);
  const [recentTail, setRecentTail] = useState<{ text: string; kind: LogKind }[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [activeNode, setActiveNode] = useState(-1);
  const [isRunning, setIsRunning] = useState(false);
  const [showDelivery, setShowDelivery] = useState(false);
  const timersRef = useRef<number[]>([]);
  const prevLineRef = useRef<LiveLine | null>(null);

  const scenario = useMemo(
    () => SCENARIOS.find((s) => s.id === scenarioId) ?? SCENARIOS[0],
    [scenarioId]
  );

  const clock = useLiveClock(isRunning);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  }, []);

  useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);

  useEffect(() => {
    clearTimers();
    prevLineRef.current = null;
    setLiveLine(null);
    setRecentTail([]);
    setStreamKey(0);
    setPromptTyped(false);
    setSessionId(null);
    setSignalSeries([8, 10, 9, 14, 17, 15, 19, 22, 21, 24]);
    setShowDelivery(false);
    setActiveNode(-1);
    setIsRunning(false);
  }, [scenarioId, clearTimers]);

  const runWorkflow = () => {
    if (isRunning) return;

    clearTimers();
    setIsRunning(true);
    setShowDelivery(false);
    setActiveNode(-1);
    prevLineRef.current = null;
    setLiveLine(null);
    setRecentTail([]);
    setStreamKey(0);
    setPromptKey((k) => k + 1);
    setPromptTyped(true);
    setSessionId(`RUN-${Date.now().toString(36).toUpperCase()}`);
    setSignalSeries([8, 10, 9, 14, 17, 15, 19, 22, 21, 24]);

    const t = (ms: number, fn: () => void) => {
      const id = window.setTimeout(fn, ms);
      timersRef.current.push(id);
    };

    t(140, () => {
      const line: LiveLine = {
        text: `Handshake OK · edge MY-KUL · mesh latency 38ms · routing "${scenario.title}"`,
        kind: "plain",
        agentIndex: -1,
      };
      prevLineRef.current = line;
      setLiveLine(line);
      setStreamKey((k) => k + 1);
      setSignalSeries((prev) => {
        const tail = prev[prev.length - 1] ?? 18;
        return [...prev.slice(-14), Math.min(98, tail + 5 + Math.random() * 8)];
      });
    });

    for (const step of scenario.steps) {
      t(step.atMs, () => {
        const prev = prevLineRef.current;
        if (prev) {
          setRecentTail((r) => [...r.slice(-3), { text: prev.text, kind: prev.kind }]);
        }
        const next: LiveLine = {
          text: step.text,
          kind: step.kind,
          agentIndex: step.agentIndex,
        };
        prevLineRef.current = next;
        setLiveLine(next);
        setStreamKey((k) => k + 1);
        setActiveNode(step.agentIndex);
        setSignalSeries((prev) => {
          const tail = prev[prev.length - 1] ?? 20;
          const bump = Math.min(99, tail + 3.5 + Math.random() * 11);
          return [...prev.slice(-15), bump];
        });
      });
    }

    t(scenario.deliveryAtMs, () => {
      setActiveNode(-1);
      setShowDelivery(true);
    });

    t(scenario.deliveryAtMs + 450, () => {
      setIsRunning(false);
    });
  };

  return (
    <section id="live-demo" className="overflow-x-hidden border-t border-border bg-paper px-[5vw] py-14 md:py-24">
      <div className="mx-auto max-w-6xl reveal">
        <div className="eyebrow mb-3 text-primary">Interactive lab</div>
        <h2 className="display mb-3 text-balance text-foreground">
          See the Agents in <em className="not-italic italic text-primary">Action</em>
        </h2>
        <p className="body-prose mb-6 max-w-2xl text-[0.96rem] md:mb-8">
          Each card loads a different <span className="font-medium text-foreground">live prompt</span> — the kind
          of message you would actually paste to an ops copilot. Run it: a real-time clock, session id, animated signal
          chart, agent energy bars, and streaming text so it feels like a command centre, not a static mock-up.
        </p>

        <div className="overflow-x-hidden overflow-y-visible rounded-xl border border-white/10 bg-obsidian/90 shadow-elevated ring-1 ring-white/[0.04] backdrop-blur-2xl md:rounded-2xl">
          {/* Prompt deck */}
          <div className="border-b border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent px-3 py-4 sm:px-4 md:px-8 md:py-6">
            <div className="font-mono text-[0.58rem] tracking-[0.2em] uppercase text-primary-glow/90 mb-3">
              1 · Pick a story you recognise
            </div>
            <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-0.5 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-2 md:overflow-visible md:px-0 md:pb-0 xl:grid-cols-4">
              {SCENARIOS.map((s) => {
                const selected = s.id === scenarioId;
                return (
                  <button
                    key={s.id}
                    type="button"
                    disabled={isRunning}
                    onClick={() => {
                      if (isRunning) return;
                      setScenarioId(s.id);
                    }}
                    className={`min-w-[86%] snap-start text-left rounded-xl border px-3.5 py-3 transition-all duration-200 md:min-w-0 md:px-4 md:py-3.5 ${
                      selected
                        ? "border-primary-glow/50 bg-primary-glow/[0.08] shadow-[0_0_0_1px_hsl(var(--primary-glow)/0.25)]"
                        : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]"
                    } disabled:opacity-60 disabled:pointer-events-none`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="font-mono text-[0.58rem] uppercase tracking-wider text-primary-glow/90">
                        {s.tag}
                      </span>
                      {selected && (
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_hsl(var(--success)/0.7)]" />
                      )}
                    </div>
                    <div className="text-sm font-semibold text-white/90 leading-snug mb-1">{s.title}</div>
                    <p className="text-[0.72rem] leading-relaxed text-white/45 line-clamp-2">{s.description}</p>
                    <div className="mt-2.5 flex flex-wrap gap-1">
                      {s.agents.map((ag) => {
                        const Icon = ag.Icon;
                        return (
                          <span
                            key={ag.id}
                            className="inline-flex items-center gap-1 rounded-sm border border-white/10 bg-black/30 px-1.5 py-0.5 font-mono text-[0.55rem] uppercase tracking-wide text-white/50"
                          >
                            <Icon className="h-3 w-3 opacity-70" />
                            {ag.label}
                          </span>
                        );
                      })}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid min-w-0 lg:grid-cols-5">
            <div className="flex min-w-0 flex-col gap-6 border-b border-white/10 p-4 sm:p-5 md:p-6 lg:col-span-2 lg:gap-8 lg:border-b-0 lg:border-r lg:p-8">
              <div>
                <div className="font-mono text-[0.58rem] tracking-[0.18em] uppercase text-primary-glow/90 mb-2">
                  2 · Run the live mesh
                </div>
                <div className="mb-4 rounded-lg border border-white/10 bg-black/25 px-3 py-2.5 sm:px-3.5">
                  <div className="text-[0.65rem] font-medium uppercase tracking-wide text-white/40 mb-1">
                    What this story is about
                  </div>
                  <div className="text-sm font-semibold text-white/90">{scenario.title}</div>
                  <div className="mt-2 text-[0.8rem] text-white/60 leading-relaxed">{scenario.intentLine}</div>
                </div>
                <button
                  type="button"
                  onClick={runWorkflow}
                  disabled={isRunning}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-primary-foreground shadow-cinema transition hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50 sm:w-auto sm:px-6"
                >
                  <Play className="h-3.5 w-3.5 fill-current" />
                  Run the agents
                </button>
                <p className="mt-2 text-[0.7rem] leading-relaxed text-white/40">
                  Simulated run for the landing page — timing, charts, and copy are choreographed to feel like a live
                  session.
                </p>
              </div>

              <div>
                <div className="font-mono text-[0.58rem] tracking-[0.18em] uppercase text-white/35 mb-1">
                  Who is working right now
                </div>
                <p className="mb-3 text-[0.7rem] leading-relaxed text-white/35">
                  The ring lights up on the agent that is “speaking” in the feed beside it.
                </p>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={scenario.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.25 }}
                  >
                    <NeuralGraph agents={scenario.agents} activeNode={activeNode} gradientId={graphGradientId} />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            <div className="relative min-h-[320px] min-w-0 bg-black/45 p-4 sm:p-5 md:p-6 lg:col-span-3 lg:min-h-[520px] lg:p-8">
              <div className="font-mono text-[0.58rem] tracking-[0.18em] uppercase text-white/35 mb-1">
                Live execution console
              </div>
              <p className="mb-3 text-[0.7rem] text-white/35">
                Streaming prompt + agent output, signal chart, and per-agent load — then the summary sheet drops in.
              </p>
              <div className="relative overflow-hidden rounded-lg border border-white/10 bg-[#04060c] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.03] px-3 py-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="flex gap-1.5 shrink-0">
                      <span className="h-2.5 w-2.5 rounded-full bg-red-500/90" />
                      <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
                    </span>
                    <span className="truncate text-[0.72rem] text-zinc-200">
                      mesh_console · <span className="text-zinc-400">{scenario.title}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-50" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                    </span>
                    <span className="text-[0.58rem] font-semibold uppercase tracking-wider text-emerald-400/90">
                      {isRunning ? "RX" : showDelivery ? "OK" : "—"}
                    </span>
                  </div>
                </div>

                <div className="relative h-[500px] min-h-0 sm:h-[560px] lg:h-[min(700px,calc(100vh-180px))]">
                  <motion.div
                    className="absolute inset-0 min-h-0 min-w-0 overflow-hidden"
                    animate={{ opacity: showDelivery ? 0.06 : 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <ExecutionDeck
                      scenario={scenario}
                      isRunning={isRunning}
                      showDelivery={showDelivery}
                      activeNode={activeNode}
                      liveLine={liveLine}
                      streamKey={streamKey}
                      signalSeries={signalSeries}
                      clock={clock}
                      sessionId={sessionId}
                      promptTyped={promptTyped}
                      promptKey={promptKey}
                      recentTail={recentTail}
                    />
                  </motion.div>

                  <AnimatePresence>
                    {showDelivery && (
                      <motion.div
                        initial={{ opacity: 0, y: 28 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 12 }}
                        transition={{ type: "spring", stiffness: 320, damping: 28 }}
                        className="absolute inset-0 z-10 flex flex-col overflow-y-auto overscroll-contain border border-emerald-500/30 bg-gradient-to-b from-[#0a1412] via-obsidian-soft to-obsidian p-4 shadow-elevated ring-1 ring-emerald-500/10"
                      >
                        <DeliveryVisual delivery={scenario.delivery} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiveDemoSection;
