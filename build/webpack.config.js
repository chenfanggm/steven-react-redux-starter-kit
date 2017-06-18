const path = require('path')
const argv = require('yargs').argv
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const config = require('../config')
const debug = require('debug')('app:config:webpack')

const paths = config.utils_paths
const __DEV__ = config.globals.__DEV__
const __PROD__ = config.globals.__PROD__
const __TEST__ = config.globals.__TEST__

debug('Init configuration.')
const webpackConfig = {
  entry: {
    normalize: [paths.client('normalize')],
    app: [
      'babel-polyfill',
      paths.client('main'),
      __DEV__ ? `webpack-hot-middleware/client.js?path=${config.compiler_public_path}__webpack_hmr` : ''
    ],
    vendor: config.compiler_vendors
  },
  devtool: config.compiler_source_map ? 'source-map' : false,
  output: {
    path: paths.dist(),
    filename: __DEV__ ? `[name].js` : `[name].[${config.compiler_hash_type}].js`,
    publicPath: config.compiler_public_path
  },
  resolve: {
    modules: [
      paths.client(),
      'node_modules'
    ],
    extensions: ['*', '.js', '.jsx', '.json']
  },
  externals: {},
  module: {
    rules: []
  },
  plugins: [
    new webpack.DefinePlugin(config.globals),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery'
    })
  ]
}

// ------------------------------------
// Loaders
// ------------------------------------
// JavaScript
webpackConfig.module.rules.push({
  test: /\.(js|jsx)$/,
  exclude: /node_modules/,
  use: [{
    loader: 'babel-loader',
    query: {
      cacheDirectory: true,
      plugins: [
        'lodash',
        'babel-plugin-transform-class-properties',
        'babel-plugin-syntax-dynamic-import',
        [
          'babel-plugin-transform-runtime',
          {
            helpers: true,
            polyfill: false, // we polyfill needed features in src/normalize.js
            regenerator: true,
          },
        ],
        [
          'babel-plugin-transform-object-rest-spread',
          {
            useBuiltIns: true // we polyfill Object.assign in src/normalize.js
          },
        ],
        ["import", [{ "libraryName": "antd", "style": "css" }]]
      ],
      presets: [
        'babel-preset-react',
        ['babel-preset-env', {
          modules: false,
          targets: {
            ie9: true,
          },
          uglify: true,
        }]
      ]
    }
  }]
})

// JSON
webpackConfig.module.rules.push({
  test: /\.json$/,
  loader: 'json'
})

// File loaders
webpackConfig.module.rules.push(
  { test: /\.woff$/,  loader: 'url-loader', options: { name: 'fonts/[name].[ext]', limit: 10000, mimetype: 'application/font-woff' } },
  { test: /\.woff2$/, loader: 'url-loader', options: { name: 'fonts/[name].[ext]', limit: 10000, mimetype: 'application/font-woff2' } },
  { test: /\.otf$/,   loader: 'url-loader', options: { name: 'fonts/[name].[ext]', limit: 10000, mimetype: 'font/opentype' } },
  { test: /\.ttf$/,   loader: 'url-loader', options: { name: 'fonts/[name].[ext]', limit: 10000, mimetype: 'application/octet-stream' } },
  { test: /\.eot$/,   loader: 'url-loader', options: { name: 'fonts/[name].[ext]', limit: 10000, mimetype: 'application/vnd.ms-fontobject' } },
  { test: /\.svg/,    loader: 'url-loader', options: { name: 'fonts/[name].[ext]', limit: 10000, mimetype: 'image/svg+xml' } },
  { test: /\.(jpe?g|png|gif)$/i, loader: 'url-loader', options: { limit: 8192 } }
)

// ------------------------------------
// Style Loaders
// ------------------------------------
// If config has CSS modules enabled, treat this project's styles as CSS modules.
const PATHS_TO_TREAT_AS_CSS_MODULES = []
if (config.compiler_css_modules) {
  PATHS_TO_TREAT_AS_CSS_MODULES.push(
    paths.client().replace(/[\^\$\.\*\+\-\?\=\!\:\|\\\/\(\)\[\]\{\}\,]/g, '\\$&') // eslint-disable-line
  )
}
const isUsingCSSModules = !!PATHS_TO_TREAT_AS_CSS_MODULES.length
const cssModulesRegex = new RegExp(`(${PATHS_TO_TREAT_AS_CSS_MODULES.join('|')})`)

// Loaders for styles that need to be treated as CSS modules.
const extractStyles = new ExtractTextPlugin({
  filename: '[name].[contenthash].css',
  allChunks: true,
  disable: __DEV__,
})

