module.exports = {
  '*.{ts,tsx}': ['tsc --noEmit', 'prettier --write', 'eslint --fix', 'git add'],
  '*.{js,jsx}': ['prettier --write', 'eslint --fix', 'git add'],
  '*.json': ['prettier --write', 'eslint --fix', 'git add'],
  '*.md': ['prettier --write', 'git add'],
  'package.json': ['npm run format:package', 'git add'],
};
