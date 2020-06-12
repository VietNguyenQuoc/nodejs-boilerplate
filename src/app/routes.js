const router = require('express').Router();
const jwtEncodeMiddleware = require('./middlewares/jwtEncode');

router.use('/auth', require('../domain/authentication/authentication.Controllers'), jwtEncodeMiddleware);
router.use('/users', require('../domain/users/user.Controllers'));

module.exports = router;