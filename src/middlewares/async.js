//dam bao catch dc loi trong middleware ma khong can try/catch
const asyncMiddleware = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncMiddleware;
