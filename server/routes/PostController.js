import { _log } from '../utils/common'
import Router from 'koa-router'
import jwt from 'koa-jwt'
import Boom from 'boom'
import authRequired from '../middleware/auth-required'
import PostService from '../service/PostService'


const log = _log(__filename)

const PostController = new Router()
/**
 * Get All Posts
 */
PostController.get('/', async (ctx, next) => {
  try {
    const posts = await PostService.getAll()
    ctx.status = 200
    ctx.body = {
      posts: posts
    }
  } catch (error) {
    log.error(`Failed: getting posts: ${error}`)
    ctx.status = 500
  }
})

/**
 * Get post by url
 */
PostController.get('/url/:url', async (ctx, next) => {
  try {
    const post = await PostService.getByUrl(ctx.params.url)
    if (post) {
      ctx.status = 200
      ctx.body = {
        post: post
      }
    } else {
      const boom = Boom.notFound().output
      ctx.status = boom.statusCode
      ctx.body = boom.payload
    }
  } catch (error) {
    log.error(`Failed: getting posts: ${error}`)
    ctx.status = 500
  }
})

/**
 * Create post
 */
PostController.post('/', authRequired(),
  async (ctx, next) => {
    ctx.checkBody('author').notEmpty()
    ctx.checkBody('author').notEmpty()
    ctx.checkBody('title').notEmpty()
    ctx.checkBody('url').notEmpty()
    ctx.checkBody('readLength').notEmpty()
    ctx.checkBody('content').empty()
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
      const post = ctx.request.body
      const createdPost = await PostService.create(post)
      ctx.status = 200
      ctx.body = {
        post: createdPost
      }
    } catch (error) {
      log.error(`Failed: create posts: ${error}`)
      ctx.status = 500
    }
  })

/**
 * Update post
 */
PostController.put('/', authRequired(),
  async (ctx, next) => {
    ctx.checkBody('_id').notEmpty()
    ctx.checkBody('author').notEmpty()
    ctx.checkBody('title').notEmpty()
    ctx.checkBody('url').notEmpty()
    ctx.checkBody('readLength').notEmpty()
    ctx.checkBody('content').empty()
    if (ctx.errors) {
      log.error(ctx.errors)
      let boom = Boom.badRequest().output
      ctx.status = boom.statusCode
      ctx.body = boom.payload
      return
    }
    await next()
  },
  async (ctx, next) => {
    try {
      const post = ctx.request.body
      await PostService.update(post)
      const updatedPost = await PostService.getById(post._id)
      ctx.status = 200
      ctx.body = {
        post: updatedPost
      }
    } catch (error) {
      log.error(`Failed: update posts: ${error}`)
      ctx.status = 500
    }
  })

export default PostController
