import { NextRequest, NextResponse } from "next/server";
import openAIClient from "@/lib/connections/openai/client";

export async function POST(request: NextRequest) {
  const { prompt } = await request.json();
  
  const response = await openAIClient.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
  });
  
  return NextResponse.json({ response: response.choices[0].message.content });
}
