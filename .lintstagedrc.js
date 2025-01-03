module.exports = {
  '*.md': ['prettier --write'],
  'package.json': ['npm run format:package'],
  '{src,test}/**/*.ts': [() => 'npm run lint:ts'],
  '{src,test}/**/*.{ts,json}': ['prettier --write', 'eslint --fix'],
};
