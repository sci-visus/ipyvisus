const path = require('path');
const nodeExternals = require('webpack-node-externals');
const CopyPlugin = require('copy-webpack-plugin');
const WebPackBar = require('webpackbar');

// const autoprefixer = require('autoprefixer');
// const WorkboxPlugin = require('workbox-webpack-plugin');
// var vtkRules = require('vtk.js/Utilities/config/dependency.js').webpack.core.rules;
// var cssRules = require('vtk.js/Utilities/config/dependency.js').webpack.css.rules;

const sourcePath = path.join(__dirname, './src');
const outputPath = path.join(__dirname, './lib');

const maxAssetSize = 2000000; // 2M

module.exports =  {
  entry:'./src/plugin.js',
  output: {
    filename: 'labext.js',
    path: outputPath,
    libraryTarget: 'amd'
  },
  mode: 'development',
  devtool: 'source-map',
  module: {
    rules: [
      { test: /\.js$/, loader: "source-map-loader" },
      { test: /\.css$/,  use: [ 'style-loader', 'css-loader' ] },
      { test: /\.html$/, use: {loader: 'raw-loader' }},
      { test: /\.(png|svg|jpg|gif)$/, use: [ 'file-loader' ] },
    ],
  },

  plugins: [
    new WebPackBar(),
    new CopyPlugin([
      {from: 'src/**/*.{html,css}', transformPath(target, abs) {
          return target.substring(4);
          }
      }
      ])
  ],
  resolve: {
    // extensions: ['.ts', '.js', '.css', '.scss', '.html'],
   extensions: ['.webpack-loader.js', '.web-loader.js', '.loader.js', '.js', '.jsx'],
   modules: [
      path.resolve(__dirname, 'node_modules'),
      sourcePath,
    ],
  },

  externals: [
   '@jupyter-widgets/base',
    'jupyter-scales',
    'jupyter-datawidgets',
    'jupyter-dataserializers'
  ],

  performance : {
    maxAssetSize: maxAssetSize,
    maxEntrypointSize: maxAssetSize,
  }
};
