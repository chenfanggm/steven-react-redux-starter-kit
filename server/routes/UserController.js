import { _log } from '../utils/common'
import Boom from 'boom'
import Router from 'koa-router'
import jwt from 'koa-jwt'
import config from '../../config'
import Constants from '../../config/constants'
import UserResponse from '../entity/UserResponse'
import authRequired from '../middleware/auth-required'
import UserService from '../service/UserService'


const log = _log(__filename)
const UserController = new Router()

/**
 * Is Logged In
 */
UserController.get('/isLoggedIn', async (ctx, next) => {
  const token = ctx.cookies.get(config.jwt.tokenCookie)

  // verify token
  if (token) {
    try {
      const tokenPayload = jwt.verify(token, config.jwt.secret)
      const user = await UserService.getById(tokenPayload.userId)
      ctx.status = 200
      ctx.body = new UserResponse(user)
    } catch (error) {
      log.error(`Failed: check login status: ${error}`)
      const boom = Boom.unauthorized('User does not log in').output
      ctx.status = boom.statusCode
      ctx.body = boom.payload
    }
  } else { // verify refresh token
    const refreshToken = ctx.cookies.get(config.jwt.refreshTokenCookie)
    if (refreshToken) {
      try {
        const decodeRefreshToken = jwt.verify(refreshToken, config.jwt.secret)
        const userId = decodeRefreshToken.userId
        const storedRefreshToken = await UserService.getRefreshToken(userId)
        if (storedRefreshToken == decodeRefreshToken) {
          const newToken = UserService.generateToken(userId)
          const user = await UserService.getById(userId)
          ctx.status = 200
          ctx.body = new UserResponse(user)
          ctx.cookies.set(config.jwt.tokenCookie, newToken, {
            httpOnly: true,
            overwrite: true,
            expires: UserService.getTokenExpireDate()
          })
        } else {
          const boom = Boom.unauthorized('User does not log in').output
          ctx.status = boom.statusCode
          ctx.body = boom.payload
        }
      } catch (error) {
        log.error(`Failed to check user login status : ${error}`)
        const boom = Boom.unauthorized('Failed to check login status').output
        ctx.status = boom.statusCode
        ctx.body = boom.payload
      }
    } else {
      const boom = Boom.unauthorized('User is not logged in').output
      ctx.status = boom.statusCode
      ctx.body = boom.payload
    }
  }
})

/**
 * Register User
 */
UserController.post('/register', async (ctx, next) => {
  const { authPayload } = ctx.request.body
  const authInfo = JSON.parse(new Buffer(authPayload, 'base64').toString("ascii"))
  const { email, password } = authInfo

  try {
    if (await UserService.hasUser(email)) {
      log.error(`Failed: register user: duplicate email for ${email}`)
      const boom = Boom.conflict('Failed to register user.').output
      ctx.status = boom.statusCode
      ctx.body = boom.payload
      return
    } else {
      const user = await UserService.registerUser(email, password)

      if (user) {
        const token = UserService.generateToken(user.id)
        ctx.status = 200
        ctx.body = new UserResponse(user)

        ctx.cookies.set(config.jwt.tokenCookie, token, {
          httpOnly: true,
          overwrite: true
        })
      } else {
        log.error(`Failed: register user: ${error} for user ${email}`)
        const boom = Boom.forbidden('Failed to register user.').output
        ctx.status = boom.statusCode
        ctx.body = boom.payload
      }
    }
  } catch (error) {
    log.error(`Failed: register user: ${error} for user ${email}`)
    const boom = Boom.forbidden('Failed to register user.').output
    ctx.status = boom.statusCode
    ctx.body = boom.payload
  }
})

/**
 * Login
 */
UserController.post('/login', async (ctx, next) => {
  const { authPayload } = ctx.request.body
  const authInfo = JSON.parse(new Buffer(authPayload, 'base64').toString("ascii"))
  const { email, password, rememberMe } = authInfo

  try {
    const { user, token } = await UserService.loginUser(email, password)
    ctx.status = 200
    ctx.body = new UserResponse(user)

    if (rememberMe) {
      const refreshToken = await UserService.updateUserRefreshToken(userId)
      ctx.cookies.set(config.jwt.tokenCookie, token, {
        httpOnly: true,
        overwrite: true,
        expires: UserService.getTokenExpireDate()
      })
      ctx.cookies.set(config.jwt.refreshTokenCookie, refreshToken, {
        httpOnly: true,
        overwrite: true,
        expires: UserService.getRefreshTokenExpireDate()
      })
    } else {
      ctx.cookies.set(config.jwt.tokenCookie, token, {
        httpOnly: true,
        overwrite: true
      })
    }
  } catch (error) {
    log.error(`Failed: login user: ${error} for user ${email}`)
    const boom = Boom.forbidden('Invalid email & password pair.').output
    ctx.status = boom.statusCode
    ctx.body = boom.payload
  }
})

/**
 * Logout
 */
UserController.post('/logout', async (ctx, next) => {

  ctx.cookies.set(config.jwt.tokenCookie, '', {
    httpOnly: true,
    overwrite: true,
    expires: new Date(Date.now() - 1)
  })

  ctx.cookies.set(config.jwt.refreshTokenCookie, '', {
    httpOnly: true,
    overwrite: true,
    expires: new Date(Date.now() - 1)
  })

  ctx.status = 200
  ctx.body = {
    payload: 'Successfully Logout.'
  }
})

/**
 * Update last_read_message_at field
 */
UserController.put('/lastReadMessageAt', authRequired(),
  async (ctx, next) => {
    try {
      const userId = ctx.state.user.userId
      const updatedUser = await UserService.updateLastReadMessageAt(userId)
      ctx.status = 200
      ctx.body = new UserResponse(updatedUser)
    } catch (error) {
      log.error(`Failed: update user lastReadMessageAt: ${error}`)
      ctx.status = 500
    }
  })

/**
 * Update username
 */
UserController.put('/username', authRequired(),
  async (ctx, next) => {
    try {
      const userId = ctx.state.user.userId
      const { username } = ctx.request.body
      if (await UserService.hasUsername(username)) {
        log.error(`Failed: update username: duplicate username for ${username}`)
        const boom = Boom.conflict('Failed to save username.').output
        ctx.status = boom.statusCode
        ctx.body = boom.payload
        return
      }
      const updatedUser = await UserService.updateUsername(userId, username)
      ctx.status = 200
      ctx.body = new UserResponse(updatedUser)
    } catch (error) {
      log.error(`Failed: update user username: ${error}`)
      ctx.status = 500
    }
  })

export default UserController
