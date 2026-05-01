import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  id: String,
  personaId: String,
  personaName: String,
  content: String,
  round: Number,
  timestamp: String,
});

const DebateSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    topic: { type: String, required: true },
    personas: [
      {
        id: String,
        name: String,
        occupation: String,
        avatar: String,
      },
    ],
    messages: [MessageSchema],
    status: { type: String, default: "running" },
    rounds: { type: Number, default: 3 },
    summary: { type: String },
  },
  { timestamps: true }
);

export const DebateModel = mongoose.models.Debate || mongoose.model("Debate", DebateSchema);

const InsightReportSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    researchQuestion: { type: String, required: true },
    personaIds: [{ type: String }],
    debateIds: [{ type: String }],
    insights: [
      {
        id: String,
        title: String,
        description: String,
        score: Number,
      },
    ],
    summary: String,
    generatedAt: String,
  },
  { timestamps: true }
);

export const InsightReportModel =
  mongoose.models.InsightReport || mongoose.model("InsightReport", InsightReportSchema);
