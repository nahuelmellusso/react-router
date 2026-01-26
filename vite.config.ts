import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => ({
  plugins: [tailwindcss(), mode === "test" ? undefined : reactRouter(), tsconfigPaths()].filter(
    Boolean,
  ),
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./vitest.setup.ts",
    include: ["app/**/*.{test,spec}.{ts,tsx}"],
  },
}));
