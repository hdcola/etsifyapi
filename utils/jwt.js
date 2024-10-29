const jwt = require('jsonwebtoken');

function generateToken(payload) {
  const secretKey = process.env.JWT_SECRET;
  if (!secretKey) {
    throw new Error('JWT_SECRET is not defined');
  }
  const options = {
    expiresIn: '10 days',
  };
  const token = jwt.sign(payload, secretKey, options);
  return token;
}

module.exports = { generateToken };
