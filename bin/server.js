import config from '../config'
import server from '../server/server'
import _debug from 'debug'

const debug = _debug('app:bin:server')
const port = config.server_port
const host = config.server_host

server.listen(port, (error) => {
  if (error) {
    debug (`Error:: @server start :: ${ error }`)
  } else {
    debug(`Server is now running at http://${host}:${port}.`)
  }
})
