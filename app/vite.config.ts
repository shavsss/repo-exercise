import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Built as a claude.ai Artifact: one script and one stylesheet (fonts inlined),
// referenced with relative paths from artifact/index.html.
export default defineConfig({
  plugins: [react()],
  base: "./",
  build: {
    outDir: "dist",
    assetsInlineLimit: () => true,
    cssCodeSplit: false,
    rolldownOptions: {
      input: "src/main.tsx",
      output: {
        inlineDynamicImports: true,
        entryFileNames: "app.js",
        assetFileNames: "app[extname]",
      },
    },
  },
});
