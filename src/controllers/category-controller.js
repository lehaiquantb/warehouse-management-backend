const { StatusCodes } = require('http-status-codes');
const { handleError } = require('../errors/arror-handler');
const CustomError = require('../errors/custom-error');
const Category = require('../models/category');

const createCategory = async (req, res, next) => {
  let _ct = req.body;
  try {
    const newCategory = new Category(_ct);
    const categorySaved = await newCategory.save();
    res.send(
      await Category.find().select(
        'createdBy modifiedBy name createdAt modifiedAt',
      ),
    );
  } catch (error) {
    let mes = 'Tạo Danh mục thất bại';
    if ((error.name = 'MongoError' && error.code == 11000)) {
      mes = 'Danh mục đã tồn tại';
    }
    throw new CustomError(StatusCodes.BAD_REQUEST, mes);
  }
};

const getCategoryPaging = async (req, res, next) => {
  const page = parseInt(req.params['page']) || 1;
  const limit = parseInt(req.params['limit']) || 20;
  try {
    const categorys = await Category.find()
      .skip((page - 1) * limit)
      .limit(limit);
    res.send(categorys);
  } catch (error) {
    throw new CustomError(
      StatusCodes.BAD_REQUEST,
      'Không thể lấy danh sách danh mục',
    );
  }
};

const getCategoryById = async (req, res, next) => {
  try {
    const id = req.params['categoryId'];
    const category = await Category.findById(id);
    res.send(category);
  } catch (error) {
    throw new CustomError(
      StatusCodes.BAD_REQUEST,
      'Lấy danh mục theo id thất bại',
    );
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const id = req.params['categoryId'];
    const categoryUpdate = req.body;
    const t = await Category.updateOne({ _id: id }, categoryUpdate);
    if (t.nModified == 1) {
      const updatedCategory = await Category.find({ _id: id });
      res.send(updatedCategory);
    }
  } catch (error) {
    throw CustomError(StatusCodes.BAD_REQUEST, 'Cập nhật danh mục thất bại');
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const id = req.params['categoryId'];
    const t = await Category.deleteOne({ _id: id });
    if (t.deletedCount == 1) {
      res.send('Xóa thành công');
    } else
      res.status(StatusCodes.BAD_REQUEST).send('Xóa danh mục không thành công');
  } catch (error) {
    throw new CustomError(StatusCodes.BAD_REQUEST, error.message);
  }
};
module.exports = {
  createCategory,
  getCategoryById,
  getCategoryPaging,
  updateCategory,
  deleteCategory,
};
