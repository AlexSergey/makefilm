const baseConfig = require('../../eslint.config.cjs');

module.exports = [
  ...baseConfig,
  {
    // TODO: migrations folder issue
    rules: {
      'check-file/filename-naming-convention': 'off',
    },
  },
];
