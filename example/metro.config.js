// Metro config for the example app. It consumes the library straight from
// `../src`, so edits to the module hot-reload without a build step.
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const root = path.resolve(__dirname, '..');
const PKG = require(path.join(root, 'package.json')).name; // @binnicordova/expo-thinking-orbs
const config = getDefaultConfig(__dirname);

const escape = (p) => p.replace(/[/\\]/g, '[/\\\\]');

// The library's devDependencies (react, react-native, jotai, Skia, expo…) also
// live in ../node_modules. Block them so the app only ever loads a single copy
// from ./node_modules — two copies of jotai or Skia would break at runtime.
const blockedPackages = [
  'react',
  'react-dom',
  'react-native',
  'react-native-web',
  'jotai',
  '@shopify/react-native-skia',
  'expo',
  '@expo',
];
config.resolver.blockList = [
  ...Array.from(config.resolver.blockList ?? []),
  ...blockedPackages.map(
    (name) => new RegExp(escape(path.join(root, 'node_modules', name)) + '[/\\\\].*')
  ),
];

config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, 'node_modules'),
  path.resolve(root, 'node_modules'),
];

config.watchFolders = [root];

const defaultResolve = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === PKG || moduleName.startsWith(`${PKG}/`)) {
    const sub = moduleName.slice(PKG.length); // '' | '/engine'
    const target = path.join(root, 'src', sub ? `${sub}/index` : 'index');
    return context.resolveRequest(context, target, platform);
  }
  return (defaultResolve ?? context.resolveRequest)(context, moduleName, platform);
};

module.exports = config;
