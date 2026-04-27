import OpenAI from "openai";

export function createOpenAIClient() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "" });
}

const client = createOpenAIClient();

export default client;
