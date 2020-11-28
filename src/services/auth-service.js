const bcrypt = require('bcrypt');
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
    throw new CustomError(STATUS_CODE.USER_NOT_EXISTS, 'User is not exist.');

  const isCorrectPassword = await compareBcrypt(password, user.password);
  if (!isCorrectPassword)
    throw new CustomError(
      STATUS_CODE.PASSWORD_NOT_MATCH,
      'Password is not match',
    );

  const accessToken = await generateAccessToken(email);
  const refreshToken = await generateRefreshToken(email);

  user.refreshTokens = user.refreshTokens.concat(refreshToken);
  user.accessTokens = user.accessTokens.concat(accessToken);

  let promiseLogin = await user.save();
  return { status: !!promiseLogin, accessToken, refreshToken };
};

const verifyAccessToken = async (accessToken) => {
  try {
    const payloadAccessToken = await jwt.verify(accessToken, JWT_SECRET_KEY);
    const { email } = payloadAccessToken;
    const Data = await User.findOne({ email }).select('accessTokens');
    return {
      isVerified: Data.accessTokens.includes(accessToken),
      email: email,
    };
  } catch (err) {
    if (err.name == 'TokenExpiredError') return { isVerified: false };
    throw new CustomError(STATUS_CODE.UNAUTHORIZED, err.message);
  }
};

const verifyRefreshTokenAndGenAccessToken = async (refreshToken) => {
  try {
    const data = await jwt.verify(refreshToken, JWT_SECRET_KEY);
    let { email } = data;
    const Data = await User.findOne({ email }).select('refreshTokens');
    if (Data.refreshTokens.includes(refreshToken)) {
      const accessToken = await generateAccessToken(email);
      return { email, accessToken };
    }
  } catch (error) {
    throw new CustomError(
      STATUS_CODE.UNAUTHORIZED,
      err.message,
      'refreshToken expired !',
    );
  }
};

const verifyAdminAccessToken = async (accessToken) => {
  const data = await jwt.verify(accessToken, JWT_SECRET_KEY);
  const { email } = data;
  const Data = await User.findOne({ email }).select('tokens', 'role');
  return {
    status: Data.tokens.includes(accessToken) && data.role === 'Admin',
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

const logout = async (email, accessToken) => {
  const tokens = await User.findOne({ email }).select('tokens');
  const newTokens = tokens.tokens.filter((value) => {
    return value !== accessToken;
  });
  const updatePromise = await User.updateOne({ email }, { tokens: newTokens });
  return updatePromise.nModified;
};

module.exports = {
  login,
  verifyAccessToken,
  logout,
  changePass,
  verifyAdminAccessToken,
  verifyRefreshTokenAndGenAccessToken,
};
