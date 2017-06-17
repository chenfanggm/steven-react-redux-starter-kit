import httpStatus from 'http-status'
import config from '../../config'

module.exports = function () {
  return function (err, req, res, next) {
    if (res.headersSent) {
      return next(err)
    }
    res.status(err.status).json({
      message: err.isPublic ? err.message : httpStatus[err.status],
      stack: config.env === 'development' ? err.stack : {}
    })
  }
}

