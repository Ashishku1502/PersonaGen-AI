"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, CheckCircle2, Circle, ChevronLeft, Settings, X } from "lucide-react";
import DebateConfigForm from "@/components/debate/DebateConfigForm";
import DebateMessageBubble from "@/components/debate/DebateMessageBubble";
import type { DebateConfig, DebateMessage, StreamEvent } from "@/types";

interface StreamingState {
  personaId: string;
  personaName: string;
  chunk: string;
  round: number;
}

const PERSONA_COLORS = ["#fbbf24", "#7ab86e", "#60a5fa", "#c084fc"];

export default function DebatePage() {
  const [status, setStatus] = useState<
    "idle" | "running" | "completed" | "error"
  >("idle");
  const [messages, setMessages] = useState<DebateMessage[]>([]);
  const [streaming, setStreaming] = useState<StreamingState | null>(null);
  const [topic, setTopic] = useState("");
  const [rounds, setRounds] = useState(3);
  const [currentRound, setCurrentRound] = useState(0);
  const [personaNames, setPersonaNames] = useState<string[]>([]);
  const [summary, setSummary] = useState<string | null>(null);
  const [showSummary, setShowSummary] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streaming?.chunk]);

  const handleStart = async (config: DebateConfig) => {
    setStatus("running");
    setMessages([]);
    setStreaming(null);
    setSummary(null);
    setShowSummary(true);
    setError(null);
    setTopic(config.topic);
    setRounds(config.rounds);
    setCurrentRound(1);
    setSidebarOpen(false); // Auto-collapse when starting

    abortRef.current = new AbortController();

    try {
      const res = await fetch("/api/debate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
        signal: abortRef.current.signal,
      });

      if (!res.ok || !res.body) throw new Error("Stream failed");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const event: StreamEvent = JSON.parse(line.slice(6));
            handleEvent(event, config.personaIds);
          } catch {
            // malformed chunk
          }
        }
      }
    } catch (e) {
      if ((e as Error).name !== "AbortError") {
        setError("Stream disconnected. Please try again.");
        setStatus("error");
      }
    }
  };

  const handleEvent = (event: StreamEvent, personaIds: string[]) => {
    switch (event.type) {
      case "message_start":
        setCurrentRound(event.round || 1);
        setStreaming({
          personaId: event.personaId!,
          personaName: event.personaName!,
          chunk: "",
          round: event.round || 1,
        });
        break;

      case "message_chunk":
        setStreaming((prev) =>
          prev ? { ...prev, chunk: prev.chunk + (event.chunk || "") } : prev
        );
        break;

      case "message_end":
        if (event.message) {
          setMessages((prev) => [...prev, event.message!]);
          setPersonaNames((prev) => {
            const name = event.message!.personaName;
            return prev.includes(name) ? prev : [...prev, name];
          });
        }
        setStreaming(null);
        break;

      case "round_end":
        setCurrentRound((r) => r + 1);
        break;

      case "debate_end":
        setSummary(event.summary || null);
        setStatus("completed");
        setStreaming(null);
        break;

      case "error":
        setError(event.error || "Unknown error");
        setStatus("error");
        break;
    }
  };

  const getPersonaColorIndex = (name: string) => {
    const idx = personaNames.indexOf(name);
    return idx >= 0 ? idx : 0;
  };

  return (
    <div className="flex h-full overflow-hidden">
      {/* Config panel */}
      <div
        className={`flex-shrink-0 p-6 overflow-y-auto scroll-thin transition-all duration-300 ease-in-out relative ${
          sidebarOpen ? "w-[360px]" : "w-0 p-0 overflow-hidden border-none"
        }`}
        style={{ 
          borderRight: sidebarOpen ? "1px solid var(--border-subtle)" : "none",
          background: "var(--bg-elevated)"
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <MessageSquare size={16} style={{ color: "var(--amber-400)" }} />
            <h1
              className="font-display text-xl font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              Arena
            </h1>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="p-1.5 rounded-lg hover:bg-white/5 transition-colors"
            style={{ color: "var(--text-muted)" }}
            title="Fechar Configurações"
          >
            <ChevronLeft size={18} />
          </button>
        </div>
        <DebateConfigForm
          onStart={handleStart}
          loading={status === "running"}
        />
      </div>

      {/* Debate stream panel */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Toggle Button when sidebar is closed */}
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="absolute left-4 top-4 z-50 p-2.5 rounded-xl bg-amber-400 text-black shadow-lg hover:scale-105 transition-all"
            title="Abrir Configurações"
          >
            <Settings size={20} />
          </button>
        )}

        {status === "idle" ? (
          <div
            className="flex-1 flex flex-col items-center justify-center gap-4"
            style={{ color: "var(--text-muted)" }}
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{
                background: "rgba(251,191,36,0.08)",
                border: "1px solid rgba(251,191,36,0.15)",
              }}
            >
              <MessageSquare
                size={28}
                style={{ color: "var(--amber-400)", opacity: 0.6 }}
              />
            </div>
            <p className="text-sm">
              Configure a debate on the left and click Start
            </p>
          </div>
        ) : (
          <>
            {/* Header bar */}
            <div
              className={`px-6 py-3 flex items-center justify-between flex-shrink-0 transition-all ${!sidebarOpen ? 'pl-20' : ''}`}
              style={{ borderBottom: "1px solid var(--border-subtle)" }}
            >
              <div>
                <p
                  className="text-sm font-medium truncate max-w-lg"
                  style={{ color: "var(--text-primary)" }}
                >
                  {topic}
                </p>
                <div
                  className="flex items-center gap-3 mt-0.5 text-xs"
                  style={{ color: "var(--text-muted)" }}
                >
                  {personaNames.map((name, i) => (
                    <span
                      key={name}
                      className="flex items-center gap-1"
                      style={{ color: PERSONA_COLORS[i % PERSONA_COLORS.length] }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Round indicators */}
              <div className="flex items-center gap-1.5">
                {Array.from({ length: rounds }, (_, i) => i + 1).map((r) => (
                  <div key={r} className="flex items-center gap-1">
                    {r < currentRound ||
                    (status === "completed" && r <= rounds) ? (
                      <CheckCircle2
                        size={14}
                        style={{ color: "#7ab86e" }}
                      />
                    ) : r === currentRound && status === "running" ? (
                      <Circle
                        size={14}
                        className="animate-pulse-soft"
                        style={{ color: "var(--amber-400)" }}
                      />
                    ) : (
                      <Circle
                        size={14}
                        style={{ color: "var(--border-default)" }}
                      />
                    )}
                    <span
                      className="text-xs"
                      style={{ color: "var(--text-muted)" }}
                    >
                      R{r}
                    </span>
                  </div>
                ))}
                {status === "completed" && (
                  <span
                    className="ml-2 px-2 py-0.5 rounded-full text-xs"
                    style={{
                      background: "rgba(52,211,153,0.1)",
                      color: "#34d399",
                      border: "1px solid rgba(52,211,153,0.2)",
                    }}
                  >
                    Complete
                  </span>
                )}
              </div>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto scroll-thin px-6 py-4 space-y-4"
            >
              {messages.map((msg) => (
                <DebateMessageBubble
                  key={msg.id}
                  message={msg}
                  colorIndex={getPersonaColorIndex(msg.personaName)}
                />
              ))}

              {/* Live streaming bubble */}
              {streaming && (
                <DebateMessageBubble
                  message={{
                    id: "streaming",
                    personaId: streaming.personaId,
                    personaName: streaming.personaName,
                    content: streaming.chunk,
                    round: streaming.round,
                    timestamp: new Date().toISOString(),
                  }}
                  streaming
                  streamingChunk={streaming.chunk}
                  colorIndex={getPersonaColorIndex(streaming.personaName)}
                />
              )}

              {/* Summary card */}
              {summary && showSummary && (
                <div
                  className="rounded-2xl p-5 mt-4 animate-fade-in relative group"
                  style={{
                    background: "rgba(82,119,74,0.08)",
                    border: "1px solid rgba(122,184,110,0.2)",
                  }}
                >
                  <button 
                    onClick={() => setShowSummary(false)}
                    className="absolute top-4 right-4 p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/5"
                    style={{ color: "var(--text-muted)" }}
                    title="Fechar Sumário"
                  >
                    <X size={14} />
                  </button>
                  <div
                    className="text-xs font-semibold uppercase tracking-widest mb-2"
                    style={{ color: "#7ab86e" }}
                  >
                    Debate Summary
                  </div>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {summary}
                  </p>
                </div>
              )}

              {error && (
                <div
                  className="rounded-xl p-4 text-sm"
                  style={{
                    background: "rgba(239,68,68,0.08)",
                    border: "1px solid rgba(239,68,68,0.2)",
                    color: "#f87171",
                  }}
                >
                  {error}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
