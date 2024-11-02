const { sign, verify } = require('jsonwebtoken');

function generateToken(payload) {
    const secretKey = process.env.JWT_SECRET || 'testSecretKey';

    return sign(payload, secretKey, {
        expiresIn: '10 days',
    });
}

const validateToken = (req, res, next) => {
    const secretKey = process.env.JWT_SECRET || 'testSecretKey';
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
        return res.status(403).json({ error: 'Unauthorized' });
    }

    try {
        const payload = verify(token, secretKey);
        console.log(payload);
        req.userId = payload.userId;
        req.token = token;
        next();
    } catch (error) {
        res.status(403).json({ error: 'Unauthorized ' });
    }
};

module.exports = { generateToken, validateToken };
