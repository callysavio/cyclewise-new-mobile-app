const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Resolve duplicate react-native-safe-area-context
config.resolver.alias = {
  ...config.resolver.alias,
  'react-native-safe-area-context': require.resolve('react-native-safe-area-context'),
};

module.exports = withNativeWind(config, { input: './global.css' });
