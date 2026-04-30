import path from "node:path";
import { defineConfig } from "vitest/config";

const alias = {
  "~": path.resolve(import.meta.dirname, "src"),
};

export default defineConfig({
  resolve: { alias },
  test: {
    projects: [
      {
        resolve: { alias },
        test: {
          name: "unit",
          include: ["src/**/*.test.ts"],
          exclude: ["src/**/*.integration.test.ts"],
          testTimeout: 10000,
        },
      },
      {
        resolve: { alias },
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
