import js from "@eslint/js";

export default [
  {
    ignores: ["dist/**", "build/**", "node_modules/**", "public/**", ".vercel/**", "scratch/**"],
  },
  js.configs.recommended,
  {
    files: ["**/*.{js,jsx,mjs,cjs}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        window: "readonly",
        document: "readonly",
        navigator: "readonly",
        console: "readonly",
        process: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
        fetch: "readonly",
        URL: "readonly",
        Uint8Array: "readonly",
        import: "readonly",
      },
    },
    rules: {
      "no-unused-vars": "off",
      "no-undef": "off",
      "no-useless-escape": "off",
      "no-control-regex": "off",
      "no-empty": "off",
      "no-cond-assign": "off",
      "no-case-declarations": "off",
    },
  },
];
