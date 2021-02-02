module.exports = {
  env: {
    browser: true,
    es2020: true,
    node: true
  },
  extends: ["plugin:react/recommended", "standard"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 11,
    sourceType: "module"
  },
  plugins: ["react", "@typescript-eslint"],
  rules: {
    "no-console": 0,
    "no-unused-vars": 1,
    "react/prop-types": 0,
    "react/jsx-filename-extension": 0,
    "no-restricted-syntax": 0,
    "require-jsdoc": 0,
    "comma-dangle": ["error", "never"],
    "quote-props": 0,
    "no-underscore-dangle": 0,
    "semi": ["error", "always"],
    "quotes": ["error", "double"],
    "linebreak-style": 0,
    "new-cap": 0,
    "object-curly-newline": 0,
    "prefer-promise-reject-errors": 0,
    "camelcase": 0,
    "max-len": ["error", { ignoreComments: true, code: 250, tabWidth: 2 }],
    "object-curly-spacing": ["error", "always", { objectsInObjects: false }],
    "import/prefer-default-export": 0,
    "space-before-function-paren": 0,
    "no-use-before-define": 0
  }
};
