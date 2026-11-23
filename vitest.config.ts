import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  // tsconfig uses jsx: "preserve" for Next; tests need real JSX compilation.
  esbuild: { jsx: "automatic" },
  // Tests never process CSS; an inline (empty) config stops Vite loading postcss.config.js.
  css: { postcss: { plugins: [] } },
  resolve: { alias: { "@": path.resolve(__dirname, "src") } },
  test: {
    environment: "node",
    include: ["src/**/*.test.{ts,tsx}"],
    // The default forks pool intermittently fails with "UNKNOWN: unknown error, read"
    // when the project lives in a OneDrive-synced folder; threads loads reliably.
    pool: "threads",
  },
});
