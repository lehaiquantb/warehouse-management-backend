const { StatusCodes } = require('http-status-codes');
const { handleError } = require('../errors/arror-handler');
const CustomError = require('../errors/custom-error');
const Receipt = require('../models/receipt');
const Payment = require('../models/payment');
const Product = require('../models/product');
const ProductReceipt = require('../models/product-receipt');
const Supplier = require('../models/supplier');

const createReceipt = async (req, res, next) => {
  let rc = req.body;
  console.log(rc);
  try {
    let payments = [];
    let newReceipt = new Receipt(rc);
    if (rc.paymentList.length > 0) {
      // for (const item of rc.paymentList) {
      //   const newPayment = new Payment(item);
      //   newPayment.receipt = newReceipt;
      //   newReceipt.payments.push(newPayment);
      //   await newPayment.save();
      //   payments.push(newPayment);
      // }

      rc.paymentList.forEach((item) => {
        const newPayment = new Payment(item);
        newPayment.receipt = newReceipt;
        newReceipt.payments.push(newPayment);
        payments.push(newPayment);
        // await newPayment.save();
      });
    }
    const supplier = await Supplier.findById(rc.supplier);
    supplier.receipts.push(newReceipt);
    if (rc.paymentList.length > 0) {
      supplier.paid = rc.paymentList[0].paidMoney;
      supplier.debt = rc.totalMoney - rc.paymentList[0].paidMoney;
    } else supplier.debt = rc.totalMoney;
    // await supplier.save();

    let listProductReceipt = [];
    let listProducts = [];
    for (let item of rc.products) {
      const tpr = {
        createdBy: rc.createdBy,
        modifiedBy: rc.modifiedBy,
        costPrice: item.costPrice,
        quantityPerProduct: item.quantityPerProduct,
        product: item.productId,
        receipt: newReceipt,
      };
      const productReceipt = new ProductReceipt(tpr);
      listProductReceipt.push(productReceipt);
      const product = await Product.findById(item.productId);
      if (item.isChangedCostPrice) {
        product.traceCostPrices.push({ value: item.costPrice });
      }
      if (rc.stockStatus == 'DONE') {
        product.quantity += item.quantityPerProduct;
      }
      product.productReceipts.push(productReceipt);
      listProducts.push(product);
      newReceipt.productReceipts.push(productReceipt);
      // await productReceipt.save();
      // await product.save();
    }

    // rc.products.forEach((item) => {
    //   const tpr = {
    //     createdBy: rc.createdBy,
    //     modifiedBy: rc.modifiedBy,
    //     costPrice: item.costPrice,
    //     quantityPerProduct: item.quantityPerProduct,
    //     product: item.productId,
    //     receipt: newReceipt,
    //   };
    //   const productReceipt = new ProductReceipt(tpr);
    //   listProductReceipt.push(productReceipt);
    //   // const product = await Product.findById(item.productId);
    //   // if (item.isChangedCostPrice) {
    //   //   product.traceCostPrices.push({value:item.costPrice});
    //   // }
    //   //product.productReceipts.push(productReceipt);
    //   newReceipt.productReceipts.push(productReceipt);
    //   //await productReceipt.save();
    //   //await product.save();
    // });

    //  listProductReceipt.map((item)=>await item.save())
    await Promise.all(
      [
        newReceipt,
        ...listProductReceipt,
        ...payments,
        supplier,
        ...listProducts,
      ].map((m) => m.save()),
    );
    res.send({});
  } catch (error) {
    console.log(error.message);
    throw new CustomError(StatusCodes.BAD_REQUEST, 'Tạo đơn nhập kho thất bại');
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

const getReceiptPagingFilterSorter = async (req, res, next) => {
  const filters = req.body.filters;
  const pagination = req.body.pagination;
  const sorter = req.body.sorter;
  console.log(req.body);
  try {
    let query = Receipt.find();
    let queryCount = Receipt.find();
    if (filters.stockStatus != null) {
      query = query.find({ stockStatus: filters.stockStatus });
      queryCount = queryCount.find({ stockStatus: filters.stockStatus });
    }

    if (filters.paymentStatus != null) {
      query = query.find({ paymentStatus: filters.paymentStatus });
      queryCount = queryCount.find({ paymentStatus: filters.paymentStatus });
    }

    if (filters.supplier != null) {
      query = query.find({ supplier: filters.supplier });
      queryCount = queryCount.find({ supplier: filters.supplier });
    }

    if (sorter.field == 'RCode') {
      query =
        sorter.order == 'descend'
          ? query.sort({ RCode: 'desc' })
          : query.sort({ RCode: 'asc' });
    }
    // if (sorter.field == 'supplier') {
    //   query =
    //     sorter.order == 'descend'
    //       ? query.sort({ name: 'desc' })
    //       : query.sort({ name: 'asc' });
    // }
    const count = await queryCount.countDocuments().exec();
    query = query
      .skip((pagination.current - 1) * pagination.pageSize)
      .limit(pagination.pageSize);

    query = query
      .populate('supplier')
      .populate('payments')
      .populate({ path: 'productReceipts', populate: { path: 'product' } });

    // if (sorter.field == 'supplier') {
    //   query =
    //     sorter.order == 'descend'
    //       ? query.populate({
    //           path: 'supplier',
    //           options: { sort: { name: 'desc' } },
    //         })
    //       : query.populate({
    //           path: 'supplier',
    //           options: { sort: { name: 'asc' } },
    //         });
    // }
    const receipts = await query.exec();
    res.send({ receipts, count });
  } catch (error) {
    console.log(error.message);
    throw new CustomError(
      StatusCodes.BAD_REQUEST,
      'Không thể lọc danh sách đơn nhập kho',
    );
  }
};

const getReceiptByRCode = async (req, res, next) => {
  try {
    const RCode = req.params['RCode'];
    const receipts = await Receipt.find({ RCode: RCode })
      .populate('supplier')
      .populate('payments')
      .populate({ path: 'productReceipts', populate: { path: 'product' } });
    res.send(receipts[0]);
  } catch (error) {
    throw new CustomError(StatusCodes.BAD_REQUEST, error.message);
  }
};

const updateReceipt = async (req, res, next) => {
  try {
    //update số lượng sản phẩm nếu stockStatus = DONE,
    //update giá sp
    //update payments, productReceipt,supplier
    //update updateStockStatusAt, updatePaymentStatusAt
    const RCode = req.params['RCode'];
    const newReceipt = req.body;
    const oldReceipts = await Receipt.find({ RCode: RCode });
    const oldReceipt = oldReceipts[0];
    oldReceipt.modifiedBy = newReceipt.modifiedBy;
    oldReceipt.note = newReceipt.note;
    if (
      oldReceipt.stockStatus == 'NOT_YET' &&
      newReceipt.stockStatus == 'DONE'
    ) {
      //
      oldReceipt.updateStockStatusAt = Date.now();
      //update cho product
    }
    if (newReceipt.paymentStatus == 'DONE') {
      oldReceipt.updatePaymentStatusAt = Date.now();
    }
    oldReceipt.paymentStatus = newReceipt.paymentStatus;
    oldReceipt.tags = newReceipt.tags;
    oldReceipt.totalMoney = newReceipt.totalMoney;
    let oldSupplier = await Supplier.findById(oldReceipt.supplier);
    if (oldReceipt.supplier != newReceipt.supplier) {
      oldSupplier.receipts.splice(
        oldSupplier.receipts.indexOf(oldReceipt.supplier),
        1,
      );
      oldReceipt.supplier = newReceipt.supplier;
      //await oldSupplier.save();
    }

    let newPayment;

    if (newReceipt.paymentList.length > 0) {
      newPayment = new Payment(newReceipt.paymentList[0]);
      oldReceipt.payments.push(newPayment);
      newPayment.receipt = oldReceipt;
      oldSupplier.paid += newReceipt.paymentList[0].paidMoney;
      oldSupplier.debt -= newReceipt.paymentList[0].paidMoney;
      await newPayment.save();
    }

    let listProducts = [];
    for (let prId of oldReceipt.productReceipts) {
      //xóa tham chiếu bên product
      const productReceipt = await ProductReceipt.findById(prId);
      const product = await Product.findById(productReceipt.product);
      product.productReceipts.splice(product.productReceipts.indexOf(prId), 1);
      //await product.save();
      listProducts.push(product);
    }

    oldReceipt.productReceipts = []; //Xóa các sản phẩm cũ

    let listProductReceipt = [];
    for (let item of newReceipt.products) {
      const tpr = {
        createdBy: newReceipt.createdBy,
        modifiedBy: newReceipt.modifiedBy,
        costPrice: item.costPrice,
        quantityPerProduct: item.quantityPerProduct,
        product: item.productId,
        receipt: oldReceipt,
      };
      const productReceipt = new ProductReceipt(tpr);
      listProductReceipt.push(productReceipt);
      const product = await Product.findById(item.productId);
      if (item.isChangedCostPrice) {
        product.traceCostPrices.push({ value: item.costPrice });
      }
      if (
        newReceipt.stockStatus == 'DONE' &&
        oldReceipt.stockStatus == 'NOT_YET'
      ) {
        console.log('uppppp');
        product.quantity += item.quantityPerProduct;
      }
      product.productReceipts.push(productReceipt);
      listProducts.push(product);
      oldReceipt.productReceipts.push(productReceipt);
      // await productReceipt.save();
      // await product.save();
    }
    oldReceipt.stockStatus = newReceipt.stockStatus;
    await Promise.all(
      [
        oldReceipt,
        ...listProductReceipt,
        oldSupplier,
        //newPayment,
        ...listProducts,
      ].map((m) => m.save()),
    );
    res.send('Cập nhật thành công');
  } catch (error) {
    console.log(error.message);
    throw new CustomError(
      StatusCodes.BAD_REQUEST,
      'Cập nhật đơn nhập kho thất bại',
    );
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
  getReceiptByRCode,
  getReceiptPaging,
  updateReceipt,
  deleteReceipt,
  getReceiptPagingFilterSorter,
};
