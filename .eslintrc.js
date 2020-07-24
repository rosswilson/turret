module.exports = {
  env: {
    commonjs: true,
    es6: true,
    node: true,
    jest: true,
    "codeceptjs/codeceptjs": true,
  },
  extends: "eslint:recommended",
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  rules: {},
  plugins: ["codeceptjs"],
};
