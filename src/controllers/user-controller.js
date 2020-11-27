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
    debugger;
    const user = await userService.createUser(req.body);
    res.send({ status: !!user ? 1 : 0, result: user });
  } catch (err) {}
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const { status, accessToken, refreshToken } = await authService.login(
    email,
    password,
  );
  //debugger
  return res
    .cookie('x-access-token', 'Bearer ' + accessToken, {
      httpOnly: true,
      maxAge: 360000000,
    })
    .cookie('x-refresh-token', 'Bearer ' + refreshToken, {
      httpOnly: true,
      maxAge: 60 * 60 * 240,
    })
    .send({ status: status, result: { accessToken, refreshToken }, a: 'a' });
};

module.exports = { getProfiles, createUser, login };
