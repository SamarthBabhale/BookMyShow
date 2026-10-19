import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// All /api calls are proxied to the Spring Boot backend, so no CORS setup is needed.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": { target: "http://localhost:8081", changeOrigin: true },
    },
  },
});
