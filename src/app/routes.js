const router = require('express').Router();
const jwtEncodeMiddleware = require('./middlewares/jwtEncode');

router.use('/auth', require('../domain/authentication/authenticationControllers'), jwtEncodeMiddleware);
router.use('/users', require('../domain/users/userControllers'));

module.exports = router;