import mongoose from "mongoose";

const PersonaSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    occupation: { type: String, required: true },
    bio: { type: String },
    goals: [{ type: String }],
    painPoints: [{ type: String }],
    motivations: [{ type: String }],
    avatar: { type: String },
    researchContext: { type: String },
    embedding: [{ type: Number }],
    tags: [{ type: String }],
    techSavviness: { type: String, enum: ["low", "medium", "high"], default: "medium" },
    location: { type: String },
    age: { type: Number },
    quote: { type: String },
    income: { type: String },
    education: { type: String },
  },
  { timestamps: true }
);

PersonaSchema.index({ name: "text", occupation: "text", bio: "text" });

export default mongoose.models.Persona || mongoose.model("Persona", PersonaSchema);
