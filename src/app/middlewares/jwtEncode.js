const jwt = require('jsonwebtoken');

module.exports = (payload, _req, res, next) => {
  try {
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '15m' });
    const refreshToken = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '7d' });

    return res.status(200).json({
      accessToken,
      refreshToken
    });
  } catch (e) {
    next(e);
  }
}