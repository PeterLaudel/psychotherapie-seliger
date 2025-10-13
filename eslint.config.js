const {
    defineConfig,
    globalIgnores,
} = require("eslint/config");

const globals = require("globals");

const tsParser = require("@typescript-eslint/parser");
const typescriptEslint = require("@typescript-eslint/eslint-plugin");
const js = require("@eslint/js");

const {
    FlatCompat,
} = require("@eslint/eslintrc");

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

module.exports = defineConfig([
    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
            },
            ecmaVersion: 2023,
            parserOptions: {},
        },
        extends: compat.extends("eslint:recommended"),
        linterOptions: {
            reportUnusedDisableDirectives: true,
        },
        rules: {
            "no-console": ["warn", { allow: ["warn", "error"] }],
            eqeqeq: ["error", "always", { null: "ignore" }],
            "no-param-reassign": ["error", { props: true }],
        },
    },
    ...compat.extends("next/core-web-vitals"),
    globalIgnores(["**/*.d.ts", "playwright-report/**", ".next/**", "**/*.js"]),
    {
        files: ["**/*.ts", "**/*.tsx"],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                project: true,
                tsconfigRootDir: process.cwd(),
            },
        },
        plugins: {
            "@typescript-eslint": typescriptEslint,
        },
        extends: compat.extends("plugin:@typescript-eslint/recommended-type-checked"),
        rules: {
            "@typescript-eslint/no-unsafe-argument": "off",
            "@typescript-eslint/no-unsafe-member-access": "off",
            "@typescript-eslint/no-unsafe-assignment": "off",
            "@typescript-eslint/no-unsafe-return": "off",
            "@typescript-eslint/no-unsafe-call": "off",
            "@typescript-eslint/no-misused-promises": "off",
            "@typescript-eslint/unbound-method": "off",
            "@typescript-eslint/no-unused-vars": ["error", { ignoreRestSiblings: true }],
        },
    },
    {
        files: ["**/tasks/**/*.{js,ts}"],
        rules: {
            "no-console": "off",
        },
    },
    {
        files: ["**/tasks/**/*.{js,ts}"],
        rules: {
            "@typescript-eslint/no-floating-promises": "off",
        },
    },
]);
