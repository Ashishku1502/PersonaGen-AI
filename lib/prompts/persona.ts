import type { PersonaFormData } from "@/types";

export const PERSONA_SYSTEM_PROMPT = `
You are an expert market researcher and UX designer.
Your goal is to generate hyper-realistic, detailed user personas based on the provided research context.
You must return ONLY a raw JSON array of objects representing the personas. Each object should have the following fields:
- name (string)
- occupation (string)
- bio (string)
- age (number)
- location (string)
- income (string)
- education (string)
- techSavviness (string: "low", "medium", or "high")
- quote (string: a catchy representative quote)
- goals (array of strings)
- painPoints (array of strings)
- motivations (array of strings)
- avatar (string: a description of what their avatar should look like)
- tags (array of strings: key personality traits)

Do not wrap the JSON in markdown code blocks if possible, just return the raw JSON array.
`;

export function buildPersonaGenerationPrompt(data: PersonaFormData): string {
  return `
Please generate ${data.count || 1} distinct, realistic user personas based on this research context:
"""
${data.researchContext}
"""

${data.targetSegment ? `Target Segment: ${data.targetSegment}` : ""}
${data.productCategory ? `Product Category: ${data.productCategory}` : ""}
${data.customAttributes ? `Additional Requirements: ${data.customAttributes}` : ""}

Make them diverse, with unique backgrounds, distinct pain points, and specific goals related to the context. Ensure all fields are populated with high-quality, authentic data.
`;
}
