const baseConfig = require('../../eslint.config.cjs');

module.exports = [
  ...baseConfig,
  {
    rules: {
      '@nx/enforce-module-boundaries': 'off',
    },
  },
];
