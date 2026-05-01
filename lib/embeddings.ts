import type { Persona } from "@/types";

export function personaToText(persona: Persona): string {
  return [
    persona.name,
    persona.occupation,
    persona.bio || "",
    (persona.goals || []).join(", "),
    (persona.painPoints || []).join(", "),
    (persona.motivations || []).join(", ")
  ].join(" ").trim();
}

export async function generatePersonaEmbedding(text: string): Promise<number[]> {
  // Mock embedding generation. In a real app, this might call OpenAI or Cohere.
  return Array(1536).fill(0).map(() => Math.random() - 0.5);
}
