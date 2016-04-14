var webpack = require('webpack');

var definePlugin = new webpack.DefinePlugin({
  __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true')),
  __PRERELEASE__: JSON.stringify(JSON.parse(process.env.BUILD_PRERELEASE || 'false'))
});

var commonsPlugin = new webpack.optimize.CommonsChunkPlugin('common.js');

module.exports = {
  cache: true,
  entry: {
    main:  './src/index.jsx'
  },
  output: {
    path: 'public/build',
    filename: '[name].js'
  },
  module: {
    loaders: [
      {
          test: /\.js?$/,
          exclude: /node_modules/,
          loader: 'react-hot!babel'
      },
      {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          loader: 'react-hot!babel'
      }
    ]
  },
  resolve: {
      extensions: ['', '.js','.jsx']
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    definePlugin,
    commonsPlugin
  ]
};