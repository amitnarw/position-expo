module.exports = function (api) {
  api.cache(true);
  return {
    // `nativewind/babel` (-> react-native-css/babel) rewrites `react-native`
    // imports to their CSS-aware equivalents and enables the worklets plugin.
    // Without it every `className` is silently ignored.
    presets: ['babel-preset-expo', 'nativewind/babel'],
  };
};
