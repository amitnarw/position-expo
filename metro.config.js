const { getDefaultConfig } = require('expo/metro-config');
const { withNativewind } = require('nativewind/metro');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Metro derives its file-watch set from watchFolders minus resolver.blockList.
// The generated native project holds hundreds of thousands of build artifacts
// (Gradle intermediates, CMake objects, APKs) that balloon watcher startup past
// its timeout ("Failed to start watch mode"). None of it is JS, so ignore it.
// NB: these must be anchored to the project root. A bare /[\\/]android[\\/]/
// pattern also matches node_modules/**/android/**, which breaks resolutions
// such as react-native-screens' ./android/StackHeaderSubview.android.
const escapeForRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const rootPrefix = escapeForRegExp(__dirname);

config.resolver.blockList = [
  ...(Array.isArray(config.resolver.blockList)
    ? config.resolver.blockList
    : config.resolver.blockList
      ? [config.resolver.blockList]
      : []),
  new RegExp(`^${rootPrefix}[\\\\/]android[\\\\/]`),
  new RegExp(`^${rootPrefix}[\\\\/]\\.expo[\\\\/]`),
];

const dynamicTokens = [
  '--color-paper',
  '--color-surface',
  '--color-surface-2',
  '--color-surface-3',
  '--color-ink',
  '--color-ink-soft',
  '--color-muted',
  '--color-line',
  '--color-warm',
  '--color-warm-ink',
  '--color-control',
  '--color-control-ink',
  '--color-clay',
  '--color-accent',
  '--color-accent-on',
  '--color-danger',
];

module.exports = withNativewind(config, {
  // react-native-css' resolver polyfill rewrites every `react-native` import to
  // its className-aware component barrel — including library imports such as
  // expo-asset's `AssetRegistry`, which then resolves to undefined and silently
  // breaks font loading. The Babel plugin already rewrites the components we
  // render, so the global polyfill is unnecessary here.
  globalClassNamePolyfill: false,
  inlineVariables: {
    exclude: dynamicTokens,
  },
});
