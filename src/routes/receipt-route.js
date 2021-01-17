const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/auth');
const asyncMiddleware = require('../middlewares/async');
const receiptController = require('../controllers/receipt-controller');
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
  checkRole('receipt-get'),
  asyncMiddleware(receiptController.getReceiptPaging),
);
router.get(
  '/:RCode',
  authenticate,
  checkRole('receipt-get'),
  asyncMiddleware(receiptController.getReceiptByRCode),
);
router.post(
  '/',
  authenticate,
  checkRole('receipt-post'),
  asyncMiddleware(receiptController.createReceipt),
);
router.delete(
  '/:RCode',
  authenticate,
  checkRole('receipt-delete'),
  asyncMiddleware(receiptController.deleteReceipt),
);
router.put(
  '/:RCode',
  authenticate,
  checkRole('receipt-put'),
  asyncMiddleware(receiptController.updateReceipt),
);
router.post(
  '/pagingFilterAndSorter',
  authenticate,
  checkRole('receipt-get'),
  asyncMiddleware(receiptController.getReceiptPagingFilterSorter),
);
module.exports = router;
