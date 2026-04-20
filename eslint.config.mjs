// eslint.config.mjs
import js from "@eslint/js";
import globals from "globals";

export default [
  // ✅ Replaces .eslintignore in ESLint v9
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "dist/**",
      "build/**",
      "coverage/**",
      "out/**",
      "infra/migrations/**",
      "models/**",
    ],
  },

  // ✅ Make ESM the default so import/export works
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
  },

  js.configs.recommended,

  // ✅ Next.js pages (JSX + browser)
  {
    files: ["pages/**/*.{js,jsx}", "src/**/*.{js,jsx}"],
    languageOptions: {
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      "no-unused-vars": "off",
    },
  },

  // ✅ Next.js API routes (Node runtime)
  {
    files: ["pages/api/**/*.{js,jsx}"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },

  // ✅ Infra code (looks like ESM in your repo)
  {
    files: ["infra/**/*.{js,mjs}"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },

  // ✅ Jest tests (Node + Jest + fetch)
  {
    files: ["tests/**/*.{js,mjs}"],
    languageOptions: {
      globals: {
        ...globals.jest,
        ...globals.node,
        ...globals.browser, // gives `fetch` if you're using it
      },
    },
  },

  // ✅ Only THESE are CommonJS (require/module/exports)
  {
    files: [
      "**/*.cjs",
      "jest.config.js",
      "commitlint.config.js",
      "**/*.config.js",
    ],
    languageOptions: {
      sourceType: "script",
      globals: {
        ...globals.node,
      },
    },
  },
];
