const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/main.tsx',
  output: {
    path: path.resolve(__dirname, './static'),
    publicPath: '/',
    filename: 'counters.js'
  },
  module: {
    rules: [{
      test: /\.tsx$|\.ts$/,
      include: path.resolve(__dirname, './src'),
      use: [{ loader: 'ts-loader' }]
    }]
  },
  devServer: {
    port: 3000,
    contentBase: path.resolve(__dirname, './static'),
    publicPath: '/'
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: path.resolve(__dirname, './static/index.html')
    })
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  }
};
