const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/auth');
const asyncMiddleware = require('../middlewares/async');
const userController = require('../controllers/user-controller');
const checkRole = require('../middlewares/checkRole');
/**
 * @swagger
 *
 * /user:
 *   get:
 *     description: get
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: username
 *         description: Username to use for login.
 *         in: body
 *         required: true
 *         type: string
 *       - name: password
 *         description: User's password.
 *         in: body
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: login
 */
router.get(
  '/',
  authenticate,
  checkRole('hello'),
  asyncMiddleware(userController.getProfiles),
);
router.post('/auth', authenticate, asyncMiddleware(userController.auth));
router.post('/logout', asyncMiddleware(userController.logout));
router.post('/create', asyncMiddleware(userController.createUser));
router.post('/login', asyncMiddleware(userController.login));

module.exports = router;
