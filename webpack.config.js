const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const entry = './src/entry.jsx';
const outputPath = path.resolve('./dist');
const publicPath = '/dist/';
const resolve = {
  extensions: ['.js', '.jsx'],
};

const clientConfig = {
  entry,
  target: "web",
  devtool: 'nosources-source-map',
  mode: process.env.NODE_ENV == "production" ? "production" : "development",
  output: {
    path: outputPath,
    chunkFilename: '[name].bundle.js',
    filename: 'index.bundle.js',
    publicPath,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          { loader: 'babel-loader' },
        ]
      }
    ]
  },
  resolve,
  plugins: [
    // Limit chunks to 1 effectively disable chunking (used in dynamic imports)
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1,
    })
  ]
};

const serverConfig = {
  entry,
  target: 'node',
  devtool: 'nosources-source-map',
  mode: process.env.NODE_ENV == "production" ? "production" : "development",
  node: {
    __dirname: false
  },
  output: {
    libraryTarget: 'commonjs2',
    path: outputPath,
    chunkFilename: '[name].server.bundle.js',
    filename: 'index.server.bundle.js',
    publicPath,
    // https://webpack.js.org/configuration/output/#output-strictmoduleexceptionhandling
    //  - When set to false, the module is not removed from cache, which results in 
    //    the exception getting thrown only on the first require call (making it incompatible with node.js).
    strictModuleExceptionHandling: true
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: require.resolve('babel-loader')
      }
    ]
  },
  resolve,
  plugins: [
    // Assume runs last
    new CleanWebpackPlugin('dist/*.*'),
    // Limit chunks to 1 effectively disable chunking (used in dynamic imports)
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1,
    })
  ]
};

module.exports = [
  clientConfig,
  serverConfig,
];
