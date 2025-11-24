const { composePlugins, withNx } = require('@nx/webpack');

module.exports = composePlugins(withNx(), (config) => {
  return {
    ...config,
    target: 'node',
    output: {
      ...config.output,
      libraryTarget: 'commonjs2',
    },
    externals: {
      // Exclude all node_modules from bundle
      ...require('webpack-node-externals')(),
    },
    optimization: {
      minimize: false,
    },
  };
});
