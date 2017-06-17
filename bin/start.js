'use strict'

const config = require('../config')
import server from '../server'
const debug = require('debug')('app:bin:server')

const port = config.server_port
const host = config.server_host

server.listen(port, (error) => {
  if (error) {
    debug (`Error:: @server start :: ${ error }`)
  } else {
    debug(`Server is now running at http://${host}:${port}.`)
  }
})
