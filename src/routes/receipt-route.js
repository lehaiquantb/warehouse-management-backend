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
  '/:receiptId',
  authenticate,
  checkRole('receipt-get'),
  asyncMiddleware(receiptController.getReceiptById),
);
router.post(
  '/',
  authenticate,
  checkRole('receipt-post'),
  asyncMiddleware(receiptController.createReceipt),
);
router.delete(
  '/:receiptId',
  authenticate,
  checkRole('receipt-delete'),
  asyncMiddleware(receiptController.deleteReceipt),
);
router.put(
  '/:receiptId',
  authenticate,
  checkRole('receipt-put'),
  asyncMiddleware(receiptController.updateReceipt),
);
module.exports = router;
