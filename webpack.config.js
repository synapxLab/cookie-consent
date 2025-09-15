// webpack.config.js
const path = require('path');

module.exports = {
  entry: {
    cookie: './src/js/cookie.js', // 🍪 consentement
    bundle: './src/js/script.js'  // 🎯 JS du site
  },
  output: {
    path: path.resolve(__dirname, 'httpdocs', 'assets', 'js'),
    filename: '[name].js',           
    publicPath: '/assets/js/',
    clean: true
  },
  module: {
    rules: [
      { test: /\.s[ac]ss$/i, use: ['style-loader', 'css-loader', 'sass-loader'] }
    ]
  },
  devServer: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: 'all',
    static: { directory: path.resolve(__dirname, 'httpdocs') },
    hot: true,
    devMiddleware: { writeToDisk: true }  // écrit les fichiers pour que l’HTML puisse les charger
  }
};