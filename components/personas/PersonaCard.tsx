"use client";

import { useState } from "react";
import {
  MapPin,
  Briefcase,
  GraduationCap,
  DollarSign,
  Zap,
  Target,
  AlertCircle,
  Heart,
  Trash2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import type { Persona } from "@/types";

interface PersonaCardProps {
  persona: Persona;
  selected?: boolean;
  selectable?: boolean;
  onSelect?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const techColors = {
  low: { bg: "rgba(239, 68, 68, 0.1)", text: "#f87171", border: "rgba(239, 68, 68, 0.2)" },
  medium: { bg: "rgba(251, 191, 36, 0.1)", text: "#fbbf24", border: "rgba(251, 191, 36, 0.2)" },
  high: { bg: "rgba(52, 211, 153, 0.1)", text: "#34d399", border: "rgba(52, 211, 153, 0.2)" },
};

function avatarInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function avatarColor(name: string): string {
  const colors = [
    ["#fbbf24", "#92400e"],
    ["#7ab86e", "#14532d"],
    ["#60a5fa", "#1e3a5f"],
    ["#c084fc", "#4a1d96"],
    ["#fb923c", "#7c2d12"],
  ];
  const idx = name.charCodeAt(0) % colors.length;
  return `radial-gradient(circle, ${colors[idx][0]}44, ${colors[idx][1]}88)`;
}

export default function PersonaCard({
  persona,
  selected = false,
  selectable = false,
  onSelect,
  onDelete,
}: PersonaCardProps) {
  const [expanded, setExpanded] = useState(false);
  const tech = techColors[persona.techSavviness];

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-200 cursor-pointer"
      style={{
        background: "var(--bg-card)",
        border: selected
          ? "1px solid var(--amber-400)"
          : "1px solid var(--border-subtle)",
        boxShadow: selected ? "var(--glow-amber)" : "none",
      }}
      onClick={() => selectable && onSelect?.(persona.id)}
    >
      {/* Header */}
      <div
        className="p-5 pb-4"
        style={{ borderBottom: "1px solid var(--border-subtle)" }}
      >
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center font-display font-bold text-sm flex-shrink-0"
            style={{ background: avatarColor(persona.name) }}
          >
            {avatarInitials(persona.name)}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <h3
                className="font-display font-semibold text-base truncate"
                style={{ color: "var(--text-primary)" }}
              >
                {persona.name}
              </h3>
              {selectable && (
                <div
                  className="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all"
                  style={{
                    borderColor: selected
                      ? "var(--amber-400)"
                      : "var(--text-muted)",
                    background: selected ? "var(--amber-400)" : "transparent",
                  }}
                >
                  {selected && (
                    <div className="w-1.5 h-1.5 rounded-full bg-black" />
                  )}
                </div>
              )}
            </div>
            <div
              className="text-sm flex items-center gap-1"
              style={{ color: "var(--text-secondary)" }}
            >
              <Briefcase size={11} />
              <span className="truncate">{persona.occupation}</span>
            </div>
          </div>

          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(persona.id);
              }}
              className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/10"
              style={{ color: "var(--text-muted)" }}
            >
              <Trash2 size={13} />
            </button>
          )}
        </div>

        {/* Meta row */}
        <div
          className="flex items-center gap-3 mt-3 text-xs"
          style={{ color: "var(--text-muted)" }}
        >
          <span className="flex items-center gap-1">
            <MapPin size={10} />
            {persona.location}
          </span>
          <span>·</span>
          <span>{persona.age} yrs</span>
          <span>·</span>
          <span
            className="px-1.5 py-0.5 rounded"
            style={{
              background: tech.bg,
              color: tech.text,
              border: `1px solid ${tech.border}`,
            }}
          >
            <Zap size={9} className="inline mr-1" />
            {persona.techSavviness} tech
          </span>
        </div>
      </div>

      {/* Quote */}
      <div
        className="px-5 py-3"
        style={{ borderBottom: "1px solid var(--border-subtle)" }}
      >
        <p
          className="text-xs italic leading-relaxed"
          style={{ color: "var(--text-secondary)" }}
        >
          &ldquo;{persona.quote}&rdquo;
        </p>
      </div>

      {/* Tags */}
      <div className="px-5 py-3 flex flex-wrap gap-1.5">
        {persona.tags.slice(0, 4).map((tag) => (
          <span key={tag} className="tag tag-ink">
            {tag}
          </span>
        ))}
      </div>

      {/* Expandable details */}
      <div
        className="px-5 pb-2"
        style={{ borderTop: "1px solid var(--border-subtle)" }}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(!expanded);
          }}
          className="flex items-center gap-1 text-xs py-2 transition-colors"
          style={{ color: "var(--text-muted)" }}
        >
          {expanded ? (
            <>
              <ChevronUp size={12} /> Less detail
            </>
          ) : (
            <>
              <ChevronDown size={12} /> More detail
            </>
          )}
        </button>

        {expanded && (
          <div className="pb-3 space-y-3 animate-fade-in">
            <Section
              icon={<Target size={12} style={{ color: "#fbbf24" }} />}
              title="Goals"
              items={persona.goals}
            />
            <Section
              icon={<AlertCircle size={12} style={{ color: "#f87171" }} />}
              title="Pain Points"
              items={persona.painPoints}
            />
            <Section
              icon={<Heart size={12} style={{ color: "#c084fc" }} />}
              title="Motivations"
              items={persona.motivations}
            />
            <div>
              <div
                className="flex items-center gap-1.5 text-xs font-medium mb-1.5"
                style={{ color: "var(--text-secondary)" }}
              >
                <GraduationCap size={12} style={{ color: "#60a5fa" }} />
                <span>Background</span>
              </div>
              <div className="grid grid-cols-2 gap-1 text-xs">
                <InfoPill label="Income" value={persona.income} />
                <InfoPill label="Education" value={persona.education} />
              </div>
            </div>
            <div>
              <div
                className="text-xs font-medium mb-1.5"
                style={{ color: "var(--text-secondary)" }}
              >
                Bio
              </div>
              <p
                className="text-xs leading-relaxed"
                style={{ color: "var(--text-muted)" }}
              >
                {persona.bio}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Section({
  icon,
  title,
  items,
}: {
  icon: React.ReactNode;
  title: string;
  items: string[];
}) {
  return (
    <div>
      <div
        className="flex items-center gap-1.5 text-xs font-medium mb-1.5"
        style={{ color: "var(--text-secondary)" }}
      >
        {icon}
        <span>{title}</span>
      </div>
      <ul className="space-y-1">
        {items.map((item, i) => (
          <li
            key={i}
            className="text-xs flex items-start gap-1.5"
            style={{ color: "var(--text-muted)" }}
          >
            <span
              className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0"
              style={{ background: "var(--text-muted)" }}
            />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function InfoPill({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="rounded-lg p-2"
      style={{ background: "var(--bg-elevated)" }}
    >
      <div
        className="text-[10px] mb-0.5"
        style={{ color: "var(--text-muted)" }}
      >
        {label}
      </div>
      <div
        className="text-xs font-medium truncate"
        style={{ color: "var(--text-secondary)" }}
      >
        {value}
      </div>
    </div>
  );
}
