const baseConfig = require('../../eslint.config.cjs');

module.exports = [
  ...baseConfig,
  {
    rules: {
      // TODO: temporary
      camelcase: 'off',
    },
  },
];
