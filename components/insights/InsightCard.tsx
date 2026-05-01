"use client";

import { TrendingUp, AlertTriangle, Lightbulb, Target, Users, Star } from "lucide-react";
import type { Insight } from "@/types";

interface InsightCardProps {
  insight: Insight;
}

const CATEGORY_CONFIG = {
  opportunity: {
    icon: TrendingUp,
    color: "#fbbf24",
    bg: "rgba(251,191,36,0.08)",
    border: "rgba(251,191,36,0.2)",
    label: "Opportunity",
  },
  risk: {
    icon: AlertTriangle,
    color: "#f87171",
    bg: "rgba(239,68,68,0.08)",
    border: "rgba(239,68,68,0.2)",
    label: "Risk",
  },
  trend: {
    icon: TrendingUp,
    color: "#60a5fa",
    bg: "rgba(96,165,250,0.08)",
    border: "rgba(96,165,250,0.15)",
    label: "Trend",
  },
  recommendation: {
    icon: Lightbulb,
    color: "#34d399",
    bg: "rgba(52,211,153,0.08)",
    border: "rgba(52,211,153,0.2)",
    label: "Recommendation",
  },
  segment: {
    icon: Users,
    color: "#c084fc",
    bg: "rgba(192,132,252,0.08)",
    border: "rgba(192,132,252,0.2)",
    label: "Segment",
  },
  feature: {
    icon: Star,
    color: "#fb923c",
    bg: "rgba(251,146,60,0.08)",
    border: "rgba(251,146,60,0.2)",
    label: "Feature",
  },
};

const CONFIDENCE_CONFIG = {
  high: { color: "#34d399", label: "High confidence" },
  medium: { color: "#fbbf24", label: "Medium confidence" },
  low: { color: "#f87171", label: "Low confidence" },
};

export default function InsightCard({ insight }: InsightCardProps) {
  const cat = CATEGORY_CONFIG[insight.category] || CATEGORY_CONFIG.recommendation;
  const conf = CONFIDENCE_CONFIG[insight.confidence] || CONFIDENCE_CONFIG.medium;
  const Icon = cat.icon;

  return (
    <div
      className="rounded-xl p-4 transition-all duration-200 hover:scale-[1.01]"
      style={{
        background: cat.bg,
        border: `1px solid ${cat.border}`,
        borderLeft: `3px solid ${cat.color}`,
      }}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: `${cat.color}20` }}
          >
            <Icon size={12} style={{ color: cat.color }} />
          </div>
          <span
            className="text-[10px] font-semibold uppercase tracking-wider"
            style={{ color: cat.color }}
          >
            {cat.label}
          </span>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <div
            className="flex items-center gap-1 text-[10px]"
            style={{ color: conf.color }}
          >
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: conf.color }}
            />
            {conf.label}
          </div>
          <span
            className="font-mono text-[10px] px-1.5 py-0.5 rounded"
            style={{
              background: "rgba(212,199,184,0.06)",
              color: "var(--text-muted)",
            }}
          >
            P{insight.priority}
          </span>
        </div>
      </div>

      <h3
        className="font-semibold text-sm mb-1.5 leading-snug"
        style={{ color: "var(--text-primary)" }}
      >
        {insight.title}
      </h3>
      <p
        className="text-xs leading-relaxed mb-3"
        style={{ color: "var(--text-secondary)" }}
      >
        {insight.description}
      </p>

      {insight.evidence && insight.evidence.length > 0 && (
        <div
          className="rounded-lg px-3 py-2 mb-3"
          style={{
            background: "rgba(0,0,0,0.2)",
            border: "1px solid var(--border-subtle)",
          }}
        >
          <div
            className="text-[10px] font-medium mb-1"
            style={{ color: "var(--text-muted)" }}
          >
            Evidence
          </div>
          <ul className="space-y-0.5">
            {insight.evidence.slice(0, 2).map((e, i) => (
              <li
                key={i}
                className="text-xs italic"
                style={{ color: "var(--text-muted)" }}
              >
                &ldquo;{e}&rdquo;
              </li>
            ))}
          </ul>
        </div>
      )}

      {insight.affectedPersonas && insight.affectedPersonas.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {insight.affectedPersonas.map((name) => (
            <span
              key={name}
              className="text-[10px] px-1.5 py-0.5 rounded"
              style={{
                background: "rgba(212,199,184,0.06)",
                border: "1px solid var(--border-subtle)",
                color: "var(--text-muted)",
              }}
            >
              {name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
