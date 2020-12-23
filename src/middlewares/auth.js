const asyncMiddleware = require('./async');
const CustomError = require('../errors/custom-error');
const { StatusCodes, getReasonPhrase } = require('http-status-codes');

const authService = require('../services/auth-service');

const auth = async (req, res, next) => {
  //try {
  console.log('[COOKIES]: ', req.cookies);
  //note
  //debugger
  let isVerified, user;
  const a = req.cookies['x-access-token'];
  if (typeof a == 'string') {
    const [accessTokenType, accessToken] = a.split(' ');
    if (accessTokenType !== 'Bearer')
      throw new CustomError(
        StatusCodes.UNAUTHORIZED,
        'accessToken khong phai jwt!',
      );
    const data = await authService.verifyAccessToken(accessToken);
    isVerified = data.isVerified;
    user = data.user;
  }
  // throw new CustomError(
  //     StatusCodes.UNAUTHORIZED,
  //     'x-access-token khong ton tai!',
  // );

  //const { authorization } = req.headers;
  //if (!authorization) throw new CustomError( StatusCodes.UNAUTHORIZED);
  //const [tokenType, accessToken] = authorization.split(' ');

  if (!isVerified) {
    let refreshTokenType, refreshToken;
    const b = req.cookies['x-refresh-token'];
    if (typeof b == 'string') [refreshTokenType, refreshToken] = b.split(' ');

    if (refreshTokenType !== 'Bearer')
      throw new CustomError(
        StatusCodes.UNAUTHORIZED,
        'refreshToken khong phai jwt!',
      );
    const data = await authService.verifyRefreshTokenAndGenAccessToken(
      refreshToken,
    );
    const accessToken = data.accessToken;
    user = data.user;
    res.cookie('x-access-token', 'Bearer ' + accessToken, {
      httpOnly: true,
      maxAge: 3600000,
    });
  }
  res.locals.user = user;
  //} catch (error) {
  return next();
  //}
};

module.exports = asyncMiddleware(auth);
