const bcrypt = require('bcrypt');
const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const CustomError = require('../errors/custom-error');
const STATUS_CODE = require('../errors/error-code');

const User = require('../models/user');

const { JWT_SECRET_KEY } = process.env;
const JWT_EXPIRES_TIME_ACCESS_TOKEN = Number.parseInt(
  process.env.JWT_EXPIRES_TIME_ACCESS_TOKEN,
);
const JWT_EXPIRES_TIME_REFRESH_TOKEN = Number.parseInt(
  process.env.JWT_EXPIRES_TIME_REFRESH_TOKEN,
);
const generateAccessToken = async (email) => {
  //console.log('JWT_SECRET_KEY', JWT_SECRET_KEY);
  const accessToken = jwt.sign({ email: email }, JWT_SECRET_KEY, {
    expiresIn: JWT_EXPIRES_TIME_ACCESS_TOKEN,
  });
  return accessToken;
};

const generateRefreshToken = async (email) => {
  const refreshToken = jwt.sign({ email: email }, JWT_SECRET_KEY, {
    expiresIn: JWT_EXPIRES_TIME_REFRESH_TOKEN,
  });
  return refreshToken;
};

// function generateSalt() {
//   return bcrypt.genSaltSync(10);
// }

// const hashSHA512 = async text => {
//   return crypto
//     .createHash('sha512')
//     .update(text)
//     .digest('hex');
// };

// async function hashBcrypt(text, salt) {
//   const hashedBcrypt = new Promise((resolve, reject) => {
//     bcrypt.hash(text, salt, (err, hash) => {
//       if (err) reject(err);
//       resolve(hash);
//     });
//   });
//   return hashedBcrypt;
// }

const compareBcrypt = async (data, hashed) => {
  const isCorrect = await bcrypt.compare(data, hashed);
  return isCorrect;
};

// async function encryptPassword(password, salt) {
//   // Transform the plaintext password to hash value using SHA512
//   const hashedSHA512 = hashSHA512(password);

//   // Hash using bcrypt with a cost of 10 and unique, per-user salt
//   const hashedBcrypt = await hashBcrypt(hashedSHA512, salt);

//   // Encrypt the resulting bcrypt hash with AES256
//   const encryptAES256 = encrypt(hashedBcrypt);

//   const encryptedPassword = encryptAES256;
//   return encryptedPassword;
// }

const login = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user)
    throw new CustomError(StatusCodes.BAD_REQUEST, 'User is not exist.');

  const isCorrectPassword = await compareBcrypt(password, user.password);
  if (!isCorrectPassword)
    throw new CustomError(StatusCodes.UNAUTHORIZED, 'Password is not match');

  const accessToken = await generateAccessToken(email);
  const refreshToken = await generateRefreshToken(email);

  user.refreshTokens = user.refreshTokens.concat(refreshToken);
  user.accessTokens = user.accessTokens.concat(accessToken);

  let promiseLogin = await user.save();
  return { status: !!promiseLogin, accessToken, refreshToken, user };
};

const verifyAccessToken = async (accessToken) => {
  try {
    const payloadAccessToken = await jwt.verify(accessToken, JWT_SECRET_KEY);
    const { email } = payloadAccessToken;
    const user = await User.findOne({ email });
    return {
      isVerified: user.accessTokens.includes(accessToken),
      user: user,
    };
  } catch (err) {
    if (err.name == 'TokenExpiredError') return { isVerified: false };
    throw new CustomError(StatusCodes.UNAUTHORIZED, err.message);
  }
};

const verifyRefreshTokenAndGenAccessToken = async (refreshToken) => {
  try {
    const data = await jwt.verify(refreshToken, JWT_SECRET_KEY);
    let { email } = data;
    const user = await User.findOne({ email });
    if (user.refreshTokens.includes(refreshToken)) {
      const accessToken = await generateAccessToken(email);
      return { user: user, accessToken };
    } else {
      throw new CustomError(StatusCodes.UNAUTHORIZED, 'refreshToken expired !');
    }
  } catch (error) {
    throw new CustomError(
      StatusCodes.UNAUTHORIZED,
      err.message,
      'refreshToken expired !',
    );
  }
};

const verifyAdminAccessToken = async (accessToken) => {
  const data = await jwt.verify(accessToken, JWT_SECRET_KEY);
  const { email } = data;
  const user = await User.findOne({ email }).select('tokens', 'role');
  return {
    status: user.tokens.includes(accessToken) && data.role === 'Admin',
    email: email,
  };
};

const changePass = async (currentPass, newPass, accessToken) => {
  const { Id } = jwt.verify(accessToken, JWT_SECRET_KEY);
  const promiseChangePass = await User.updateOne(
    { Id, password: currentPass },
    { password: newPass },
  );
  return promiseChangePass.nModified;
};

const logout = async (req, res) => {
  const a = req.cookies['x-access-token'];
  const b = req.cookies['x-refresh-token'];
  let accessToken,
    refreshToken,
    accessTokenType,
    refreshTokenType = '';
  try {
    let data;
    if (typeof a == 'string') {
      [accessTokenType, accessToken] = a.split(' ');
      if (accessTokenType == 'Bearer') {
        data = jwt.verify(accessToken, JWT_SECRET_KEY);
      }
    } else if (typeof b == 'string') {
      [refreshTokenType, refreshToken] = b.split(' ');
      if (refreshTokenType == 'Bearer') {
        data = jwt.verify(refreshToken, JWT_SECRET_KEY);
      }
    }
    let { email } = data || req.body;
    const user = await User.findOne({ email });
    const newAccessTokens = user.accessTokens.filter((value) => {
      return value !== accessToken;
    });
    const newRefreshTokens = user.refreshTokens.filter((value) => {
      return value !== refreshToken;
    });
    const updatePromise = await User.updateOne(
      { email },
      { accessTokens: newAccessTokens },
      { refreshTokens: newRefreshTokens },
    );
    return updatePromise;
  } catch (error) {
    throw new CustomError(StatusCodes.BAD_REQUEST, 'Đăng xuất thất bại');
  }
};

module.exports = {
  login,
  verifyAccessToken,
  logout,
  changePass,
  verifyAdminAccessToken,
  verifyRefreshTokenAndGenAccessToken,
};