if (isUsingCSSModules) {
  webpackConfig.module.rules.push({
    test: /\.(sass|scss)$/,
    //include: cssModulesRegex,
    loader: extractStyles.extract({
      fallback: 'style-loader',
      use: [
        {
          loader: 'css-loader',
          options: {
            modules: true,
            importLoaders: 1,
            localIdentName: '[path][name]__[local]--[hash:base64:5]',
            sourceMap: config.compiler_source_map,
            minimize: false && {
              autoprefixer: {
                add: true,
                remove: true,
                browsers: ['last 2 versions'],
              },
              discardComments: {
                removeAll : true,
              },
              discardUnused: false,
              mergeIdents: false,
              reduceIdents: false,
              safe: true,
              sourcemap: config.compiler_source_map,
            },
          },
        },
        {
          loader: 'postcss-loader',
          options: {
            sourceMap: config.compiler_source_map,
            ident: 'postcss',
            plugins () {
              return [
                require('autoprefixer')({
                  add: true,
                  remove: true,
                  browsers: ['last 2 versions']
                }),
                require('cssnano')({
                  discardComments: {
                    removeAll: true
                  },
                  discardUnused: false,
                  mergeIdents: false,
                  reduceIdents: false,
                  safe: true,
                  sourcemap: true
                })
              ]
            }
          }

        },
        {
          loader: 'sass-loader',
          options: {
            sourceMap: config.compiler_source_map,
            includePaths: [
              paths.client('styles'),
            ],
          },
        }
      ]
    })
  })

  webpackConfig.module.rules.push({
    test: /\.css$/,
    //include: cssModulesRegex,
    loader: extractStyles.extract({
      fallback: 'style-loader',
      use: [
        {
          loader: 'css-loader',
          options: {
            modules: true,
            importLoaders: 1,
            localIdentName: '[path][name]__[local]--[hash:base64:5]',
            sourceMap: config.compiler_source_map,
            minimize: false && {
              autoprefixer: {
                add: true,
                remove: true,
                browsers: ['last 2 versions'],
              },
              discardComments: {
                removeAll : true,
              },
              discardUnused: false,
              mergeIdents: false,
              reduceIdents: false,
              safe: true,
              sourcemap: config.compiler_source_map,
            },
          },
        },
        {
          loader: 'postcss-loader',
          options: {
            sourceMap: config.compiler_source_map,
            ident: 'postcss',  // <= this line
            plugins () {
              return [
                require('autoprefixer')({
                  add: true,
                  remove: true,
                  browsers: ['last 2 versions']
                }),
                require('cssnano')({
                  discardComments: {
                    removeAll: true
                  },
                  discardUnused: false,
                  mergeIdents: false,
                  reduceIdents: false,
                  safe: true,
                  sourcemap: true
                })
              ]
            }
          }
        }
      ]
    })
  })
}

// Loaders for files that should not be treated as CSS modules.
/*const excludeCSSModules = isUsingCSSModules ? cssModulesRegex : false
webpackConfig.module.rules.push({
  test: /\.scss$/,
  exclude: excludeCSSModules,
  loader: extractStyles.extract({
    fallback: 'style-loader',
    use: [
      {
        loader: 'css-loader',
        options: {
          importLoaders: 1,
          localIdentName: '[path][name]__[local]--[hash:base64:5]',
          sourceMap: config.compiler_source_map,
          minimize: false && {
            autoprefixer: {
              add: true,
              remove: true,
              browsers: ['last 2 versions'],
            },
            discardComments: {
              removeAll : true,
            },
            discardUnused: false,
            mergeIdents: false,
            reduceIdents: false,
            safe: true,
            sourcemap: config.compiler_source_map,
          },
        },
      },
      {
        loader: 'postcss-loader'
      },
      {
        loader: 'sass-loader',
        options: {
          sourceMap: config.compiler_source_map,
          includePaths: [
            paths.client('styles'),
          ],
        },
      }
    ]
  })
})
webpackConfig.module.rules.push({
  test: /\.css$/,
  exclude: excludeCSSModules,
  loader: extractStyles.extract({
    fallback: 'style-loader',
    use: [
      {
        loader: 'css-loader',
        options: {
          modules: true,
          importLoaders: 1,
          localIdentName: '[path][name]__[local]--[hash:base64:5]',
          sourceMap: config.compiler_source_map,
          minimize: false && {
            autoprefixer: {
              add: true,
              remove: true,
              browsers: ['last 2 versions'],
            },
            discardComments: {
              removeAll : true,
            },
            discardUnused: false,
            mergeIdents: false,
            reduceIdents: false,
            safe: true,
            sourcemap: config.compiler_source_map,
          },
        },
      },
      {
        loader: 'postcss-loader'
      }
    ]
  })
})*/

webpackConfig.plugins.push(extractStyles)
/*webpackConfig.plugins.push(new webpack.LoaderOptionsPlugin({
  options: {
    postcss: [

    ]
  }
}))*/

// HTML Template
webpackConfig.plugins.push(new HtmlWebpackPlugin({
  template: paths.client('index.html'),
  favicon: paths.client('static/favicon.ico'),
  hash: false,
  inject: true,
  minify: {
    collapseWhitespace: true
  }
}))

// Development Tools
if (__DEV__) {
  debug('Enable plugins for live development (HMR, NoErrors).')
  webpackConfig.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin()
  )
}

// Bundle Splitting
if (!__TEST__) {
  debug('Enable plugins for bundle split')
  webpackConfig.plugins.push(
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor', 'normalize', 'manifest']
    })
  )
}

// Ensure that the compiler exits on errors during testing so that
// they do not get skipped and misreported.
if (__TEST__ && !argv.watch) {
  webpackConfig.plugins.push(function () {
    this.plugin('done', function (stats) {
      if (stats.compilation.errors.length) {
        // Pretend no assets were generated. This prevents the tests
        // from running making it clear that there were warnings.
        throw new Error(
          stats.compilation.errors.map(err => err.message || err)
        )
      }
    })
  })
}

// Production Optimizations
if (__PROD__) {
  webpackConfig.plugins.push(
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),
    //new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: !!config.devtool,
      comments: false,
      compress: {
        warnings: false,
        screw_ie8: true,
        conditionals: true,
        unused: true,
        comparisons: true,
        sequences: true,
        dead_code: true,
        evaluate: true,
        if_return: true,
        join_vars: true,
      },
    }),
    //new webpack.optimize.AggressiveMergingPlugin()
  )
}

module.exports = webpackConfig
