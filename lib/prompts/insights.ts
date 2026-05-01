export const INSIGHTS_SYSTEM_PROMPT = `
You are an expert market research analyst.
Given a research question, persona profiles, and optional debate transcripts, extract structured market insights.
You must return ONLY a JSON object with the following structure:
{
  "summary": "A high-level summary of the insights found.",
  "insights": [
    {
      "title": "Short insight title",
      "description": "Detailed explanation of the insight",
      "score": 85,
      "category": "opportunity",
      "confidence": "high",
      "priority": 1,
      "evidence": ["Direct quote or observation"],
      "affectedPersonas": ["Persona Name"]
    }
  ]
}
The 'score' should be a confidence or impact score from 0-100.
The 'category' must be one of: "opportunity", "risk", "trend", "recommendation", "segment", "feature".
The 'confidence' must be one of: "high", "medium", "low".
The 'priority' should be 1, 2, or 3 (1 being highest).
Do not wrap the JSON in markdown blocks.
`;

export function buildInsightExtractionPrompt({
  researchQuestion,
  personas,
  debateMessages,
}: {
  researchQuestion: string;
  personas: any[];
  debateMessages?: any[];
}): string {
  return `
Research Question: "${researchQuestion}"

Personas:
${JSON.stringify(personas, null, 2)}

${
  debateMessages && debateMessages.length > 0
    ? `Debate Transcripts:\n${JSON.stringify(debateMessages, null, 2)}`
    : ""
}

Extract the most important market insights based on the persona characteristics and their debate interactions.
`;
}
