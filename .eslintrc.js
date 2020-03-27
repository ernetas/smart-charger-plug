module.exports = {
  "env": {
    "node": true,
    "es6": true,
    "jest": true
  },
  "extends": ["airbnb-base"],
  "parserOptions": {
    "sourceType": "module"
  },
  "rules": {
    "max-len": ["error", {
      "code": 120,
      "ignoreTrailingComments": true
    }],
    "comma-dangle": ["error", {
      "arrays": "always-multiline",
      "objects": "always-multiline",
      "imports": "always-multiline",
      "exports": "always-multiline",
      "functions": "never"
    }]
  }
};
