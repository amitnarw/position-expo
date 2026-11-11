const { getDefaultConfig } = require('expo/metro-config');
const { withNativewind } = require('nativewind/metro');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

const dynamicTokens = [
  '--color-paper',
  '--color-surface',
  '--color-surface-2',
  '--color-ink',
  '--color-ink-soft',
  '--color-muted',
  '--color-line',
  '--color-clay',
  '--color-clay-soft',
  '--color-sage',
  '--color-plum',
  '--color-ochre',
  '--color-accent',
  '--color-accent-soft',
];

module.exports = withNativewind(config, {
  inlineVariables: {
    exclude: dynamicTokens,
  },
});
