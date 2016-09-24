import Boom from 'boom'
import { _log } from '../utils/common'


const log = _log(__filename)

const httpRequestHandler = () => async (ctx, next) => {
  try {
    await next()
  } catch (error) {
    if (401 == error.status) {
      const boom = Boom.unauthorized('Please Log In before access protected content').output
      ctx.status = boom.statusCode
      ctx.body = boom.payload
    } else {
      log.error(`Failed: uncaught error: ${error}`)
      throw error
    }
  }
}

export default httpRequestHandler
