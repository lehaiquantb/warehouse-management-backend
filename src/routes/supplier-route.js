const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/auth');
const asyncMiddleware = require('../middlewares/async');
const supplierController = require('../controllers/supplier-controller');
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
  checkRole('supplier-get'),
  asyncMiddleware(supplierController.getSupplierPaging),
);
router.get(
  '/search',
  authenticate,
  checkRole('supplier-get'),
  asyncMiddleware(supplierController.searchSupplier),
);
router.get(
  '/:SCode',
  authenticate,
  checkRole('supplier-get'),
  asyncMiddleware(supplierController.getSupplierBySCode),
);
router.post(
  '/',
  authenticate,
  checkRole('supplier-post'),
  asyncMiddleware(supplierController.createSupplier),
);
router.delete(
  '/:SCode',
  authenticate,
  checkRole('supplier-delete'),
  asyncMiddleware(supplierController.deleteSupplier),
);
router.put(
  '/:SCode',
  authenticate,
  checkRole('supplier-put'),
  asyncMiddleware(supplierController.updateSupplier),
);
router.post(
  '/pagingFilterAndSorter',
  authenticate,
  checkRole('supplier-get'),
  asyncMiddleware(supplierController.getSupplierPagingFilterSorter),
);
module.exports = router;
