import webpack from 'webpack'
import path from "path"
import HtmlWebpackPlugin from 'html-webpack-plugin'
import ExtractTextPlugin from "extract-text-webpack-plugin"

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, "./dist"),
    publicPath: '/dist/',
    filename: './js/bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        test: /\.pug$/,
        use: ['html-loader', 'pug-html-loader']
      },
      {
        test: /\.styl$/,
        use: ExtractTextPlugin.extract({
          fallbackLoader: "style-loader",
          loader: ["css-loader", "stylus-loader"],
          publicPath: '/dist'
        })
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      }
    ]
  },
  devtool: 'eval-source-map',
  devServer: {
    contentBase: false,
    compress: false,
    host: "192.168.1.6",
    port: 8080,
    stats: "errors-only"
  },
  plugins: [
    new HtmlWebpackPlugin({
      hash: true,
      template: './src/index.pug'
    }),
    new ExtractTextPlugin({
      filename: "styles.css",
      disable: true,
      allChunks: true
    })
  ]
}

if (isProduction) {
  module.exports.devtool = 'cheap-module-source-map'
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: false,
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ])
}
