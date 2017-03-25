import Koa from 'koa'
import conditional from 'koa-conditional-get'
import etag from 'koa-etag'
import compress from 'koa-compress'
import proxy from 'koa-proxy'
import bodyParser from 'koa-bodyparser'
import serve from 'koa-static'
import validator from 'koa-validate'
import cors from 'kcors'
import historyApiFallback from 'koa-connect-history-api-fallback'
import convert from 'koa-convert'

import mongoose from 'mongoose'
import webpack from 'webpack'
import webpackConfig from '../build/webpack.config'
import webpackDevMiddleware from './middleware/webpack-dev'
import webpackHMRMiddleware from './middleware/webpack-hmr'
import httpRequestHandler from './middleware/http-request-handler'

import _debug from 'debug'
import config from '../config'
import { _log } from './utils/common'
import routes from './routes'

const debug = _debug('app:server')
const log = _log(__filename)
const paths = config.utils_paths
const app = new Koa()


/**
 * Middleware
 */
// init mongoose to mongodb
debug("Init mongoose...")
mongoose.connect(config.mongo_uri)
mongoose.Promise = global.Promise

// init koa server
debug("Init server middleware...")

// compress
app.use(compress())

// etag
app.use(convert(conditional()))
app.use(etag())

// init koa-validate
validator(app)

// log api request
app.use(async (ctx, next) => {
  const start = new Date;
  log.info(`${ctx.method} ${ctx.url} begins`)
  await next();
  const ms = new Date - start;
  log.info(`${ctx.method} ${ctx.url} ends in ${ms}ms, code: ${ctx.status}`)
})

// koa-proxy
if (config.proxy && config.proxy.enabled) {
  app.use(proxy(config.proxy.options))
}

// CORS
app.use(convert(cors({
  origin: (ctx) => {
    const originWhiteList = config.cors.origin
    const origin = ctx.request.header.origin
    if(origin && originWhiteList.includes(origin)){
      return origin
    }
  },
  credentials: config.cors.credentials,
  allowMethods: config.cors.allowMethods
})))

// koa-bodyparser
app.use(bodyParser())

// Custom 401 handling if you don't want to expose koa-jwt errors to users
app.use(httpRequestHandler())

/**
 * Routing
 */
app.use(routes)

// redirect routes requests to the root /index.html file
app.use(historyApiFallback({verbose: false}))

// ------------------------------------
// Apply Webpack HMR Middleware
// ------------------------------------
if (config.env === 'development') {
  const compiler = webpack(webpackConfig)

  // Enable webpack-dev and webpack-hot middleware
  const { publicPath } = webpackConfig.output

  app.use(webpackDevMiddleware(compiler, publicPath))
  app.use(webpackHMRMiddleware(compiler))

  app.use(serve(paths.client('static')))
  debug('Server is running on DEVELOPMENT mode.')
} else {
  debug('Server is running on PRODUCTION mode.')
  app.use(serve(paths.dist(), {
    maxage: config.cache_control.max_age
  }))
}

module.exports = app
