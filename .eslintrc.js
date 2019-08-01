module.exports = {
  'env': {
    'es6': true,
    'node': true,
  },
  'extends': [
    'google',
  ],
  'globals': {
    'Atomics': 'readonly',
    'SharedArrayBuffer': 'readonly',
  },
  'parserOptions': {
    'ecmaVersion': 2018,
  },
  'rules': {
    'func-style': [
      'error',
      'declaration',
    ],
    'no-implicit-globals': 'error',
    'strict': ['error', 'global'],
    'dot-notation': 'error'
  },
};
