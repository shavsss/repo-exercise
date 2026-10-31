import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Built as a claude.ai Artifact: one script and one stylesheet (fonts inlined),
// referenced with relative paths from artifact/index.html.
export default defineConfig({
  plugins: [react()],
  // the build time, shown by the test bench so it is clear which version an open tab runs
  define: { __BUILD__: JSON.stringify(new Date().toISOString().slice(0, 16)) },
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
