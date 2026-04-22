import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "~": path.resolve(import.meta.dirname, "src"),
    },
  },
  test: {
    projects: [
      {
        test: {
          name: "unit",
          include: ["src/**/*.test.ts"],
          exclude: ["src/**/*.integration.test.ts"],
          testTimeout: 10000,
        },
      },
      {
        test: {
          name: "integration",
          include: ["src/**/*.integration.test.ts"],
          testTimeout: 30000,
          hookTimeout: 60000,
          fileParallelism: false,
          env: {
            DATABASE_URL_TEST: "postgresql://test:test@localhost:6001/stage_direct_test",
          },
        },
      },
    ],
  },
});
