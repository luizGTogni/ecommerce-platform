import tsConfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [tsConfigPaths()],
  test: {
    dir: "src",
    globals: true,
    projects: [
      {
        extends: true,
        test: {
          name: "unit",
          dir: "src/tests/units/",
          include: ["**/*.{test,unit.spec}.?(c|m)[jt]s?(x)"],
        },
      },
      {
        extends: true,
        test: {
          name: "integration",
          dir: "src/tests/integrations/",
          include: ["**/*.{test,integration.spec}.?(c|m)[jt]s?(x)"],
        },
      },
    ],
    coverage: {
      include: ["src/application/use-cases/**"],
    },
  },
});
