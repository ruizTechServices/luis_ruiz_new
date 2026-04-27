import assert from "node:assert/strict";

import {
  createImageGenerationHandler,
  type ImageClient,
} from "../app/api/image_generation/route";

const originalConsoleError = console.error;

function createRequest(prompt: string) {
  return new Request("http://localhost/api/image_generation", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt }),
  });
}

async function runTest(name: string, testFn: () => Promise<void>) {
  try {
    await testFn();
    console.log(`[PASS] ${name}`);
  } catch (error) {
    console.error(`[FAIL] ${name}`);
    console.error(error instanceof Error ? error.stack : error);
    process.exitCode = 1;
  }
}

async function testReturnsImageUrl() {
  const handler = createImageGenerationHandler(
    () =>
      ({
        images: {
          generate: async () => ({
            data: [{ url: "https://example.com/generated-image.png" }],
          }),
        },
      }) as unknown as ImageClient
  );

  const response = await handler(createRequest("test prompt"));

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {
    imageUrl: "https://example.com/generated-image.png",
  });
}

async function testLogsAndReturns500OnFailure() {
  const loggedErrors: unknown[][] = [];
  const upstreamError = new Error("OpenAI request failed");
  const handler = createImageGenerationHandler(
    () =>
      ({
        images: {
          generate: async () => {
            throw upstreamError;
          },
        },
      }) as unknown as ImageClient
  );

  console.error = (...args: unknown[]) => {
    loggedErrors.push(args);
    originalConsoleError(...args);
  };

  try {
    const response = await handler(createRequest("test prompt"));

    assert.equal(response.status, 500);
    assert.deepEqual(await response.json(), {
      error: "Failed to generate image",
    });
    assert.equal(loggedErrors.length, 1);
    assert.equal(loggedErrors[0]?.[0], "Image generation error:");
    assert.equal(loggedErrors[0]?.[1], upstreamError);
  } finally {
    console.error = originalConsoleError;
  }
}

async function main() {
  try {
    await runTest("returns image URL when generation succeeds", testReturnsImageUrl);
    await runTest(
      "logs a clear error and returns 500 when generation fails",
      testLogsAndReturns500OnFailure
    );
  } finally {
    console.error = originalConsoleError;
  }
}

void main();
