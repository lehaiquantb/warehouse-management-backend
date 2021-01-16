const { StatusCodes } = require('http-status-codes');
const { handleError } = require('../errors/arror-handler');
const CustomError = require('../errors/custom-error');
const Supplier = require('../models/supplier');
const { isNumeric } = require('../helper/check');

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

const getSupplierPagingFilterSorter = async (req, res, next) => {
  const filters = req.body.filters;
  const pagination = req.body.pagination;
  const sorter = req.body.sorter;
  console.log(req.body);
  try {
    let query = Supplier.find();
    let queryCount = Supplier.find();
    if (filters.status != null) {
      query = query.find({ status: filters.status });
      queryCount = queryCount.find({ status: filters.status });
    }

    if (sorter.field == 'name') {
      query =
        sorter.order == 'descend'
          ? query.sort({ name: 'desc' })
          : query.sort({ name: 'asc' });
    }

    if (sorter.field == 'SCode') {
      query =
        sorter.order == 'descend'
          ? query.sort({ SCode: 'desc' })
          : query.sort({ SCode: 'asc' });
    }

    const count = await queryCount.countDocuments().exec();
    query = query
      .skip((pagination.current - 1) * pagination.pageSize)
      .limit(pagination.pageSize);

    const suppliers = await query.exec();
    res.send({ suppliers, count });
  } catch (error) {
    throw new CustomError(
      StatusCodes.BAD_REQUEST,
      'Không thể lọc danh sách nhà cung cấp',
    );
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

const searchSupplier = async (req, res, next) => {
  const q = req.query.q;
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  console.log('q', q, 'page', page, 'limit', limit);
  try {
    let query = Supplier.find();
    let queryCount = Supplier.find();
    if (q) {
      // if (isNumeric(q)) {
      //const t = parseInt(q);
      //query = query.find({ $or: [{ SCode: t }, { $text: { $search: q } }] });
      query = query.find({
        $or: [
          {
            $expr: {
              $regexMatch: {
                input: { $toString: '$SCode' },
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
                input: { $toString: '$SCode' },
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
    const suppliers = await query.exec();

    // const products = await Supplier.find()
    //   .skip((page - 1) * limit)
    //   .limit(limit)
    //   .sort({ SCode: 'asc' })
    //   .populate('category', 'name');
    // const count = await Supplier.countDocuments();
    res.send({ suppliers, count: await queryCount.countDocuments().exec() });
  } catch (error) {
    throw new CustomError(
      StatusCodes.BAD_REQUEST,
      'Không thể tìm kiếm nhà cung cấp',
    );
  }
};

const getSupplierBySCode = async (req, res, next) => {
  try {
    const SCode = req.params['SCode'];
    const supplier = await Supplier.findOne({ SCode: SCode });
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
    const SCode = req.params['SCode'];
    const supplierUpdate = req.body;
    const t = await Supplier.updateOne({ SCode: SCode }, supplierUpdate);
    if (t.nModified == 1) {
      res.send('Cập nhật thành công');
    }
  } catch (error) {
    throw CustomError(
      StatusCodes.BAD_REQUEST,
      'Cập nhật nhà cung cấp thất bại',
    );
  }
};

const deleteSupplier = async (req, res, next) => {
  try {
    const SCode = req.params['SCode'];
    const t = await Supplier.deleteOne({ SCode: SCode });
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
  getSupplierBySCode,
  getSupplierPaging,
  updateSupplier,
  deleteSupplier,
  getSupplierPagingFilterSorter,
  searchSupplier,
};
