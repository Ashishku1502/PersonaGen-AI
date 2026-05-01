"use client";

import { useState, useEffect } from "react";
import { 
  BarChart3, 
  Search, 
  Plus, 
  Calendar, 
  ArrowRight, 
  FileText, 
  TrendingUp, 
  Users,
  CheckCircle2,
  ChevronRight,
  Loader2,
  ShieldCheck,
  X
} from "lucide-react";
import type { Persona, MarketInsightReport } from "@/types";

export default function InsightsPage() {
  const [reports, setReports] = useState<MarketInsightReport[]>([]);
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  
  // Form state
  const [question, setQuestion] = useState("");
  const [selectedPersonaIds, setSelectedPersonaIds] = useState<string[]>([]);
  const [selectedReport, setSelectedReport] = useState<MarketInsightReport | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/insights").then(res => res.json()),
      fetch("/api/personas").then(res => res.json())
    ]).then(([reportsData, personasData]) => {
      if (reportsData.success) setReports(reportsData.data);
      if (personasData.success) setPersonas(personasData.data);
      setLoading(false);
    });
  }, []);

  const handleGenerate = async () => {
    if (!question || selectedPersonaIds.length === 0) return;

    setGenerating(true);
    try {
      const res = await fetch("/api/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          researchQuestion: question,
          personaIds: selectedPersonaIds,
        })
      });
      const data = await res.json();
      if (data.success) {
        setReports(prev => [data.data, ...prev]);
        setSelectedReport(data.data);
        setShowForm(false);
      }
    } catch (err) {
      console.error("Failed to generate insights:", err);
    } finally {
      setGenerating(false);
    }
  };

  const togglePersonaSelection = (id: string) => {
    setSelectedPersonaIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-full p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="font-display text-3xl font-bold mb-2">Market Insights</h1>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Synthesize persona data and debate results into actionable research reports.
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
          style={{
            background: "var(--sage-500)",
            color: "white",
            boxShadow: "0 4px 12px rgba(82, 119, 74, 0.2)",
          }}
        >
          {showForm ? "Cancel" : <><Plus size={16} /> New Analysis</>}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: List of reports */}
        <div className="lg:col-span-4 space-y-4">
          <div className="relative mb-6">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" style={{ color: "var(--text-muted)" }} />
            <input 
              placeholder="Search reports..." 
              className="w-full bg-transparent rounded-lg pl-9 pr-3 py-2 text-xs border"
              style={{ background: "var(--bg-card)", borderColor: "var(--border-subtle)" }}
            />
          </div>

          <div className="space-y-3">
            {loading ? (
              [1, 2, 3].map(i => <div key={i} className="h-20 rounded-xl shimmer opacity-40" />)
            ) : reports.length > 0 ? (
              reports.map(r => (
                <div 
                  key={r.id}
                  onClick={() => setSelectedReport(r)}
                  className="p-4 rounded-xl cursor-pointer transition-all border group"
                  style={{ 
                    background: selectedReport?.id === r.id ? "rgba(82, 119, 74, 0.05)" : "var(--bg-card)",
                    borderColor: selectedReport?.id === r.id ? "var(--sage-500)" : "var(--border-subtle)"
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider" style={{ color: "var(--text-muted)" }}>
                      <Calendar size={10} />
                      {new Date(r.generatedAt).toLocaleDateString()}
                    </div>
                    <ChevronRight size={14} className={`transition-transform ${selectedReport?.id === r.id ? "translate-x-1" : "opacity-0 group-hover:opacity-100"}`} />
                  </div>
                  <h3 className="text-sm font-semibold line-clamp-2 leading-snug">{r.researchQuestion}</h3>
                </div>
              ))
            ) : (
              <div className="text-center py-10 opacity-40">
                <FileText size={40} className="mx-auto mb-2" />
                <p className="text-xs">No reports yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Report detail or generation form */}
        <div className="lg:col-span-8">
          {showForm ? (
            <div 
              className="p-8 rounded-2xl animate-fade-in sticky top-8"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border-default)" }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-2xl font-bold">New Insight Analysis</h2>
                <button 
                  onClick={() => setShowForm(false)}
                  className="p-1.5 rounded-lg hover:bg-white/5 transition-colors"
                  style={{ color: "var(--text-muted)" }}
                  title="Fechar Analisador"
                >
                  <X size={16} />
                </button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-secondary">Research Question</label>
                  <textarea 
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="E.g. What are the top 3 barriers to entry for this product in the Singapore market?"
                    rows={3}
                    className="w-full rounded-xl px-4 py-3 text-sm resize-none outline-none"
                    style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-default)", color: "var(--text-primary)" }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3 text-secondary">Select Personas for Context</label>
                  <div className="grid grid-cols-2 gap-2">
                    {personas.map(p => (
                      <div 
                        key={p.id}
                        onClick={() => togglePersonaSelection(p.id)}
                        className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all"
                        style={{ 
                          background: selectedPersonaIds.includes(p.id) ? "rgba(82, 119, 74, 0.1)" : "transparent",
                          borderColor: selectedPersonaIds.includes(p.id) ? "var(--sage-500)" : "var(--border-subtle)"
                        }}
                      >
                        <div className="w-6 h-6 rounded bg-white/5 flex items-center justify-center text-[10px] font-bold">
                          {p.name.charAt(0)}
                        </div>
                        <span className="text-xs font-medium truncate">{p.name}</span>
                        {selectedPersonaIds.includes(p.id) && <CheckCircle2 size={12} className="ml-auto text-sage-500" />}
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={generating || !question || selectedPersonaIds.length === 0}
                  className="w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-40"
                  style={{ background: "var(--sage-500)", color: "white" }}
                >
                  {generating ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Analyzing data...
                    </>
                  ) : (
                    <>
                      <TrendingUp size={18} />
                      Generate Market Report
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : selectedReport ? (
            <div className="animate-fade-in space-y-8">
              {/* Report Header */}
              <div className="p-8 rounded-2xl" style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)" }}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest">
                    <ShieldCheck size={14} />
                    Verified Market Insight Report
                  </div>
                  <button 
                    onClick={() => setSelectedReport(null)}
                    className="p-1.5 rounded-lg hover:bg-white/5 transition-colors"
                    style={{ color: "var(--text-muted)" }}
                    title="Fechar Relatório"
                  >
                    <X size={16} />
                  </button>
                </div>
                <h2 className="font-display text-3xl font-bold mb-6 leading-tight">{selectedReport.researchQuestion}</h2>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2 text-xs text-muted" style={{ color: "var(--text-muted)" }}>
                    <Calendar size={14} />
                    {new Date(selectedReport.generatedAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted" style={{ color: "var(--text-muted)" }}>
                    <Users size={14} />
                    {selectedReport.personaIds.length} Personas analyzed
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="p-8 rounded-2xl border border-white/5" style={{ background: "rgba(255,255,255,0.02)" }}>
                <h3 className="text-xs font-bold uppercase tracking-wider mb-4 opacity-50">Executive Summary</h3>
                <p className="text-sm leading-relaxed opacity-90">{selectedReport.summary}</p>
              </div>

              {/* Insights Grid */}
              <div className="grid grid-cols-1 gap-4">
                <h3 className="text-xs font-bold uppercase tracking-wider opacity-50 px-2">Key Findings</h3>
                {selectedReport.insights.map((insight, idx) => (
                  <div 
                    key={insight.id || idx}
                    className="p-6 rounded-2xl flex gap-6 items-start border"
                    style={{ background: "var(--bg-card)", borderColor: "var(--border-subtle)" }}
                  >
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center font-display font-bold text-lg flex-shrink-0"
                      style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-default)", color: "var(--amber-400)" }}
                    >
                      {insight.score}
                    </div>
                    <div>
                      <h4 className="font-bold text-base mb-2">{insight.title}</h4>
                      <p className="text-sm leading-relaxed opacity-70">{insight.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div 
              className="h-[500px] flex flex-col items-center justify-center rounded-2xl opacity-40 border-2 border-dashed border-white/10"
            >
              <BarChart3 size={60} strokeWidth={1} />
              <p className="mt-4 font-display text-xl tracking-widest uppercase">Select a report to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
