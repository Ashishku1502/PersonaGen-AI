import Link from "next/link";
import { Users, MessageSquare, BarChart3, ArrowRight, Zap } from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Persona Generation",
    description:
      "Generate hyper-realistic user personas powered by Claude. Define your research context and get detailed psychographic profiles with goals, pain points, behaviors, and more.",
    href: "/personas",
    cta: "Generate Personas",
    color: "amber",
    accent: "rgba(251, 191, 36, 0.1)",
    border: "rgba(251, 191, 36, 0.2)",
    iconColor: "#fbbf24",
  },
  {
    icon: MessageSquare,
    title: "Debate Arena",
    description:
      "Pit multiple personas against each other in structured, multi-round debates. Watch them argue, agree, and reveal authentic behavioral patterns — streamed live via SSE.",
    href: "/debate",
    cta: "Start Debate",
    color: "sage",
    accent: "rgba(82, 119, 74, 0.1)",
    border: "rgba(82, 119, 74, 0.2)",
    iconColor: "#7ab86e",
  },
  {
    icon: BarChart3,
    title: "Market Insights",
    description:
      "Extract structured insights from your personas and debate sessions. Get executive summaries, opportunity mapping, segment analysis, and prioritized recommendations.",
    href: "/insights",
    cta: "Extract Insights",
    color: "blue",
    accent: "rgba(96, 165, 250, 0.08)",
    border: "rgba(96, 165, 250, 0.18)",
    iconColor: "#60a5fa",
  },
];

const stats = [
  { value: "3-Step", label: "Research Pipeline" },
  { value: "SSE", label: "Real-time Streaming" },
  { value: "Atlas", label: "Vector Search Memory" },
  { value: "Claude", label: "AI Engine" },
];

export default function DashboardPage() {
  return (
    <div className="min-h-full p-8">
      {/* Hero */}
      <div className="max-w-3xl mb-12">
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs mb-6"
          style={{
            background: "rgba(251, 191, 36, 0.08)",
            border: "1px solid rgba(251, 191, 36, 0.2)",
            color: "var(--amber-400)",
          }}
        >
          <Zap size={11} />
          <span>AI-Powered Market Research Platform</span>
        </div>

        <h1
          className="font-display text-5xl font-bold leading-tight mb-4"
          style={{ color: "var(--text-primary)" }}
        >
          Understand your users
          <br />
          <em style={{ color: "var(--amber-400)", fontStyle: "italic" }}>
            before they exist
          </em>
        </h1>

        <p
          className="text-lg leading-relaxed max-w-2xl"
          style={{ color: "var(--text-secondary)" }}
        >
          PersonaGen AI generates richly detailed user personas, simulates
          authentic multi-persona debates, and distills everything into
          actionable market insights — all powered by Claude and Atlas Vector
          Search.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-10">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-xl p-4 text-center"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-subtle)",
            }}
          >
            <div
              className="font-display text-2xl font-bold mb-1"
              style={{ color: "var(--amber-400)" }}
            >
              {s.value}
            </div>
            <div className="text-xs" style={{ color: "var(--text-muted)" }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        {features.map((f, i) => {
          const Icon = f.icon;
          return (
            <div
              key={f.href}
              className="rounded-2xl p-6 flex flex-col"
              style={{
                background: f.accent,
                border: `1px solid ${f.border}`,
                animationDelay: `${i * 0.1}s`,
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                style={{
                  background: `${f.iconColor}18`,
                  border: `1px solid ${f.iconColor}30`,
                }}
              >
                <Icon size={18} style={{ color: f.iconColor }} />
              </div>

              <h2
                className="font-display text-xl font-semibold mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                {f.title}
              </h2>

              <p
                className="text-sm leading-relaxed flex-1 mb-6"
                style={{ color: "var(--text-secondary)" }}
              >
                {f.description}
              </p>

              <Link
                href={f.href}
                className="inline-flex items-center gap-2 text-sm font-medium transition-all group"
                style={{ color: f.iconColor }}
              >
                {f.cta}
                <ArrowRight
                  size={14}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </div>
          );
        })}
      </div>

      {/* Architecture diagram */}
      <div
        className="rounded-2xl p-6"
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-subtle)",
        }}
      >
        <h3
          className="font-display text-lg font-semibold mb-4"
          style={{ color: "var(--text-primary)" }}
        >
          Pipeline Architecture
        </h3>
        <div className="flex items-center gap-3 flex-wrap">
          {[
            {
              step: "01",
              name: "Persona Generation",
              tech: "Claude + MongoDB Atlas",
            },
            { step: "→", name: "", tech: "" },
            {
              step: "02",
              name: "Debate Engine",
              tech: "SSE Streaming + Claude",
            },
            { step: "→", name: "", tech: "" },
            {
              step: "03",
              name: "Insight Extraction",
              tech: "Prompt Chains + Vector Memory",
            },
          ].map((item, i) =>
            item.step === "→" ? (
              <div
                key={i}
                className="text-xl font-light"
                style={{ color: "var(--text-muted)" }}
              >
                →
              </div>
            ) : (
              <div
                key={i}
                className="flex-1 min-w-[160px] rounded-xl p-4"
                style={{
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border-default)",
                }}
              >
                <div
                  className="font-mono text-xs mb-1"
                  style={{ color: "var(--amber-400)" }}
                >
                  STEP {item.step}
                </div>
                <div
                  className="font-semibold text-sm mb-1"
                  style={{ color: "var(--text-primary)" }}
                >
                  {item.name}
                </div>
                <div
                  className="text-xs"
                  style={{ color: "var(--text-muted)" }}
                >
                  {item.tech}
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
