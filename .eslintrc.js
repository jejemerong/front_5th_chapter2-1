module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',

    'arrow-spacing': ['error', { before: true, after: true }],
    'space-in-parens': ['error', 'never'],
    'space-infix-ops': 'error',

    'no-unused-vars': 'warn',
  },
};
