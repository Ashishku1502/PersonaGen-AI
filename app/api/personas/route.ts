import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import PersonaModel from "@/models/Persona";
import { generatePersonaEmbedding } from "@/lib/embeddings";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");
    const tags = searchParams.get("tags")?.split(",").filter(Boolean);
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 50);
    const page = Math.max(parseInt(searchParams.get("page") || "1"), 1);
    const skip = (page - 1) * limit;

    let filter: Record<string, unknown> = {};

    // Tag filter
    if (tags && tags.length > 0) {
      filter.tags = { $in: tags };
    }

    // Text search (fallback when no vector search)
    if (query) {
      filter.$text = { $search: query };
    }

    const [personas, total] = await Promise.all([
      PersonaModel.find(filter)
        .select("-embedding") // Don't send embeddings to client
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      PersonaModel.countDocuments(filter),
    ]);

    return NextResponse.json({
      success: true,
      data: personas,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Persona list error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch personas" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "id is required" },
        { status: 400 }
      );
    }

    await PersonaModel.deleteOne({ id });

    return NextResponse.json({
      success: true,
      message: "Persona deleted",
    });
  } catch (error) {
    console.error("Persona delete error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete persona" },
      { status: 500 }
    );
  }
}
