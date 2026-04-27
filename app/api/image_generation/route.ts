import { NextRequest, NextResponse } from "next/server";
import { createOpenAIClient } from "@/lib/connections/openai/client";

export type ImageClient = {
  images: {
    generate: ReturnType<typeof createOpenAIClient>["images"]["generate"];
  };
};

export function createImageGenerationHandler(
  createClient: () => ImageClient = createOpenAIClient
) {
  return async function POST(request: Request) {
    try {
      const { prompt } = await request.json();
      const client = createClient();

      const response = await client.images.generate({
        model: "dall-e-3",
        prompt,
        n: 1,
        size: "1024x1024",
      });

      if (!response.data || response.data.length === 0) {
        return NextResponse.json({ error: "No image generated" }, { status: 500 });
      }

      return NextResponse.json({ imageUrl: response.data[0].url });
    } catch (error) {
      console.error("Image generation error:", error);
      return NextResponse.json(
        { error: "Failed to generate image" },
        { status: 500 }
      );
    }
  };
}

export const POST = createImageGenerationHandler();
