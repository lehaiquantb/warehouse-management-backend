const { query } = require('express');
const { StatusCodes } = require('http-status-codes');
const { handleError } = require('../errors/arror-handler');
const CustomError = require('../errors/custom-error');
const Product = require('../models/product');
const { isNumeric } = require('../helper/check');

const createProduct = async (req, res, next) => {
  let _pr = req.body;
  try {
    const newProduct = new Product(_pr);
    const productSaved = await newProduct.save();
    res.send(productSaved);
  } catch (error) {
    let mes = 'Tạo sản phẩm thất bại';
    if ((error.name = 'MongoError' && error.code == 11000)) {
      mes = 'Mã PCode bị trùng';
    }
    throw new CustomError(StatusCodes.BAD_REQUEST, mes);
  }
};

const getProductPaging = async (req, res, next) => {
  const page = parseInt(req.params['page']) || 1;
  const limit = parseInt(req.params['limit']) || 20;
  try {
    const products = await Product.find()
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ PCode: 'asc' })
      .populate('category', 'name');
    const count = await Product.countDocuments();
    res.send({ products, count });
  } catch (error) {
    throw new CustomError(
      StatusCodes.BAD_REQUEST,
      'Không thể lấy danh sách sản phẩm',
    );
  }
};

const searchProduct = async (req, res, next) => {
  const q = req.query.q;
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  console.log(q);
  try {
    let query = Product.find();
    let queryCount = Product.find();
    if (q) {
      // if (isNumeric(q)) {
      //const t = parseInt(q);
      query = query.find({
        $or: [
          {
            $expr: {
              $regexMatch: {
                input: { $toString: '$PCode' },
                regex: q,
              },
            },
          },
          {
            $expr: {
              $regexMatch: {
                input: { $toString: '$name' },
                regex: q,
              },
            },
          },
        ],
      });
      queryCount = queryCount.find({
        $or: [
          {
            $expr: {
              $regexMatch: {
                input: { $toString: '$PCode' },
                regex: q,
              },
            },
          },
          {
            $expr: {
              $regexMatch: {
                input: { $toString: '$name' },
                regex: q,
              },
            },
          },
        ],
      });

      // } else {
      //   query = query.find({ $text: { $search: q } });
      //   queryCount = queryCount.find({ $text: { $search: q } });
      // }
    }

    if (page && limit) {
      query = query.skip((page - 1) * limit).limit(limit);
    }
    const products = await query.populate('category', 'name').exec();

    // const products = await Product.find()
    //   .skip((page - 1) * limit)
    //   .limit(limit)
    //   .sort({ PCode: 'asc' })
    //   .populate('category', 'name');
    // const count = await Product.countDocuments();
    res.send({ products, count: await queryCount.countDocuments().exec() });
  } catch (error) {
    console.log(error.message);
    throw new CustomError(
      StatusCodes.BAD_REQUEST,
      'Không thể tìm kiếm sản phẩm',
    );
  }
};

const getProductPagingFilterSorter = async (req, res, next) => {
  const filters = req.body.filters;
  const pagination = req.body.pagination;
  const sorter = req.body.sorter;
  console.log(req.body);
  try {
    let query = Product.find();
    let queryCount = Product.find();
    if (filters.status != null) {
      query = query.find({ status: filters.status });
      queryCount = queryCount.find({ status: filters.status });
    }

    if (filters.category != null) {
      query = query.find({ category: filters.category });
      queryCount = queryCount.find({ category: filters.category });
    }

    if (sorter.field == 'name') {
      query =
        sorter.order == 'descend'
          ? query.sort({ name: 'desc' })
          : query.sort({ name: 'asc' });
    }

    if (sorter.field == 'PCode') {
      query =
        sorter.order == 'descend'
          ? query.sort({ PCode: 'desc' })
          : query.sort({ PCode: 'asc' });
    }

    const count = await queryCount.countDocuments().exec();
    query = query
      .skip((pagination.current - 1) * pagination.pageSize)
      .limit(pagination.pageSize);

    const products = await query.populate('category', 'name').exec();
    res.send({ products, count });
  } catch (error) {
    throw new CustomError(
      StatusCodes.BAD_REQUEST,
      'Không thể lọc danh sách sản phẩm',
    );
  }
};

// const getProductById = async (req, res, next) => {
//   try {
//     const id = req.params['productId'];
//     const product = await Product.findById(id).populate('category', 'name');
//     res.send(product);
//   } catch (error) {
//     throw new CustomError(StatusCodes.BAD_REQUEST, error.message);
//   }
// };

const getProductByPCode = async (req, res, next) => {
  try {
    const PCode = req.params['PCode'];
    const product = await Product.find({ PCode }).populate('category', 'name');
    res.send(product[0]);
  } catch (error) {
    throw new CustomError(StatusCodes.BAD_REQUEST, error.message);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const PCode = req.params['PCode'];
    const productUpdate = req.body;
    const t = await Product.updateOne({ PCode: PCode }, productUpdate);
    if (t.nModified == 1) {
      res.send('Cập nhật thành công');
    }
  } catch (error) {
    throw new CustomError(
      StatusCodes.BAD_REQUEST,
      'Cập nhật sản phẩm thất bại',
    );
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const PCode = req.params['PCode'];
    const t = await Product.deleteOne({ PCode: PCode });
    if (t.deletedCount == 1) {
      res.send('Xóa thành công');
    } else res.status(StatusCodes.BAD_REQUEST).send('Xóa không thành công');
  } catch (error) {
    throw new CustomError(StatusCodes.BAD_REQUEST, 'Xóa không thành công');
  }
};

const getImageByPCode = async (req, res, next) => {
  try {
    const PCode = req.params['PCode'];
    const ts = await Product.find({ PCode: PCode });
    const t = ts[0];
    if (t.image && t.image.length > 0) {
      const im = t.image.split(',')[1];
      const img = Buffer.from(im, 'base64');
      res.writeHead(200, {
        'Content-Type': 'image/png',
        'Content-Length': img.length,
      });
      res.end(img);
    }
  } catch (error) {
    throw new CustomError(
      StatusCodes.BAD_REQUEST,
      'Cập nhật sản phẩm thất bại',
    );
  }
};
module.exports = {
  createProduct,
  getProductPaging,
  updateProduct,
  deleteProduct,
  getProductPagingFilterSorter,
  getProductByPCode,
  getImageByPCode,
  searchProduct,
};
