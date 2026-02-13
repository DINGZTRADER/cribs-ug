module.exports = {
  root: false,
  env: {
    es2022: true,
    node: true
  },
  parserOptions: {
    ecmaVersion: "latest"
  },
  extends: ["eslint:recommended"],
  ignorePatterns: ["dist", "node_modules"]
};
