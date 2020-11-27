const STATUS_CODE = require('../constants/status-code');
const snakecaseKeys = require('snakecase-keys');

function handleError(err, req, res, next) {
  //debugger
  let statusCode = err.code || STATUS_CODE.INTERNAL_SERVER_ERROR;
  let { message } = err;
  switch (statusCode) {
    case STATUS_CODE.BAD_REQUEST:
      message = message || 'Bad Request';
      break;
    case STATUS_CODE.UNAUTHORIZED:
      message = 'Unauthorized';
      break;
    case STATUS_CODE.FORBIDDEN:
      message = 'Forbidden';
      break;
    case STATUS_CODE.NOT_FOUND:
      message = 'Not Found';
      break;
    case STATUS_CODE.TOO_MANY_REQUESTS:
      message = 'Too many requests';
      break;
    default:
      message = message || 'Something went wrong';
      break;
  }
  return res.status(statusCode).send(
    snakecaseKeys(
      statusCode
        ? {
            status: 0,
            statusCode,
            message,
          }
        : {
            status: 0,
            message,
          },
    ),
  );
}

module.exports = handleError;
