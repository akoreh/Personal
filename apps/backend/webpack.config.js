const { composePlugins, withNx } = require('@nx/webpack');
const nodeExternals = require('webpack-node-externals');
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');

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
    plugins: [
      ...(config.plugins || []),
      new CopyPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, 'src/public'),
            to: 'public',
          },
        ],
      }),
    ],
  };
});
