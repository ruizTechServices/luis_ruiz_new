"use client";
import { Terminal } from "@/components/ui/terminal";

export default function TerminalDemo() {
  return (
    <section className="w-full py-10 md:py-20">
      <Terminal
        commands={[
          "npx shadcn@latest init",
          "npm install motion",
          "npx shadcn@latest add button card",
          "npm run dev",
        ]}
        outputs={{
          0: [
            "✔ Preflight checks.",
            "✔ Verifying framework. Found Next.js.",
            "✔ Validating Tailwind CSS config. Found v4.",
            "✔ Validating import alias.",
            "✔ Writing components.json.",
            "✔ Checking registry.",
            "✔ Updating CSS variables in app/globals.css",
            "✔ Installing dependencies.",
            "✔ Created 1 file:",
            "  - lib/utils.ts",
            "",
            "Success! Project initialization completed.",
          ],
          1: [
            "added 1 package, and audited 385 packages in 2s",
            "",
            "142 packages are looking for funding",
            "  run `npm fund` for details",
            "",
            "found 0 vulnerabilities",
          ],
          2: [
            "✔ Checking registry.",
            "✔ Installing dependencies.",
            "✔ Created 2 files:",
            "  - components/ui/button.tsx",
            "  - components/ui/card.tsx",
          ],
          3: [
            "> dev",
            "> next dev",
            "",
            "   ▲ Next.js 15.0.3",
            "   - Local:        http://localhost:3000",
            "   - Network:      http://192.168.1.42:3000",
            "",
            " ✓ Starting...",
            " ✓ Ready in 1247ms",
          ],
        }}
        typingSpeed={45}
        delayBetweenCommands={1000}
      />
    </section>
  );
}
