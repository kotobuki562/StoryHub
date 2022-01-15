module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: { project: "./tsconfig.json", ecmaFeatures: { jsx: true } },
  settings: {
    react: { version: "detect" },
    tailwindcss: {
      config: "tailwind.config.js",
      removeDuplicates: true,
      prependCustom: false,
      whitelist: ["prose-light"],
    },
  },
  env: { es2021: true, browser: true, jest: true, node: true },
  plugins: [
    "@typescript-eslint",
    "import",
    "simple-import-sort",
    "sort-destructure-keys",
    "tailwindcss",
    "import-access",
    "testing-library",
  ],
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:tailwindcss/recommended",
    "next/core-web-vitals",
    "prettier",
  ],
  rules: {
    curly: "error",
    "no-console": ["error", { allow: ["warn", "info", "error"] }],
    "no-restricted-syntax": [
      "error",
      { selector: "TSEnumDeclaration", message: "Don't declare enums" },
    ],
    "prefer-arrow-callback": "error",
    "prefer-const": "error",
    "func-style": ["error", "expression"],
    "arrow-body-style": [
      "error",
      "as-needed",
      { requireReturnForObjectLiteral: true },
    ],
    "no-restricted-imports": [
      "error",
      { paths: [{ name: "react", importNames: ["default"] }] },
    ],
    // react
    "react/display-name": "error",
    "react/jsx-handler-names": [
      "error",
      {
        eventHandlerPrefix: "handle",
        eventHandlerPropPrefix: "on",
        checkLocalVariables: false,
        checkInlineFunction: true,
      },
    ],
    "react/prop-types": "off",
    "react/react-in-jsx-scope": "off",
    "react/jsx-handler-names": "off",
    "react/display-name": "off",
    "react/destructuring-assignment": ["error", "never"],
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "react/destructuring-assignment": ["error", "always"],
    // sort
    "import/newline-after-import": "error",
    "import/no-default-export": "error",
    "import-access/jsdoc": "error",
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
    "sort-destructure-keys/sort-destructure-keys": 2,
    // @typescript-eslint
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-var-requires": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/consistent-type-imports": [
      "warn",
      { prefer: "type-imports" },
    ],
    "@typescript-eslint/no-unused-vars": [
      "error",
      { varsIgnorePattern: "^_", argsIgnorePattern: "^_" },
    ],
    "@typescript-eslint/naming-convention": [
      "error",
      { selector: ["typeAlias", "typeParameter"], format: ["PascalCase"] },
      {
        selector: ["property", "method"],
        format: ["camelCase", "snake_case"],
      },
      {
        selector: "variable",
        types: ["boolean"],
        format: ["PascalCase"],
        prefix: ["no", "is", "has", "should"],
        filter: { regex: "^_", match: false },
      },
    ],
    // jsx-a11y
    "jsx-a11y/no-autofocus": "off",
    "jsx-a11y/anchor-is-valid": [
      "error",
      {
        components: ["Link"],
        specialLink: ["hrefLeft", "hrefRight"],
        aspects: ["invalidHref", "preferButton"],
      },
    ],
  },
  overrides: [
    {
      files: [
        "playwright.config.ts",
        "pages/**/*.tsx",
        "pages/api/**/*.ts",
        "next.config.mjs",
      ],
      rules: { "import/no-default-export": "off" },
    },
    {
      files: [
        "pages/**/*.tsx",
        "pages/api/**/*.ts",
        "next.config.mjs",
        "src/type/**/*.d.ts",
      ],
      rules: {
        "@typescript-eslint/naming-convention": [
          "error",
          { selector: ["typeAlias", "typeParameter"], format: ["PascalCase"] },
          { selector: ["classProperty", "method"], format: ["camelCase"] },
          {
            selector: "variable",
            types: ["boolean"],
            format: ["PascalCase"],
            prefix: ["is", "has", "should"],
          },
        ],
      },
    },
    {
      files: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],
      extends: ["plugin:testing-library/react"],
    },
  ],
}
