const { StatusCodes } = require('http-status-codes');
const { handleError } = require('../errors/arror-handler');
const CustomError = require('../errors/custom-error');
const Receipt = require('../models/receipt');

const createReceipt = async (req, res, next) => {
  let _pr = req.body;
  try {
    const newReceipt = new Receipt(_pr);
    const receiptSaved = await newReceipt.save();
    res.send(receiptSaved);
  } catch (error) {
    handleError(new CustomError(StatusCodes.BAD_REQUEST, error.message), res);
  }
};

const getReceiptPaging = async (req, res, next) => {
  const page = parseInt(req.params['page']) || 1;
  const limit = parseInt(req.params['limit']) || 20;
  try {
    const receipts = await Receipt.find()
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ PCode: 'asc' });
    res.send(receipts);
  } catch (error) {
    throw new CustomError(
      StatusCodes.BAD_REQUEST,
      'Không thể lấy danh sách sản phẩm',
    );
  }
};

const getReceiptById = async (req, res, next) => {
  try {
    const id = req.params['receiptId'];
    const receipt = await Receipt.findById(id);
    res.send(receipt);
  } catch (error) {
    throw new CustomError(StatusCodes.BAD_REQUEST, error.message);
  }
};

const updateReceipt = async (req, res, next) => {
  try {
    const id = req.params['receiptId'];
    const receiptUpdate = req.body;
    const t = await Receipt.updateOne({ _id: id }, receiptUpdate);
    if (t.nModified == 1) {
      res.send('Cập nhật thành công');
    }
  } catch (error) {
    throw CustomError(StatusCodes.BAD_REQUEST, 'Cập nhật sản phẩm thất bại');
  }
};

const deleteReceipt = async (req, res, next) => {
  try {
    const id = req.params['receiptId'];
    const t = await Receipt.deleteOne({ _id: id });
    if (t.deletedCount == 1) {
      res.send('Xóa thành công');
    } else res.status(StatusCodes.BAD_REQUEST).send('Xóa không thành công');
  } catch (error) {
    throw new CustomError(StatusCodes.BAD_REQUEST, error.message);
  }
};
module.exports = {
  createReceipt,
  getReceiptById,
  getReceiptPaging,
  updateReceipt,
  deleteReceipt,
};
