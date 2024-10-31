const ApiError = require('../utils/api-error');
const multer = require('multer');

module.exports = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                status: 'error',
                message:
                    'File size is too large. Maximum allowed size is 10MB.',
            });
        }
        return res.status(400).send(`Multer error: ${err.message}`);
    } else if (err instanceof ApiError) {
        if (err.errors) {
            res.status(err.statusCode).json({
                status: 'error',
                message: err.message,
                errors: err.errors,
            });
            return;
        }
        res.status(err.statusCode).json({
            status: 'error',
            message: err.message,
        });
        return;
    }
    console.error(err);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
};
