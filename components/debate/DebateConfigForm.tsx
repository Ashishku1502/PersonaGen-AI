"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Users, Loader2, Play } from "lucide-react";
import PersonaCard from "@/components/personas/PersonaCard";
import type { Persona, DebateConfig } from "@/types";

interface DebateConfigFormProps {
  onStart: (config: DebateConfig) => void;
  loading: boolean;
}

export default function DebateConfigForm({
  onStart,
  loading,
}: DebateConfigFormProps) {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [topic, setTopic] = useState("");
  const [rounds, setRounds] = useState(3);
  const [focusArea, setFocusArea] = useState("");
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetch("/api/personas?limit=20")
      .then((r) => r.json())
      .then((j) => {
        if (j.success) setPersonas(j.data);
      })
      .finally(() => setFetching(false));
  }, []);

  const togglePersona = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleStart = () => {
    if (!topic.trim() || selected.length < 2) return;
    onStart({ topic, personaIds: selected, rounds, focusArea, moderatorEnabled: false });
  };

  const exampleTopics = [
    "Would you pay ₹5,000/month for a fully managed rental service?",
    "How do you discover new apps — app store, social media, or word of mouth?",
    "What would make you switch from your current project management tool?",
  ];

  return (
    <div className="space-y-5">
      {/* Topic */}
      <div>
        <label
          className="block text-sm font-medium mb-2"
          style={{ color: "var(--text-secondary)" }}
        >
          Debate Topic <span style={{ color: "var(--amber-400)" }}>*</span>
        </label>
        <textarea
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter a question, hypothesis, or product decision to debate..."
          rows={2}
          className="w-full rounded-xl px-4 py-3 text-sm resize-none outline-none transition-colors"
          style={{
            background: "var(--bg-elevated)",
            border: "1px solid var(--border-default)",
            color: "var(--text-primary)",
          }}
          onFocus={(e) => (e.target.style.borderColor = "var(--amber-400)")}
          onBlur={(e) => (e.target.style.borderColor = "var(--border-default)")}
        />
        <div className="mt-2 flex flex-wrap gap-1.5">
          {exampleTopics.map((t) => (
            <button
              key={t}
              onClick={() => setTopic(t)}
              className="text-[11px] px-2 py-1 rounded-lg transition-colors text-left"
              style={{
                background: "var(--bg-elevated)",
                border: "1px solid var(--border-subtle)",
                color: "var(--text-muted)",
              }}
            >
              {t.slice(0, 50)}…
            </button>
          ))}
        </div>
      </div>

      {/* Focus area */}
      <div>
        <label
          className="block text-xs font-medium mb-1.5"
          style={{ color: "var(--text-muted)" }}
        >
          Focus Area (optional)
        </label>
        <input
          value={focusArea}
          onChange={(e) => setFocusArea(e.target.value)}
          placeholder="e.g. pricing sensitivity, feature preferences, trust factors"
          className="w-full rounded-lg px-3 py-2 text-sm outline-none"
          style={{
            background: "var(--bg-elevated)",
            border: "1px solid var(--border-default)",
            color: "var(--text-primary)",
          }}
        />
      </div>

      {/* Rounds */}
      <div>
        <label
          className="block text-xs font-medium mb-1.5"
          style={{ color: "var(--text-muted)" }}
        >
          Debate Rounds
        </label>
        <div className="flex gap-2">
          {[2, 3, 4].map((n) => (
            <button
              key={n}
              onClick={() => setRounds(n)}
              className="flex-1 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                background:
                  rounds === n ? "rgba(251,191,36,0.15)" : "var(--bg-elevated)",
                border:
                  rounds === n
                    ? "1px solid var(--amber-400)"
                    : "1px solid var(--border-default)",
                color: rounds === n ? "var(--amber-400)" : "var(--text-muted)",
              }}
            >
              {n} rounds
            </button>
          ))}
        </div>
      </div>

      {/* Persona selection */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label
            className="text-sm font-medium"
            style={{ color: "var(--text-secondary)" }}
          >
            Select Personas{" "}
            <span style={{ color: "var(--text-muted)" }}>
              (min 2, max 4)
            </span>
          </label>
          {selected.length > 0 && (
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{
                background: "rgba(251,191,36,0.1)",
                color: "var(--amber-400)",
              }}
            >
              {selected.length} selected
            </span>
          )}
        </div>

        {fetching ? (
          <div className="text-sm" style={{ color: "var(--text-muted)" }}>
            Loading personas…
          </div>
        ) : personas.length === 0 ? (
          <div
            className="rounded-xl p-4 text-sm text-center"
            style={{
              background: "var(--bg-elevated)",
              border: "1px solid var(--border-subtle)",
              color: "var(--text-muted)",
            }}
          >
            <Users size={20} className="mx-auto mb-2 opacity-30" />
            No personas found. Generate some first on the Personas page.
          </div>
        ) : (
          <div className="space-y-2 max-h-80 overflow-y-auto scroll-thin pr-1">
            {personas.map((p) => (
              <PersonaCard
                key={p.id}
                persona={p}
                selected={selected.includes(p.id)}
                selectable
                onSelect={(id) => {
                  if (!selected.includes(id) && selected.length >= 4) return;
                  togglePersona(id);
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Start button */}
      <button
        onClick={handleStart}
        disabled={loading || !topic.trim() || selected.length < 2}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        style={{
          background: "rgba(251,191,36,0.15)",
          border: "1px solid rgba(251,191,36,0.35)",
          color: "var(--amber-400)",
        }}
      >
        {loading ? (
          <>
            <Loader2 size={15} className="animate-spin" /> Starting debate…
          </>
        ) : (
          <>
            <Play size={15} /> Start Debate
          </>
        )}
      </button>
    </div>
  );
}
