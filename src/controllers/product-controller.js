const { StatusCodes } = require('http-status-codes');
const { handleError } = require('../errors/arror-handler');
const CustomError = require('../errors/custom-error');
const Product = require('../models/product');

const createProduct = async (req, res, next) => {
  let _pr = req.body;
  try {
    const newProduct = new Product(_pr);
    const productSaved = await newProduct.save();
    res.send(productSaved);
  } catch (error) {
    handleError(new CustomError(StatusCodes.BAD_REQUEST, error.message), res);
  }
};

const getProductPaging = async (req, res, next) => {
  const page = parseInt(req.params['page']) || 1;
  const limit = parseInt(req.params['limit']) || 20;
  try {
    const products = await Product.find()
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ PCode: 'asc' });
    res.send(products);
  } catch (error) {
    throw new CustomError(
      StatusCodes.BAD_REQUEST,
      'Không thể lấy danh sách sản phẩm',
    );
  }
};

const getProductById = async (req, res, next) => {
  try {
    const id = req.params['productId'];
    const product = await Product.findById(id);
    res.send(product);
  } catch (error) {
    throw new CustomError(StatusCodes.BAD_REQUEST, error.message);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const id = req.params['productId'];
    const productUpdate = req.body;
    const t = await Product.updateOne({ _id: id }, productUpdate);
    if (t.nModified == 1) {
      res.send('Cập nhật thành công');
    }
  } catch (error) {
    throw CustomError(StatusCodes.BAD_REQUEST, 'Cập nhật sản phẩm thất bại');
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const id = req.params['productId'];
    const t = await Product.deleteOne({ _id: id });
    if (t.deletedCount == 1) {
      res.send('Xóa thành công');
    } else res.status(StatusCodes.BAD_REQUEST).send('Xóa không thành công');
  } catch (error) {
    throw new CustomError(StatusCodes.BAD_REQUEST, error.message);
  }
};
module.exports = {
  createProduct,
  getProductById,
  getProductPaging,
  updateProduct,
  deleteProduct,
};
