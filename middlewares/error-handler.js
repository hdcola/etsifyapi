const ApiError = require('../utils/api-error');

module.exports = (err, req, res, next) => {
  if (err instanceof ApiError) {
    if (err.errors) {
      res
        .status(err.statusCode)
        .json({ status: 'error', message: err.message, errors: err.errors });
      return;
    }
    res.status(err.statusCode).json({ status: 'error', message: err.message });
    return;
  }
  console.error(err);
  res.status(500).json({ status: 'error', message: 'Internal Server Error' });
};
