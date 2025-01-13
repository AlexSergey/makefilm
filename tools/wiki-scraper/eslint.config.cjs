const baseConfig = require('../../eslint.config.cjs');

const ignores = ['src/data/*.json', 'src/data2/*.json'];

module.exports = [
  ...baseConfig,
  { ignores },
  {
    files: ['**/*.json'],
    languageOptions: {
      parser: require('jsonc-eslint-parser'),
    },
    rules: {
      '@nx/dependency-checks': [
        'error',
        {
          ignoredFiles: ['{projectRoot}/eslint.config.{js,cjs,mjs}'],
        },
      ],
    },
  },
  {
    rules: {
      'no-console': 'off',
    },
  },
];
