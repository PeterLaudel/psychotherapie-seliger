module.exports = {
  env: { browser: true, node: true, es2023: true },
  parserOptions: { ecmaVersion: 2023 },
  extends: ["eslint:recommended", "next/core-web-vitals"],
  plugins: ["import"],
  root: true,
  ignorePatterns: ["*.d.ts", "./src/task/**"],
  reportUnusedDisableDirectives: true,
  rules: {
    "no-console": ["warn", { allow: ["warn", "error"] }],

    "import/order": ["error", { "newlines-between": "never" }],

    "import/newline-after-import": "error",

    eqeqeq: ["error", "always", { null: "ignore" }],

    "no-param-reassign": ["error", { props: true }],
  },
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      parser: "@typescript-eslint/parser",
      plugins: ["@typescript-eslint"],
      extends: ["plugin:@typescript-eslint/recommended-type-checked"],
      parserOptions: {
        project: true,
        tsconfigRootDir: process.cwd(),
      },
      rules: {
        "@typescript-eslint/no-unsafe-argument": "off",
        "@typescript-eslint/no-unsafe-member-access": "off",
        "@typescript-eslint/no-unsafe-assignment": "off",
        "@typescript-eslint/no-unsafe-return": "off",
        "@typescript-eslint/no-unsafe-call": "off",
        "@typescript-eslint/no-misused-promises": "off",
        "@typescript-eslint/unbound-method": "off",

        "@typescript-eslint/no-unused-vars": [
          "error",
          { ignoreRestSiblings: true },
        ],
      },
    },
    {
      // Target files inside the 'src/special-directory' directory
      files: ["**/tasks/**/*.{js,ts}"],
      rules: {
        "no-console": "off", // Disable the 'no-console' rule in this directory
      },
    },
    {
      // Target files inside the 'src/special-directory' directory
      files: ["**/tasks/**/*.{js,ts}"],
      rules: {
        "@typescript-eslint/no-floating-promises": "off", // Disable the 'no-console' rule in this directory
      },
    },
  ],
};
