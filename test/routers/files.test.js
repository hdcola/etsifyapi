const request = require('supertest');
const express = require('express');
const appSetup = require('../../appSetup');

jest.mock('../../config/s3config');
const s3 = require('../../config/s3config');

const app = express();
appSetup(app);

const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QiLCJmdWxsX25hbWUiOiJ0ZXN0RnVsbF9uYW1lIiwiZW1haWwiOiJ0ZXN0QG1haWwuY29tIiwiaWF0IjoxNzMwNDcyNDQ1LCJleHAiOjE3MzkxMTI0NDV9.mg-9z1Sd0XMOwRLfUDYcSgaviwq4Eq5iZCCsJhRNvoU';

describe('File Upload API', () => {
    it('should upload a file successfully', async () => {
        s3.upload.mockReturnValue({
            promise: jest.fn().mockResolvedValue({}),
        });

        const response = await request(app)
            .post('/api/files/upload')
            .set('Authorization', `Bearer ${token}`)
            .attach('file', Buffer.from('test file content'), 'testfile.txt');

        expect(response.status).toBe(200);
        expect(response.body.message).toEqual('File uploaded successfully');
        expect(response.body.url).toMatch(
            /https:\/\/.*\.s3.amazonaws.com\/\d+_testfile.txt/
        );
    });

    it('should return 400 if no file is uploaded', async () => {
        const response = await request(app)
            .post('/api/files/upload')
            .set('Authorization', `Bearer ${token}`);

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
            .set('Authorization', `Bearer ${token}`)
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
            .set('Authorization', `Bearer ${token}`)
            .attach('file', Buffer.alloc(1024 * 1024 * 11), 'testfile.txt');

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            status: 'error',
            message: 'File size is too large. Maximum allowed size is 10MB.',
        });
    });
});
