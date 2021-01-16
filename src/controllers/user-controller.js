const userService = require('../services/user-service');
const authService = require('../services/auth-service');

const getProfiles = async (req, res, next) => {
  try {
    const { email } = req.body;
    console.log('email', email);
    const user = await userService.getProfiles(email);
    //debugger
    //res.cookie('x_access_token', 'accessToken', { httpOnly: true, maxAge: 3600 }).cookie('x-refresh-token', 'refreshToken', { httpOnly: true, maxAge: 60 * 60 * 24 });
    res.send({ status: !!user ? 1 : 0, result: user });
  } catch (err) {}
};

const createUser = async (req, res) => {
  try {
    const user = await userService.createUser(req.body, req, res);
    res.send(user);
  } catch (err) {
    throw err;
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const { status, accessToken, refreshToken, user } = await authService.login(
    email,
    password,
  );
  //debugger
  return res
    .cookie('x-access-token', 'Bearer ' + accessToken, {
      httpOnly: true,
      maxAge: Number.parseInt(process.env.JWT_EXPIRES_TIME_ACCESS_TOKEN) * 1000,
    })
    .cookie('x-refresh-token', 'Bearer ' + refreshToken, {
      httpOnly: true,
      maxAge:
        Number.parseInt(process.env.JWT_EXPIRES_TIME_REFRESH_TOKEN) * 1000,
    })
    .send({ status: status, result: { accessToken, refreshToken }, user });
};

const auth = async (req, res) => {
  return res.send(res.locals.user);
};

const logout = async (req, res) => {
  try {
    const update = await authService.logout(req, res);
    return res
      .clearCookie('x-access-token')
      .clearCookie('x-refresh-token')
      .send(update);
  } catch (error) {
    throw error;
  }
};

module.exports = { getProfiles, createUser, login, auth, logout };
