const jwt = require('jsonwebtoken');

const generateToken = (payload, options) => {
  const token = jwt.sign(payload, process.env.JWT_PRIVATE_KEY, { algorithm: 'RS256', ...options });
  return token;
}

module.exports = generateToken;