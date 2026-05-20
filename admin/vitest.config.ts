import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    globals: true,
    environment: "node",
    include: ["tests/**/*.test.ts"],
    testTimeout: 20_000,        // emulator boots can take a few seconds
    hookTimeout: 20_000,
    fileParallelism: false,     // rules tests share emulator state
  },
});
