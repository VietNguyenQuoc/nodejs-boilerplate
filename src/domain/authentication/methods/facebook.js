const router = require('express').Router();
const authenticationService = require('../authenticationService');


router.get('/', async (_req, res) => {
  const fbLoginUrl = authenticationService.facebook.getRedirectUrl();
  res.redirect(fbLoginUrl);
});

router.get('/callback', async (req, _res, next) => {
  const userPayload = await authenticationService.facebook.handleCallback(req);

  console.log(userPayload)
  next(userPayload);
});

module.exports = router;