import type { Persona, DebateMessage } from "@/types";

export function buildPersonaDebateSystemPrompt(persona: Persona): string {
  return `
You are roleplaying as the following persona in a debate/discussion:
Name: ${persona.name}
Occupation: ${persona.occupation}
Bio: ${persona.bio}
Goals: ${(persona.goals || []).join(", ")}
Pain Points: ${(persona.painPoints || []).join(", ")}
Motivations: ${(persona.motivations || []).join(", ")}

Stay in character at all times. Do not break the fourth wall. Speak naturally, strongly expressing your goals and pain points.
Keep your responses concise, focused, and conversational (1-2 short paragraphs).
`;
}

export function buildDebateOpeningPrompt(topic: string, personaName: string, focusArea?: string): string {
  return `
The topic of discussion is: "${topic}"
${focusArea ? `Please focus specifically on: "${focusArea}"` : ""}

As ${personaName}, what are your opening thoughts on this topic?
`;
}

export function buildDebateReplyPrompt(
  topic: string,
  personaName: string,
  messages: DebateMessage[],
  round: number
): string {
  const history = messages
    .map((m) => `[Round ${m.round}] ${m.personaName}: ${m.content}`)
    .join("\n\n");

  return `
The topic is: "${topic}"

Here is the conversation history so far:
${history}

As ${personaName}, please reply to the points made by the others. Do not repeat what you've already said.
`;
}

export function buildDebateSummaryPrompt(topic: string, messages: DebateMessage[]): string {
  const history = messages
    .map((m) => `[Round ${m.round}] ${m.personaName}: ${m.content}`)
    .join("\n\n");

  return `
Analyze the following debate on the topic: "${topic}"

Debate Transcript:
${history}

Provide a concise summary of the key takeaways, areas of agreement, and areas of conflict among the personas.
Return ONLY a JSON object in this format:
{
  "summary": "Your detailed summary text here..."
}
`;
}
