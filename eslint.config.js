// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");
const security = require("eslint-plugin-security");

module.exports = defineConfig([
  expoConfig,
  security.configs.recommended,
  {
    // require() é idiomático em arquivos de config e nas factories de jest.mock.
    files: ["*.config.js", "src/tests/setup.ts"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
  {
    ignores: ["dist/*"],
  },
]);
