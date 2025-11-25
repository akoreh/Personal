const { composePlugins, withNx } = require('@nx/webpack');
const nodeExternals = require('webpack-node-externals');

module.exports = composePlugins(withNx(), (config) => {
  return {
    ...config,
    target: 'node',
    output: {
      ...config.output,
      libraryTarget: 'commonjs2',
    },
    externals: [
      // Exclude all node_modules from bundle
      nodeExternals({
        // Ensure native modules like bcrypt are treated as external
        allowlist: [],
      }),
    ],
    optimization: {
      minimize: false,
    },
  };
});
