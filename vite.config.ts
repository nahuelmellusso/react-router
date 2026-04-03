import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

const allowedTenantHosts = ["localhost", "127.0.0.1", "main.localhost", "demo.localhost"];

export default defineConfig(({ mode }) => ({
  plugins: [tailwindcss(), mode === "test" ? undefined : reactRouter(), tsconfigPaths()].filter(
    Boolean,
  ),
  server: {
    host: "0.0.0.0",
    port: 5173,
    strictPort: true,
    allowedHosts: allowedTenantHosts,
    proxy: {
      "/api": {
        target: "http://localhost:3030",
        changeOrigin: false,
        xfwd: true,
        secure: false,
      },
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./vitest.setup.ts",
    include: ["app/**/*.{test,spec}.{ts,tsx}"],
  },
}));
