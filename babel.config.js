module.exports = function (api) {
  api.cache(true);

  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "react-native-unistyles/plugin",
        {
          root: "src", // raiz do seu código; ajuste se você usar 'app' ou outra pasta
        },
      ],
    ],
  };
};
