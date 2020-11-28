const { StatusCodes, getReasonPhrase } = require('http-status-codes');
const snakecaseKeys = require('snakecase-keys');

function handleError(err, req, res, next) {
  //debugger;
  let statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  let { message, info } = err || '';
  // switch (statusCode) {
  //   case STATUS_CODE.BAD_REQUEST:
  //     messageCode = messageCode || 'Bad Request';
  //     break;
  //   case STATUS_CODE.UNAUTHORIZED:
  //     messageCode = 'Unauthorized';
  //     break;
  //   case STATUS_CODE.FORBIDDEN:
  //     messageCode = 'Forbidden';
  //     break;
  //   case STATUS_CODE.NOT_FOUND:
  //     messageCode = 'Not Found';
  //     break;
  //   case STATUS_CODE.TOO_MANY_REQUESTS:
  //     messageCode = 'Too many requests';
  //     break;
  //   default:
  //     messageCode = messageCode || 'Something went wrong';
  //     break;
  // }
  return res.status(statusCode).send(
    snakecaseKeys(
      statusCode
        ? {
            statusCode,
            reasonPhrase: getReasonPhrase(statusCode),
            message,
            info,
          }
        : {
            statusCode,
            message: 'Loi khong xac dinh',
            stack: err.stack,
          },
    ),
  );
}

module.exports = handleError;
