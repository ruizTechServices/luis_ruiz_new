"use client";

import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  createImageGenerationFailure,
  summarizeImageGenerationPayload,
  type ImageGenerationPayload,
  type ImageGenerationSummary,
} from "@/lib/image-generation-summary";

const INITIAL_PROMPT = "a cinematic portrait of a surfer at sunset";

export function ImageGenerationClient() {
  const [prompt, setPrompt] = useState(INITIAL_PROMPT);
  const [summary, setSummary] = useState<ImageGenerationSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextPrompt = prompt.trim();
    if (!nextPrompt || isLoading) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/image_generation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: nextPrompt }),
      });

      const payload = (await response.json()) as ImageGenerationPayload;
      const nextSummary = response.ok
        ? summarizeImageGenerationPayload(payload)
        : createImageGenerationFailure(
            "error" in payload ? payload.error : "Failed to generate image"
          );

      setSummary(nextSummary);

      if (response.ok) {
        console.log("image_generation", {
          label: nextSummary.label,
          displayLink: nextSummary.displayLink,
          expiresAt: nextSummary.expiresAt,
        });
      } else {
        console.error("image_generation", {
          label: nextSummary.label,
          error: nextSummary.error,
        });
      }
    } catch (error) {
      const nextSummary = createImageGenerationFailure(
        error instanceof Error ? error.message : "Failed to generate image"
      );

      setSummary(nextSummary);
      console.error("image_generation", {
        label: nextSummary.label,
        error: nextSummary.error,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-3xl border border-black/10 bg-white shadow-sm">
      <CardHeader>
        <CardTitle>Image Generator</CardTitle>
        <CardDescription>
          Keeps the raw response internal and exposes only a short output.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form className="space-y-3" onSubmit={handleSubmit}>
          <Textarea
            name="prompt"
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            placeholder="Describe the image you want"
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Generating..." : "Generate image"}
          </Button>
        </form>

        {summary ? (
          <div className="relative min-h-32 space-y-2 rounded-md border border-black/10 bg-zinc-50 p-3 pr-32">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-500">
              {summary.label}
            </p>

            {summary.displayLink && summary.href ? (
              <a
                href={summary.href}
                target="_blank"
                rel="noreferrer"
                className="block break-all font-mono text-sm text-zinc-900 underline underline-offset-4"
              >
                {summary.displayLink}
              </a>
            ) : null}

            {summary.expiresAt ? (
              <p className="text-xs text-zinc-500">
                Expires: {new Date(summary.expiresAt).toLocaleString()}
              </p>
            ) : null}

            {summary.error ? (
              <p className="text-sm text-red-600">{summary.error}</p>
            ) : null}

            {summary.href ? (
              <a
                href={summary.href}
                target="_blank"
                rel="noreferrer"
                title="Open full image"
                className="absolute right-3 bottom-3 block overflow-hidden rounded-md border border-black/10 bg-white shadow-sm transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20"
              >
                <img
                  src={summary.href}
                  alt="Generated image preview"
                  className="h-24 w-24 object-cover"
                />
              </a>
            ) : null}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
