import eslintPluginTs from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import eslintPluginPrettier from "eslint-plugin-prettier";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["src/**/*.{ts,js}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    plugins: {
      "@typescript-eslint": eslintPluginTs,
      prettier: eslintPluginPrettier,
    },
    rules: {
      ...eslintPluginTs.configs.recommended.rules,
      "prettier/prettier": "error",
    },
  },
  {
    ignores: ["dist", "node_modules"],
  },
]);
