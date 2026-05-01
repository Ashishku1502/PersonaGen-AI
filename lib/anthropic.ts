import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "dummy",
});

export default anthropic;

export async function complete(
  system: string,
  prompt: string,
  model = "claude-3-haiku-20240307",
  max_tokens = 4096
) {
  const response = await anthropic.messages.create({
    model,
    max_tokens,
    system,
    messages: [{ role: "user", content: prompt }],
  });

  if (response.content[0].type === "text") {
    return response.content[0].text;
  }
  return "";
}

export function parseJSON<T>(raw: string): T {
  try {
    const jsonStr = raw.replace(/```json\s*/gi, "").replace(/```\s*/gi, "").trim();
    return JSON.parse(jsonStr) as T;
  } catch (err) {
    throw new Error("Failed to parse JSON response");
  }
}
