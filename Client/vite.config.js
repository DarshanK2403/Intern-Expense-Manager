import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],

  optimizeDeps: {
    include: ["lucide-react"], // ✅ Pre-bundles Lucide React so it's ready faster
  },

  build: {
    chunkSizeWarningLimit: 500,
  },
});
