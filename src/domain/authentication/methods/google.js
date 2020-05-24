const router = require('express').Router();
const authenticationService = require('../authenticationService');


router.get('/', (_req, res) => {
  const googleLoginUrl = authenticationService.google.getRedirectUrl();

  return res.redirect(googleLoginUrl);
});

router.get('/callback', async (req, _res, next) => {
  const userPayload = await authenticationService.google.handleCallback(req);

  next(userPayload);
});

module.exports = router;