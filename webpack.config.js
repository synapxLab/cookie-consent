const path = require('path');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  
  return {
    entry: {
      cookie: './src/js/cookie.js',
      bundle: './src/js/script.js'
    },
    output: {
      path: isProduction 
        ? path.resolve(__dirname, 'dist')           // Pour npm
        : path.resolve(__dirname, 'httpdocs', 'assets', 'js'),  // Pour dev
      filename: '[name].js',
      publicPath: isProduction ? '/' : '/assets/js/',
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
      devMiddleware: { writeToDisk: true }
    }
  };
};