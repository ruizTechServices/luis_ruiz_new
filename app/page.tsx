import { ImageGenerationClient } from "@/components/image-generation-client";
import TerminalDemo from "@/components/terminal-demo";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-100 px-4 py-16">
      <ImageGenerationClient />
      <TerminalDemo />
    </main>
  );
}
