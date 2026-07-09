const expoPreset = require("jest-expo/jest-preset");

/** @type {import('jest').Config} */
module.exports = {
  preset: "jest-expo",
  setupFilesAfterEnv: ["<rootDir>/src/tests/setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  // Estende o transformIgnorePatterns do jest-expo para transpilar `@rn-primitives`
  // (publicado como JSX não compilado). Herda o padrão do preset e injeta o pacote.
  transformIgnorePatterns: expoPreset.transformIgnorePatterns.map((pattern) =>
    pattern.replace("/node_modules/(?!(", "/node_modules/(?!(@rn-primitives|"),
  ),
};
