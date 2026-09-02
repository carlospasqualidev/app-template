const expoPreset = require("jest-expo/jest-preset");

/** @type {import('jest').Config} */
module.exports = {
  preset: "jest-expo",
  setupFilesAfterEnv: ["<rootDir>/src/tests/setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  // Com cache frio (CI, `--clearCache`, primeira execução após instalar), cada
  // worker transpila a árvore do react-native/jest-expo do zero. Os 5s default
  // do Jest estouram por inanição de CPU, não por teste lento — um teste de
  // ~100ms falhava no `pre-push`. Timeout folgado + metade dos cores (menos
  // contenção que os `cores - 1` do default) deixam o run frio determinístico.
  testTimeout: 30_000,
  maxWorkers: "50%",
  // Estende o transformIgnorePatterns do jest-expo para transpilar `@rn-primitives`
  // (publicado como JSX não compilado). Herda o padrão do preset e injeta o pacote.
  transformIgnorePatterns: expoPreset.transformIgnorePatterns.map((pattern) =>
    pattern.replace("/node_modules/(?!(", "/node_modules/(?!(@rn-primitives|"),
  ),
};
