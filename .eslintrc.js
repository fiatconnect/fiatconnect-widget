module.exports = {
  extends: ['@valora/eslint-config-typescript'],
  parserOptions: {
    project: './tsconfig.json',
  },
  ignorePatterns: ['tsconfig.json'],
}
