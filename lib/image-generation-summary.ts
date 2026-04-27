export type ImageGenerationPayload =
  | {
      imageUrl: string;
    }
  | {
      error: string;
    };

export type ImageGenerationSummary = {
  status: "generated" | "failed";
  label: string;
  href: string | null;
  displayLink: string | null;
  expiresAt: string | null;
  error: string | null;
};

export function summarizeImageGenerationPayload(
  payload: ImageGenerationPayload
): ImageGenerationSummary {
  if ("error" in payload) {
    return {
      status: "failed",
      label: "failed",
      href: null,
      displayLink: null,
      expiresAt: null,
      error: payload.error,
    };
  }

  const parsedUrl = new URL(payload.imageUrl);
  const displayLink =
    parsedUrl.pathname.split("/").filter(Boolean).pop() ?? parsedUrl.pathname;

  return {
    status: "generated",
    label: "generated",
    href: payload.imageUrl,
    displayLink,
    expiresAt: parsedUrl.searchParams.get("se"),
    error: null,
  };
}

export function createImageGenerationFailure(
  message: string
): ImageGenerationSummary {
  return {
    status: "failed",
    label: "failed",
    href: null,
    displayLink: null,
    expiresAt: null,
    error: message,
  };
}
