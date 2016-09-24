import Router from 'koa-router'
import jwt from 'koa-jwt'
import convert from 'koa-convert'
import Boom from 'boom'
import config from '../../config'
import UserController from './UserController'
import PostController from './PostController'
import MessageController from './MessageController'


const apiRouter = new Router({
  prefix: '/api/v1'
})

apiRouter
  .use('/user', UserController.routes())
  .use('/post', PostController.routes())
  .use('/message', MessageController.routes())

apiRouter.allowedMethods({
  throw: true,
  notImplemented: () => Boom.notImplemented(),
  methodNotAllowed: () => Boom.methodNotAllowed()
})

export default apiRouter.routes()
