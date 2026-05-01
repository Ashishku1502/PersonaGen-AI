import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import connectDB from "@/lib/mongodb";
import { complete, parseJSON } from "@/lib/anthropic";
import {
  INSIGHTS_SYSTEM_PROMPT,
  buildInsightExtractionPrompt,
} from "@/lib/prompts/insights";
import PersonaModel from "@/models/Persona";
import { DebateModel, InsightReportModel } from "@/models/Debate";
import type { MarketInsightReport } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { researchQuestion, personaIds, debateIds } = body;

    if (!researchQuestion?.trim()) {
      return NextResponse.json(
        { success: false, error: "researchQuestion is required" },
        { status: 400 }
      );
    }

    if (!personaIds || personaIds.length === 0) {
      return NextResponse.json(
        { success: false, error: "At least one personaId is required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Fetch personas
    const personas = await PersonaModel.find({
      id: { $in: personaIds },
    })
      .select("name occupation goals painPoints motivations bio")
      .lean();

    if (personas.length === 0) {
      return NextResponse.json(
        { success: false, error: "No personas found" },
        { status: 404 }
      );
    }

    // Optionally fetch debate messages
    let debateMessages: { personaName: string; content: string }[] = [];
    if (debateIds && debateIds.length > 0) {
      const debates = await DebateModel.find({
        id: { $in: debateIds },
      })
        .select("messages")
        .lean();

      debates.forEach((d) => {
        debateMessages = debateMessages.concat(
          d.messages.map((m: { personaName: string; content: string }) => ({
            personaName: m.personaName,
            content: m.content,
          }))
        );
      });
    }

    // Build prompt and call Claude
    const prompt = buildInsightExtractionPrompt({
      researchQuestion,
      personas: personas as never,
      debateMessages: debateMessages as never,
    });

    const raw = await complete(INSIGHTS_SYSTEM_PROMPT, prompt, undefined, 4096);

    let reportData: Omit<MarketInsightReport, "id" | "generatedAt" | "personaIds" | "debateIds">;
    try {
      reportData = parseJSON(raw);
    } catch {
      return NextResponse.json(
        { success: false, error: "Failed to parse insights from AI response" },
        { status: 500 }
      );
    }

    // Build full report
    const report: MarketInsightReport = {
      ...reportData,
      id: uuidv4(),
      researchQuestion,
      personaIds,
      debateIds: debateIds || [],
      generatedAt: new Date().toISOString(),
    };

    // Ensure insights have IDs
    report.insights = report.insights.map((ins) => ({
      ...ins,
      id: ins.id || uuidv4(),
    }));

    // Persist
    const doc = new InsightReportModel(report);
    await doc.save();

    return NextResponse.json({
      success: true,
      data: report,
    });
  } catch (error) {
    console.error("Insight extraction error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const limit = Math.min(parseInt(searchParams.get("limit") || "10"), 50);

    const reports = await InsightReportModel.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json({ success: true, data: reports });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch reports" },
      { status: 500 }
    );
  }
}
