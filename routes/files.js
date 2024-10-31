const express = require('express');
const ApiError = require('../utils/api-error');
const router = express.Router();
const multer = require('multer');
const s3 = require('../config/s3config');

// config to use multer with memory storage
const storage = multer.memoryStorage();
// limit file size to 10MB
const upload = multer({ storage, limits: { fileSize: 1024 * 1024 * 10 } });

router.post('/upload', upload.single('file'), async (req, res, next) => {
    if (!req.file) {
        return next(ApiError.badRequest('No file uploaded'));
    }

    const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        // TODO: Change the key to a more meaningful, ie. user id + file name
        Key: `${Date.now()}_${req.file.originalname}`,
        Body: req.file.buffer,
    };

    console.log(params);

    try {
        await s3.upload(params).promise();
        return res.send({ message: 'File uploaded successfully' });
    } catch (error) {
        return next(ApiError.internal('Failed to upload file'));
    }
});

module.exports = router;
