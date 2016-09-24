
const cacheControlMiddleware = ({ maxAge }) =>
  async (ctx, next) => {
    ctx.cacheControl(maxAge) // no cache
    await next()
  }

export default cacheControlMiddleware
