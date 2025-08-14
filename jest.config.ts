import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

export default createJestConfig({
  preset: "ts-jest",
  testEnvironment: "node",
  clearMocks: true,
  roots: ["<rootDir>/src"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    // ...
    "^@/(.*)$": "<rootDir>/src/$1",
    "factories/(.*)$": "<rootDir>/factories/$1",
    "tasks/(.*)$": "<rootDir>/tasks/$1",
  },
});
