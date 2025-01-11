const nx = require('@nx/eslint-plugin');
const baseConfig = require('../../../../eslint.config.js');

module.exports = [
  ...baseConfig,
  ...nx.configs['flat/angular'],
  ...nx.configs['flat/angular-template'],
];
