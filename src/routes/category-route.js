const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/auth');
const asyncMiddleware = require('../middlewares/async');
const categoryController = require('../controllers/category-controller');
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
  '/page/:page/limit/:limit',
  authenticate,
  checkRole('category-get'),
  asyncMiddleware(categoryController.getCategoryPaging),
);
router.get(
  '/:categoryId',
  authenticate,
  checkRole('category-get'),
  asyncMiddleware(categoryController.getCategoryById),
);
router.post(
  '/',
  authenticate,
  checkRole('category-post'),
  asyncMiddleware(categoryController.createCategory),
);
router.delete(
  '/:categoryId',
  authenticate,
  checkRole('category-delete'),
  asyncMiddleware(categoryController.deleteCategory),
);
router.put(
  '/:categoryId',
  authenticate,
  checkRole('category-put'),
  asyncMiddleware(categoryController.updateCategory),
);
module.exports = router;
