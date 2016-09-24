import jwt from 'koa-jwt'
import convert from 'koa-convert'
import config from '../../config'


const authRequired = () => convert(jwt({
  cookie: config.jwt.tokenCookie,
  secret: config.jwt.secret,
  key: 'user'
}))

export default authRequired
