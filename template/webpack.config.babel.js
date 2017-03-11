import webpack from 'webpack'
import path from "path"
import HtmlWebpackPlugin from 'html-webpack-plugin'
import ExtractTextPlugin from "extract-text-webpack-plugin"

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: './js/bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: 'vue-loader',
      },
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
      {{#pug}}
      {
        test: /\.pug$/,
        use: ['html-loader', 'pug-html-loader']
      },
      {{/pug}}
      {{#stylus}}
      {
        test: /\.styl$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: ["css-loader", "stylus-loader"]
        })
      },
      {{/stylus}}
      {
        test: /\.(png|jpg|gif|svg)$/,
        use: 'file-loader?name=images/[name].[ext]?[hash]'
      }
    ]
  },
  devtool: 'eval-source-map',
  devServer: {
    contentBase: false,
    compress: false,
    host: "{{ host }}", 
    port: 8080,
    stats: "errors-only"
  },
  plugins: [
    new HtmlWebpackPlugin({
      hash: true,
      template: './src/index.pug'
    }),
    new ExtractTextPlugin({
      filename: "styles/styles.css",
      disable: false,
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
