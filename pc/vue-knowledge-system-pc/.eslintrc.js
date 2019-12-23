module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'linebreak-style': 'off',
    'indent': 'off',
    'eol-last': 'off',
    'max-len': 'off',
    'no-restricted-syntax': 'off',
    'import/extensions': 'off',
    'import/prefer-default-export': 'off',
    'prefer-template': 'off',
    'eqeqeq': 'off',
    'comma-dangle': ['error', 'never']
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
};
