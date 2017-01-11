const Dotenv = require('dotenv-webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const WatchIgnorePlugin = require('watch-ignore-webpack-plugin');

module.exports = {
  entry: './src/ui/index.js',
  devtool: 'eval-source-map',
  output: {
    publicPath: '/',
    filename: 'bundle.js',
  },
  module: {
    loaders: [
      {
        test: /\.css/,
        loader: 'style!css',
      },
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/,
      },
      {
        test: /\.json$/,
        loader: 'json',
      },
    ],
  },
  resolveLoader: {
    root: path.join(__dirname, 'node_modules'),
  },
  plugins: [
    new Dotenv({
      path: './.env',
      safe: true,
    }),
    new WatchIgnorePlugin([
      path.resolve(__dirname, './src/api/'),
    ]),
    new HtmlWebpackPlugin({
      template: './src/ui/index.html',
    }),
  ],
  devServer: {
    proxy: {
    },
    historyApiFallback: {
      index: '/',
    },
  },
  node: {
    dns: 'mock',
    net: 'mock',
  },
};
