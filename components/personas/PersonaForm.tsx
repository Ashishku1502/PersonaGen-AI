"use client";

import { useState } from "react";
import { Sparkles, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import type { PersonaFormData } from "@/types";

interface PersonaFormProps {
  onGenerate: (data: PersonaFormData) => Promise<void>;
  loading: boolean;
}

export default function PersonaForm({ onGenerate, loading }: PersonaFormProps) {
  const [advanced, setAdvanced] = useState(false);
  const [form, setForm] = useState<PersonaFormData>({
    researchContext: "",
    targetSegment: "",
    productCategory: "",
    count: 3,
    customAttributes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.researchContext.trim()) return;
    await onGenerate(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Research context */}
      <div>
        <label
          className="block text-sm font-medium mb-2"
          style={{ color: "var(--text-secondary)" }}
        >
          Research Context <span style={{ color: "var(--amber-400)" }}>*</span>
        </label>
        <textarea
          value={form.researchContext}
          onChange={(e) =>
            setForm((f) => ({ ...f, researchContext: e.target.value }))
          }
          placeholder="Describe your product, market, or research question. E.g. 'A B2B SaaS tool for remote team project management targeting startups in India and Southeast Asia'"
          rows={3}
          className="w-full rounded-xl px-4 py-3 text-sm resize-none outline-none transition-colors"
          style={{
            background: "var(--bg-elevated)",
            border: "1px solid var(--border-default)",
            color: "var(--text-primary)",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "var(--amber-400)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "var(--border-default)";
          }}
          required
        />
      </div>

      {/* Count */}
      <div>
        <label
          className="block text-sm font-medium mb-2"
          style={{ color: "var(--text-secondary)" }}
        >
          Number of Personas
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setForm((f) => ({ ...f, count: n }))}
              className="w-10 h-10 rounded-xl text-sm font-medium transition-all"
              style={{
                background:
                  form.count === n
                    ? "rgba(251, 191, 36, 0.15)"
                    : "var(--bg-elevated)",
                border:
                  form.count === n
                    ? "1px solid var(--amber-400)"
                    : "1px solid var(--border-default)",
                color:
                  form.count === n
                    ? "var(--amber-400)"
                    : "var(--text-secondary)",
              }}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* Advanced options */}
      <div>
        <button
          type="button"
          onClick={() => setAdvanced(!advanced)}
          className="flex items-center gap-1.5 text-sm transition-colors"
          style={{ color: "var(--text-muted)" }}
        >
          {advanced ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          Advanced options
        </button>

        {advanced && (
          <div className="mt-3 space-y-3 animate-fade-in">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  className="block text-xs font-medium mb-1.5"
                  style={{ color: "var(--text-muted)" }}
                >
                  Target Segment
                </label>
                <input
                  value={form.targetSegment}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, targetSegment: e.target.value }))
                  }
                  placeholder="e.g. Gen Z urban professionals"
                  className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                  style={{
                    background: "var(--bg-elevated)",
                    border: "1px solid var(--border-default)",
                    color: "var(--text-primary)",
                  }}
                />
              </div>
              <div>
                <label
                  className="block text-xs font-medium mb-1.5"
                  style={{ color: "var(--text-muted)" }}
                >
                  Product Category
                </label>
                <input
                  value={form.productCategory}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, productCategory: e.target.value }))
                  }
                  placeholder="e.g. FinTech, PropTech, EdTech"
                  className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                  style={{
                    background: "var(--bg-elevated)",
                    border: "1px solid var(--border-default)",
                    color: "var(--text-primary)",
                  }}
                />
              </div>
            </div>
            <div>
              <label
                className="block text-xs font-medium mb-1.5"
                style={{ color: "var(--text-muted)" }}
              >
                Custom Attributes
              </label>
              <input
                value={form.customAttributes}
                onChange={(e) =>
                  setForm((f) => ({ ...f, customAttributes: e.target.value }))
                }
                placeholder="e.g. Include sustainability attitudes, brand loyalty scores"
                className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                style={{
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border-default)",
                  color: "var(--text-primary)",
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading || !form.researchContext.trim()}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          background: loading
            ? "rgba(251, 191, 36, 0.15)"
            : "rgba(251, 191, 36, 0.2)",
          border: "1px solid rgba(251, 191, 36, 0.4)",
          color: "var(--amber-400)",
        }}
      >
        {loading ? (
          <>
            <Loader2 size={15} className="animate-spin" />
            Generating personas...
          </>
        ) : (
          <>
            <Sparkles size={15} />
            Generate {form.count} Persona{form.count !== 1 ? "s" : ""}
          </>
        )}
      </button>
    </form>
  );
}
