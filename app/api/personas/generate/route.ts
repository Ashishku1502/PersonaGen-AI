import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import connectDB from "@/lib/mongodb";
import anthropic_client, { complete, parseJSON } from "@/lib/anthropic";
import {
  PERSONA_SYSTEM_PROMPT,
  buildPersonaGenerationPrompt,
} from "@/lib/prompts/persona";
import {
  generatePersonaEmbedding,
  personaToText,
} from "@/lib/embeddings";
import PersonaModel from "@/models/Persona";
import type { Persona, PersonaFormData } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const body: PersonaFormData = await req.json();

    if (!body.researchContext?.trim()) {
      return NextResponse.json(
        { success: false, error: "researchContext is required" },
        { status: 400 }
      );
    }

    const count = Math.min(Math.max(body.count || 1, 1), 5);

    // Build prompt and call Claude
    const prompt = buildPersonaGenerationPrompt({ ...body, count });
    const raw = await complete(PERSONA_SYSTEM_PROMPT, prompt, undefined, 4096);
    const personaData = parseJSON<Omit<Persona, "id" | "createdAt" | "updatedAt">[]>(raw);

    if (!Array.isArray(personaData)) {
      throw new Error("Claude did not return a JSON array");
    }

    // Connect to DB
    await connectDB();

    // Process each persona: assign IDs, generate embeddings, persist
    const savedPersonas: Persona[] = [];

    for (const raw of personaData) {
      const id = uuidv4();
      const now = new Date().toISOString();

      const persona: Persona = {
        ...raw,
        id,
        researchContext: body.researchContext,
        createdAt: now,
        updatedAt: now,
      };

      // Generate embedding for Atlas Vector Search
      try {
        const personaText = personaToText(persona);
        persona.embedding = await generatePersonaEmbedding(personaText);
      } catch (embErr) {
        console.warn("Embedding generation failed (non-fatal):", embErr);
      }

      // Persist to MongoDB
      const doc = new PersonaModel(persona);
      await doc.save();

      savedPersonas.push(persona);
    }

    return NextResponse.json({
      success: true,
      data: savedPersonas,
      message: `Generated ${savedPersonas.length} persona(s)`,
    });
  } catch (error) {
    console.error("Persona generation error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
