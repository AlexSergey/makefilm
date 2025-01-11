const nx = require('@nx/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');
const checkFile = require('eslint-plugin-check-file');
const json = require('eslint-plugin-json');
const perfectionist = require('eslint-plugin-perfectionist');
const prettierRecommended = require('eslint-plugin-prettier/recommended');
const regexpPlugin = require('eslint-plugin-regexp');
const eslintPluginUnicorn = require('eslint-plugin-unicorn');
const globals = require('globals');
const eslintTs = require('typescript-eslint');

const ignores = [
  '**/*.d.ts',
  '*.d.ts',
  'node_modules',
  'logs',
  '*.log',
  'lib-cov/',
  'coverage/',
  'NO_COMMIT/',
  'test-reports/**',
  'docs/*',
  'build/*',
  'lib/*',
  'dist/*',
  '*.css',
  '*.scss',
  '*.less',
  '*.ico',
  '*.jpg',
  '*.jpeg',
  '*.png',
  '*.svg',
  '*.bmp',
  '*.gif',
  '*.webp',
  '*.woff',
  '*.woff2',
  '*.txt',
  '*.mdx',
  '*.md',
  '*.json',
  '*.ejs',
  '*.hbs',
  '*.jade',
  '*.html',
  'docs/',
  'public/',
  'locales/',
  'src/locales/',
  'seo_report',
  '**/dist',
];
const tsFiles = ['**/*.ts'];

const languageOptions = {
  ecmaVersion: 2024,
  globals: {
    ...globals.node,
    ...globals.jest,
  },
  sourceType: 'module',
};

const customTypescriptConfig = {
  files: tsFiles,
  plugins: {
    'check-file': checkFile,
    'import/parsers': tsParser,
    unicorn: eslintPluginUnicorn,
  },
  rules: {
    '@typescript-eslint/ban-ts-comment': 'error',
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/explicit-function-return-type': 'warn',
    '@typescript-eslint/naming-convention': [
      'error',
      {
        format: ['UPPER_CASE', 'StrictPascalCase'],
        selector: 'interface',
      },
      {
        format: ['PascalCase'],
        selector: 'typeLike',
      },
      {
        format: ['UPPER_CASE', 'StrictPascalCase'],
        selector: 'class',
      },
    ],
    '@typescript-eslint/no-empty-interface': [
      'error',
      {
        allowSingleExtends: true,
      },
    ],
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        args: 'after-used',
        ignoreRestSiblings: false,
        vars: 'all',
      },
    ],
    '@typescript-eslint/return-await': 'off',

    camelcase: ['error', { properties: 'always' }],

    'check-file/filename-naming-convention': [
      'error',
      {
        'src/**/*.{ts,tsx}': 'KEBAB_CASE',
      },
      {
        ignoreMiddleExtensions: true,
      },
    ],
    'check-file/folder-naming-convention': [
      'error',
      {
        'src/**/': 'KEBAB_CASE',
      },
    ],

    'class-methods-use-this': 'off',
    'newline-before-return': 'error',
    'no-alert': 'error',
    'no-await-in-loop': 'off',
    'no-console': 'error',
    'no-debugger': 'error',
    'no-param-reassign': 'off',
    'no-plusplus': 'off',
    'no-return-await': 'off',
    'no-underscore-dangle': 'off',
    'no-unused-vars': 'off',
    'no-warning-comments': 'warn',

    'unicorn/custom-error-definition': 'error',
    'unicorn/empty-brace-spaces': 'error',
    'unicorn/error-message': 'error',
    'unicorn/no-instanceof-array': 'error',
    'unicorn/prefer-keyboard-event-key': 'error',
    'unicorn/prefer-node-protocol': 'error',
    'unicorn/throw-new-error': 'error',
  },
};

// Add the files for applying the recommended TypeScript configs
// only for the Typescript files.
// This is necessary when we have the multiple extensions files
// (e.g. .ts, .tsx, .js, .cjs, .mjs, etc.).
const recommendedTypeScriptConfigs = [
  ...eslintTs.configs.recommended.map((config) => ({
    ...config,
    files: tsFiles,
  })),
  ...eslintTs.configs.stylistic.map((config) => ({
    ...config,
    files: tsFiles,
  })),
];

module.exports = [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  { ignores },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?js$'],
          depConstraints: [
            {
              onlyDependOnLibsWithTags: ['*'],
              sourceTag: '*',
            },
          ],
          enforceBuildableLibDependency: true,
        },
      ],
    },
  },
  ...recommendedTypeScriptConfigs,
  prettierRecommended,
  perfectionist.configs['recommended-natural'],
  regexpPlugin.configs['flat/recommended'],
  json.configs['recommended'],
  customTypescriptConfig,
];
