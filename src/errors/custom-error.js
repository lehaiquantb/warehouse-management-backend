module.exports = class CustomError extends Error {
  constructor(statusCode, message, info) {
    super(message);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CustomError);
    }
    this.statusCode = statusCode;
    this.info = info;
  }
};
