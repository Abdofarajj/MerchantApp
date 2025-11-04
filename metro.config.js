const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Add path aliases
config.resolver.alias = {
  ...config.resolver.alias,
  "@": "./src",
};

module.exports = config;
