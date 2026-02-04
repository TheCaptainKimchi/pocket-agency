const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const isDev = process.env.ENVIRONMENT === 'development';

console.log('isDev', isDev);

module.exports = {
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      title: 'Pocket Agency'
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: '../assets',
          to: 'assets',
          noErrorOnMissing: true
        }
      ]
    })
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist')
    },
    compress: true,
    port: 8080,
    hot: true,
    // Only apply these if we are in development mode
      allowedHosts: isDev ? 'all' : 'auto',
      client: isDev ? {
        webSocketURL: 'auto://0.0.0.0:0/ws',
      } : {},
  }
};
