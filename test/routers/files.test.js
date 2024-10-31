const request = require('supertest');
const express = require('express');
const appSetup = require('../../appSetup');

jest.mock('../../config/s3config');
const s3 = require('../../config/s3config');

const app = express();
appSetup(app);

describe('File Upload API', () => {
    it('should upload a file successfully', async () => {
        s3.upload.mockReturnValue({
            promise: jest.fn().mockResolvedValue({}),
        });

        const response = await request(app)
            .post('/api/files/upload')
            .attach('file', Buffer.from('test file content'), 'testfile.txt');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            message: 'File uploaded successfully',
        });
    });

    it('should return 400 if no file is uploaded', async () => {
        const response = await request(app).post('/api/files/upload');

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            status: 'error',
            message: 'No file uploaded',
        });
    });

    it('should return 500 if file upload fails', async () => {
        s3.upload.mockReturnValue({
            promise: jest.fn().mockRejectedValue(new Error('Upload failed')),
        });

        const response = await request(app)
            .post('/api/files/upload')
            .attach('file', Buffer.from('test file content'), 'testfile.txt');

        expect(response.status).toBe(500);
        expect(response.body).toEqual({
            status: 'error',
            message: 'Failed to upload file',
        });
    });

    it('should return 400 if file size exceeds 10MB', async () => {
        const response = await request(app)
            .post('/api/files/upload')
            .attach('file', Buffer.alloc(1024 * 1024 * 11), 'testfile.txt');

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            status: 'error',
            message: 'File size is too large. Maximum allowed size is 10MB.',
        });
    });
});
