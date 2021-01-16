const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/auth');
const asyncMiddleware = require('../middlewares/async');
const productController = require('../controllers/product-controller');
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
  checkRole('product-get'),
  asyncMiddleware(productController.getProductPaging),
);
router.get(
  '/search',
  authenticate,
  checkRole('product-get'),
  asyncMiddleware(productController.searchProduct),
);
router.get(
  '/img/:PCode',
  authenticate,
  checkRole('product-get'),
  asyncMiddleware(productController.getImageByPCode),
);
router.get(
  '/:PCode',
  authenticate,
  checkRole('product-get'),
  asyncMiddleware(productController.getProductByPCode),
);
router.post(
  '/pagingFilterAndSorter',
  authenticate,
  checkRole('product-get'),
  asyncMiddleware(productController.getProductPagingFilterSorter),
);
router.post(
  '/',
  authenticate,
  checkRole('product-post'),
  asyncMiddleware(productController.createProduct),
);
router.delete(
  '/:PCode',
  authenticate,
  checkRole('product-delete'),
  asyncMiddleware(productController.deleteProduct),
);
router.put(
  '/:PCode',
  authenticate,
  checkRole('product-put'),
  asyncMiddleware(productController.updateProduct),
);
module.exports = router;
