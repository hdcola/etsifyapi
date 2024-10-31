const AWS = require('aws-sdk');

AWS.config.update({
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
    region: process.env.S3_REGIN,
});

// create S3 instance
const s3 = new AWS.S3();

module.exports = s3;
