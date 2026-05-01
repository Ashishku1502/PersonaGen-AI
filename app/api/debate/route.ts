import { NextRequest } from "next/server";
import { v4 as uuidv4 } from "uuid";
import connectDB from "@/lib/mongodb";
import anthropic from "@/lib/anthropic";
import {
  buildPersonaDebateSystemPrompt,
  buildDebateOpeningPrompt,
  buildDebateReplyPrompt,
  buildDebateSummaryPrompt,
} from "@/lib/prompts/debate";
import PersonaModel from "@/models/Persona";
import { DebateModel } from "@/models/Debate";
import type { Persona, DebateMessage, StreamEvent } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Helper: encode SSE event
function sseEvent(data: StreamEvent): string {
  return `data: ${JSON.stringify(data)}\n\n`;
}

export async function POST(req: NextRequest) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: StreamEvent) => {
        try {
          controller.enqueue(encoder.encode(sseEvent(event)));
        } catch {
          // Controller might be closed
        }
      };

      try {
        const body = await req.json();
        const { topic, personaIds, rounds = 3, focusArea, debateId } = body;

        if (!topic || !personaIds || personaIds.length < 2) {
          send({ type: "error", error: "topic and at least 2 personaIds required" });
          controller.close();
          return;
        }

        // Connect DB and fetch personas
        await connectDB();
        const personas = await PersonaModel.find({
          id: { $in: personaIds },
        }).lean() as unknown as Persona[];

        if (personas.length < 2) {
          send({ type: "error", error: "Could not find enough personas" });
          controller.close();
          return;
        }

        // Create debate session in DB
        const sessionId = debateId || uuidv4();
        const session = new DebateModel({
          id: sessionId,
          topic,
          personas: personas.map((p) => ({
            id: p.id,
            name: p.name,
            occupation: p.occupation,
            avatar: p.avatar,
          })),
          messages: [],
          status: "running",
          rounds,
        });
        await session.save();

        send({ type: "start" });

        const allMessages: DebateMessage[] = [];

        // ── Debate Loop ───────────────────────────────────────────────────────
        for (let round = 1; round <= rounds; round++) {
          for (const persona of personas) {
            const messageId = uuidv4();
            let fullContent = "";

            send({
              type: "message_start",
              personaId: persona.id,
              personaName: persona.name,
              round,
            });

            // Build prompt
            const systemPrompt = buildPersonaDebateSystemPrompt(persona);
            const userPrompt =
              round === 1
                ? buildDebateOpeningPrompt(topic, persona.name, focusArea)
                : buildDebateReplyPrompt(topic, persona.name, allMessages, round);

            // Stream response from Claude
            const claudeStream = await anthropic.messages.stream({
              model: "claude-3-5-haiku-latest", // Fast model for multi-turn debate
              max_tokens: 512,
              system: systemPrompt,
              messages: [{ role: "user", content: userPrompt }],
            });

            for await (const chunk of claudeStream) {
              if (
                chunk.type === "content_block_delta" &&
                chunk.delta.type === "text_delta"
              ) {
                fullContent += chunk.delta.text;
                send({
                  type: "message_chunk",
                  personaId: persona.id,
                  personaName: persona.name,
                  chunk: chunk.delta.text,
                  round,
                });
              }
            }

            // Save message
            const message: DebateMessage = {
              id: messageId,
              personaId: persona.id,
              personaName: persona.name,
              content: fullContent,
              round,
              timestamp: new Date().toISOString(),
            };

            allMessages.push(message);

            // Persist message to DB
            await DebateModel.updateOne(
              { id: sessionId },
              { $push: { messages: message } }
            );

            send({
              type: "message_end",
              personaId: persona.id,
              personaName: persona.name,
              message,
              round,
            });
          }

          send({ type: "round_end", round });
        }

        // ── Generate Summary ──────────────────────────────────────────────────
        const summaryPrompt = buildDebateSummaryPrompt(topic, allMessages);
        const summaryRaw = await anthropic.messages.create({
          model: "claude-3-5-sonnet-latest",
          max_tokens: 1024,
          system: "You are a market research analyst. Return only JSON, no markdown.",
          messages: [{ role: "user", content: summaryPrompt }],
        });

        const summaryText =
          summaryRaw.content[0].type === "text"
            ? summaryRaw.content[0].text
            : "";

        let summary = summaryText;
        try {
          const parsed = JSON.parse(
            summaryText.replace(/```json\s*/gi, "").replace(/```\s*/gi, "").trim()
          );
          summary = parsed.summary || summaryText;

          // Store full summary in DB
          await DebateModel.updateOne(
            { id: sessionId },
            {
              status: "completed",
              summary: JSON.stringify(parsed),
            }
          );
        } catch {
          await DebateModel.updateOne(
            { id: sessionId },
            { status: "completed", summary }
          );
        }

        send({
          type: "debate_end",
          summary,
        });

        controller.close();
      } catch (error) {
        const msg = error instanceof Error ? error.message : "Stream error";
        send({ type: "error", error: msg });
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
