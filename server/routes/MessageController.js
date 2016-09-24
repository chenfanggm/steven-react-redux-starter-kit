import { _log } from '../utils/common'
import Router from 'koa-router'
import jwt from 'koa-jwt'
import Boom from 'boom'
import authRequired from '../middleware/auth-required'
import UserService from '../service/UserService'
import MessageService from '../service/MessageService'


const log = _log(__filename)

const MessageController = new Router()
/**
 * Get all messages
 */
MessageController.get('/', async (ctx, next) => {
  try {
    const allMessages = await MessageService.getAll()
    const query = ctx.request.query
    let unreadMessages = []
    if (Object.keys(query).length) {
      unreadMessages = await MessageService.getAll(query)
    }

    ctx.status = 200
    ctx.body = {
      unreadMessages: unreadMessages,
      allMessages: allMessages
    }
  } catch (error) {
    log.error(`Failed: getting messages: ${error}`)
    ctx.status = 500
  }
})

/**
 * Create message
 */
MessageController.post('/', authRequired(),
  async (ctx, next) => {
    ctx.checkBody('content').notEmpty()
    if (ctx.errors) {
      log.error(ctx.errors)
      const boom = Boom.badRequest().output
      ctx.status = boom.statusCode
      ctx.body = boom.payload;
      return
    }
    await next()
  },
  async (ctx, next) => {
    try {
      const message = ctx.request.body
      const userToken = ctx.state.user
      const user = await UserService.getById(userToken.userId)
      await MessageService.create(message, user)
      const messages = await MessageService.getAll()
      ctx.status = 200
      ctx.body = ctx.body = {
        allMessages: messages
      }
    } catch (error) {
      log.error(`Failed: create message: ${error}`)
      ctx.status = 500
    }
  })

export default MessageController
