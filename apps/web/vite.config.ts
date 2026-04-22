import path from "node:path";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      "~": path.resolve(import.meta.dirname, "src"),
    },
  },
  css: {
    lightningcss: {
      errorRecovery: true,
    },
  },
  plugins: [tanstackStart(), react()],
  ssr: {
    noExternal: ["@codegouvfr/react-dsfr"],
  },
});
