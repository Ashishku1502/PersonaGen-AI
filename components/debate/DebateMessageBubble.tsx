"use client";

import type { DebateMessage } from "@/types";

interface DebateMessageBubbleProps {
  message: DebateMessage;
  streaming?: boolean;
  streamingChunk?: string;
  colorIndex: number;
}

const PERSONA_COLORS = [
  { accent: "#fbbf24", bg: "rgba(251,191,36,0.06)", initial: "#92400e" },
  { accent: "#7ab86e", bg: "rgba(122,184,110,0.06)", initial: "#14532d" },
  { accent: "#60a5fa", bg: "rgba(96,165,250,0.06)", initial: "#1e3a5f" },
  { accent: "#c084fc", bg: "rgba(192,132,252,0.06)", initial: "#4a1d96" },
  { accent: "#fb923c", bg: "rgba(251,146,60,0.06)", initial: "#7c2d12" },
];

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function DebateMessageBubble({
  message,
  streaming = false,
  streamingChunk = "",
  colorIndex,
}: DebateMessageBubbleProps) {
  const color = PERSONA_COLORS[colorIndex % PERSONA_COLORS.length];
  const content = streaming ? streamingChunk : message.content;

  return (
    <div className="flex gap-3 animate-slide-up">
      {/* Avatar */}
      <div
        className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
        style={{
          background: `linear-gradient(135deg, ${color.accent}33, ${color.initial}66)`,
          border: `1px solid ${color.accent}33`,
          color: color.accent,
        }}
      >
        {initials(message.personaName)}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5">
          <span
            className="text-sm font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            {message.personaName}
          </span>
          <span
            className="text-xs px-1.5 py-0.5 rounded font-mono"
            style={{
              background: `${color.accent}15`,
              color: color.accent,
            }}
          >
            R{message.round}
          </span>
          {!streaming && (
            <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>
              {new Date(message.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          )}
        </div>

        <div
          className="rounded-xl px-4 py-3 text-sm leading-relaxed relative"
          style={{
            background: color.bg,
            border: `1px solid ${color.accent}20`,
            color: "var(--text-secondary)",
            borderLeft: `3px solid ${streaming ? color.accent : color.accent + "80"}`,
          }}
        >
          {content}
          {streaming && <span className="streaming-cursor" />}
        </div>
      </div>
    </div>
  );
}
