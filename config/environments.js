module.exports = {
  // ======================================================
  // Overrides when NODE_ENV === 'development'
  // ======================================================
  // NOTE: In development, we use an explicit public path when the assets
  // are served webpack by to fix this issue:
  // http://stackoverflow.com/questions/34133808/webpack-ots-parsing-error-loading-fonts/34133809#34133809
  development: (config) => ({
    compiler_public_path: `http://${config.server_host}:${config.server_port}/`,
    proxy: {
      enabled: false,
      options: {
        host: 'http://localhost:8000',
        match: /^\/api\/.*/
      }
    },
    globals: {
      ...config.globals,
      __NODE_API_URL__: JSON.stringify(`http://${config.server_host}:${config.server_port}/api/v1`),
      __JAVA_API_URL__: JSON.stringify(`http://${config.server_host}:9010/api/v1`)
    }
  }),

  // ======================================================
  // Overrides when NODE_ENV === 'production'
  // ======================================================
  production: (config) => ({
    server_host : 'your_host_domain.com',
    compiler_public_path: '/',
    compiler_fail_on_warning: false,
    compiler_hash_type: 'chunkhash',
    compiler_devtool: null,
    compiler_stats: {
      chunks: true,
      chunkModules: true,
      colors: true
    },
    proxy: {
      enabled: false,
      options: {
        // koa-proxy options
        host: 'http://your_host_domain.com:3000',
        match: /^\/api\/.*/
      }
    },
    cache_control: { max_age: 2 * 60 * 60 * 1000 }, // 2 hours
    globals: {
      ...config.globals,
      __NODE_API_URL__: JSON.stringify(`http://your_host_domian.com/api/v1`)
    }
  })
}

