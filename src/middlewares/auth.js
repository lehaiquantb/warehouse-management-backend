const asyncMiddleware = require('./async');
const CustomError = require('../errors/custom-error');
const STATUS_CODE = require('../constants/status-code');
const authService = require('../services/auth-service');
const cookieParser = require('cookie-parser');

const auth = async (req, res, next) => {
  //try {
  console.log('[COOKIES]: ', req.cookies);
  //note
  debugger;
  let refreshTokenType, refreshToken;
  const a = req.cookies['x-access-token'];
  if (!a || typeof a !== 'string')
    throw new CustomError(STATUS_CODE.UNAUTHORIZED);
  const [accessTokenType, accessToken] = a.split(' ');

  const b = req.cookies['x-refresh-token'];
  if (typeof b == 'string') {
    [refreshTokenType, refreshToken] = b.split(' ');
  }
  //const { authorization } = req.headers;
  //if (!authorization) throw new CustomError(STATUS_CODE.UNAUTHORIZED);
  //const [tokenType, accessToken] = authorization.split(' ');
  if (accessTokenType !== 'Bearer')
    throw new CustomError(STATUS_CODE.UNAUTHORIZED, 'Unauthorized !');
  const { isVerified, email } = await authService.verifyAccessToken(
    accessToken,
  );

  if (!isVerified) {
    if (refreshTokenType !== 'Bearer')
      throw new CustomError(STATUS_CODE.UNAUTHORIZED, 'Unauthorized !');
  }
  //} catch (error) {
  next();
  //}
};

module.exports = asyncMiddleware(auth);
