const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const BUILD_DIR = path.resolve(__dirname, 'dist');
const APP_DIR = path.resolve(__dirname, 'src');
const addPolyfills = !!process.env.ADD_POLYFILLS;

var config = {
  entry: APP_DIR + '/cjs.js',
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.js$/,
        include: APP_DIR,
        loader: 'eslint-loader',
        enforce: 'pre'
      },
      {
        test: /\.js?$/,
        include: APP_DIR,
        loader: 'babel-loader'
      },
      {
        test: /\.sass$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "sass-loader"
        ]
      },
    ],
  },
  output: {
    path: BUILD_DIR,
    filename: `sdk.js`,
    library: 'DatoCmsPlugin',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  devtool: 'source-map',
  optimization: { minimize: true },
};

config.plugins = [
  new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }
  }),
  new MiniCssExtractPlugin({
    filename: "sdk.css",
    chunkFilename: "sdk.css"
  })
].filter(x => !!x);

module.exports = config;

