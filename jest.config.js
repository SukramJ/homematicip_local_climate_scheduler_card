module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  roots: ["<rootDir>/src"],
  testMatch: ["**/__tests__/**/*.ts", "**/?(*.)+(spec|test).ts"],
  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/**/*.d.ts",
    "!src/**/*.test.ts",
    "!src/**/__tests__/**",
    "!src/homematicip-local-climate-scheduler-card.ts", // Exclude Lit component from coverage
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
    "./src/utils.ts": {
      branches: 85,
      functions: 100,
      lines: 95,
      statements: 95,
    },
    "./src/types.ts": {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  moduleFileExtensions: ["ts", "js", "json"],
  transform: {
    "^.+\\.ts$": [
      "ts-jest",
      {
        tsconfig: {
          experimentalDecorators: true,
          useDefineForClassFields: false,
        },
      },
    ],
  },
};
