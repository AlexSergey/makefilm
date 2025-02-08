module.exports = {
  '*.json': ['prettier --write', 'eslint --fix'],
  '*.md': ['prettier --write'],
  '*.{ts,tsx,js,jsx}': ['prettier --write', 'eslint --fix'],
};
