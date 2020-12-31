const userRouter = require('./user-route');
const productRouter = require('./product-route');
const supplierRouter = require('./supplier-route');
const receiptRouter = require('./receipt-route');
//Luôn nhớ đặt route theo thứ tự từ dài đến ngắn
const route = (app) => {
  app.use('/users', userRouter);
  app.use('/products', productRouter);
  app.use('/suppliers', supplierRouter);
  app.use('/receipts', receiptRouter);
};

module.exports = route;
