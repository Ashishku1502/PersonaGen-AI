"use client";

import { useState, useEffect, useCallback } from "react";
import { Users, RefreshCw, Search, X, Plus } from "lucide-react";
import PersonaForm from "@/components/personas/PersonaForm";
import PersonaCard from "@/components/personas/PersonaCard";
import type { Persona, PersonaFormData } from "@/types";

export default function PersonasPage() {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(true);

  const fetchPersonas = useCallback(async () => {
    try {
      setFetching(true);
      const q = search ? `?q=${encodeURIComponent(search)}` : "";
      const res = await fetch(`/api/personas${q}`);
      const json = await res.json();
      if (json.success) setPersonas(json.data);
    } catch {
      // non-fatal
    } finally {
      setFetching(false);
    }
  }, [search]);

  useEffect(() => {
    fetchPersonas();
  }, [fetchPersonas]);

  const handleGenerate = async (data: PersonaFormData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/personas/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (json.success) {
        setPersonas((prev) => [...json.data, ...prev]);
      } else {
        setError(json.error || "Generation failed");
      }
    } catch (e) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/personas?id=${id}`, { method: "DELETE" });
    setPersonas((prev) => prev.filter((p) => p.id !== id));
  };

  const filtered = personas.filter(
    (p) =>
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.occupation.toLowerCase().includes(search.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="flex h-full relative">
      {/* Left: form panel */}
      {showForm && (
        <div
          className="w-[360px] flex-shrink-0 p-6 overflow-y-auto scroll-thin animate-in slide-in-from-left duration-300"
          style={{ borderRight: "1px solid var(--border-subtle)" }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Users size={16} style={{ color: "var(--amber-400)" }} />
              <h1
                className="font-display text-xl font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                Generate
              </h1>
            </div>
            <button 
              onClick={() => setShowForm(false)}
              className="p-1.5 rounded-lg hover:bg-white/5 transition-colors"
              style={{ color: "var(--text-muted)" }}
              title="Fechar Gerador"
            >
              <X size={16} />
            </button>
          </div>
          <PersonaForm onGenerate={handleGenerate} loading={loading} />
          {error && (
            <div
              className="mt-3 p-3 rounded-xl text-sm"
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
      )}

      {/* Right: persona grid */}
      <div className="flex-1 p-6 overflow-y-auto scroll-thin">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="p-2.5 rounded-xl transition-all hover:scale-105 bg-amber-400 text-black shadow-lg"
                title="Abrir Gerador"
              >
                <Plus size={20} />
              </button>
            )}
            <h2
              className="font-display text-lg font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              Persona Library
            </h2>
            <span
              className="px-2 py-0.5 rounded-full text-xs font-mono"
              style={{
                background: "rgba(251,191,36,0.1)",
                color: "var(--amber-400)",
              }}
            >
              {personas.length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl"
              style={{
                background: "var(--bg-elevated)",
                border: "1px solid var(--border-default)",
              }}
            >
              <Search size={13} style={{ color: "var(--text-muted)" }} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search personas..."
                className="bg-transparent text-sm outline-none w-40"
                style={{ color: "var(--text-primary)" }}
              />
            </div>
            <button
              onClick={fetchPersonas}
              className="p-2 rounded-xl transition-colors"
              style={{
                background: "var(--bg-elevated)",
                border: "1px solid var(--border-default)",
                color: "var(--text-muted)",
              }}
            >
              <RefreshCw size={13} className={fetching ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        {fetching && personas.length === 0 ? (
          <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="rounded-2xl h-64 shimmer"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center h-64 text-center"
            style={{ color: "var(--text-muted)" }}
          >
            <Users size={32} className="mb-3 opacity-30" />
            <p className="text-sm">
              {search
                ? "No personas match your search"
                : "No personas yet. Generate your first set above."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((p) => (
              <div key={p.id} className="group">
                <PersonaCard persona={p} onDelete={handleDelete} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
