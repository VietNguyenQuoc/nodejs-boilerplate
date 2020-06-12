const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) return res.status(400).send("Token is not provided.");

    const decoded = jwt.verify(token, process.env.JWT_PUBLIC_KEY, { algorithms: ['RS256'] });
    req.userInfo = decoded;
    next();
  } catch (e) {
    return res.status(403).send("Not authorized.");
  }
}