import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      include: ["buffer", "process", "util", "stream", "events", "http", "https", "os", "url", "assert", "crypto"],
      globals: { Buffer: true, global: true, process: true },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@mezo-checkout/core": path.resolve(__dirname, "../packages/mezo-checkout/src/index.ts"),
      "wagmi": path.resolve(__dirname, "./node_modules/wagmi"),
      "react": path.resolve(__dirname, "./node_modules/react"),
      "react-dom": path.resolve(__dirname, "./node_modules/react-dom"),
      "@tanstack/react-query": path.resolve(__dirname, "./node_modules/@tanstack/react-query"),
      "@rainbow-me/rainbowkit": path.resolve(__dirname, "./node_modules/@rainbow-me/rainbowkit"),
    },
  },
  build: {
    target: "esnext",
  },
  optimizeDeps: {
    esbuildOptions: {
      target: "esnext",
    },
  },
});
