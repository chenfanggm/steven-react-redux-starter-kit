const httpStatus = require('http-status');
const config = require('../../config');


const errorHandler = () => (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  res.status(err.status).json({
    message: err.isPublic ? err.message : httpStatus[err.status],
    stack: config.env === 'development' ? err.stack : {}
  });
};

module.exports = errorHandler;
