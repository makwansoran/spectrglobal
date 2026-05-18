import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/company/",
  build: {
    outDir: "../company",
    emptyOutDir: true,
  },
  server: {
    port: 5173,
    open: "/company/equinor",
    proxy: {
      "/api": "http://localhost:3000",
    },
  },
});
