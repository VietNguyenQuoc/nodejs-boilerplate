const jwt = require('jsonwebtoken');

const verifyToken = token => {
  return jwt.verify(token, process.env.JWT_PUBLIC_KEY, { algorithms: ['RS256'] });
}

module.exports = verifyToken;
