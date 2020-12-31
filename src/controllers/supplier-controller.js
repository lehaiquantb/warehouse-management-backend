const { StatusCodes } = require('http-status-codes');
const { handleError } = require('../errors/arror-handler');
const CustomError = require('../errors/custom-error');
const Product = require('../models/product');
const Supplier = require('../models/supplier');
const createSupplier = async (req, res, next) => {
  let _sp = req.body;
  try {
    const newSupplier = new Supplier(_sp);
    const supplierSaved = await newSupplier.save();
    res.send(supplierSaved);
  } catch (error) {
    let mes = 'Tạo Nhà cung cấp thất bại';
    if (error.name == 'ValidationError') {
      if (error.errors.email) {
        mes = error.errors.email.message;
      } else if (error.errors.phone) {
        mes = error.errors.phone.message;
      } else if (error.errors.status) {
        mes = error.errors.status.message;
      } else if (error.errors.address) {
        mes = error.errors.address.message;
      } else if (error.errors.name) {
        mes = error.errors.name.message;
      }
    } else if ((error.name = 'MongoError' && error.code == 11000)) {
      mes = 'Email đã được tạo bởi nhà cung cấp khác';
    }
    throw new CustomError(StatusCodes.BAD_REQUEST, mes);
  }
};

const getSupplierPaging = async (req, res, next) => {
  const page = parseInt(req.params['page']) || 1;
  const limit = parseInt(req.params['limit']) || 20;
  try {
    const suppliers = await Supplier.find()
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ SCode: 'asc' });
    res.send(suppliers);
  } catch (error) {
    throw new CustomError(
      StatusCodes.BAD_REQUEST,
      'Lấy danh sách nhà cung cấp thất bại',
    );
  }
};

const getSupplierById = async (req, res, next) => {
  try {
    const id = req.params['productId'];
    const supplier = await Supplier.findById(id);
    res.send(supplier);
  } catch (error) {
    throw new CustomError(
      StatusCodes.BAD_REQUEST,
      'Lấy thông tin nhà cung cấp thất bại',
    );
  }
};

const updateSupplier = async (req, res, next) => {
  try {
    const id = req.params['productId'];
    const supplierUpdate = req.body;
    const t = await Supplier.updateOne({ _id: id }, supplierUpdate);
    if (t.nModified == 1) {
      res.send('Cập nhật thành công');
    }
  } catch (error) {
    throw CustomError(StatusCodes.BAD_REQUEST, 'Cập nhật sản phẩm thất bại');
  }
};

const deleteSupplier = async (req, res, next) => {
  try {
    const id = req.params['productId'];
    const t = await Supplier.deleteOne({ _id: id });
    if (t.deletedCount == 1) {
      res.send('Xóa thành công');
    } else
      res.status(StatusCodes.BAD_REQUEST).send('Xóa nhà cung cấp thất bại');
  } catch (error) {
    throw new CustomError(StatusCodes.BAD_REQUEST, error.message);
  }
};
module.exports = {
  createSupplier,
  getSupplierById,
  getSupplierPaging,
  updateSupplier,
  deleteSupplier,
};
