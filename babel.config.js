module.exports = function (api) {
  // O plugin do Unistyles reescreve componentes para usar os elementos nativos +
  // ShadowRegistry (runtime C++) e transforma `styles.useVariants(v)`. Nos testes
  // usamos o mock oficial (`react-native-unistyles/mocks`), que espera os primitivos
  // crus do RN e não roda a reescrita, então o plugin é desativado sob o Jest.
  //
  // ATENÇÃO: NÃO detecte o Jest por `JEST_WORKER_ID`. O Metro paraleliza os transforms
  // com a lib `jest-worker`, que define `JEST_WORKER_ID` em cada processo worker — logo
  // essa variável está presente também no build de dev/produção e desativaria o plugin
  // no app real (variants/useVariants param de aplicar). O discriminador correto é o
  // ambiente: o Jest roda com `NODE_ENV=test`; o Metro com `development`/`production`.
  const isTest =
    process.env.NODE_ENV === "test" || process.env.BABEL_ENV === "test";
  api.cache.using(() => process.env.NODE_ENV);

  return {
    presets: ["babel-preset-expo"],
    plugins: isTest
      ? []
      : [
          [
            "react-native-unistyles/plugin",
            {
              root: "src", // raiz do seu código; ajuste se você usar 'app' ou outra pasta
            },
          ],
        ],
  };
};
