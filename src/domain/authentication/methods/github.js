const router = require('express').Router();
const authenticationService = require('../authenticationService');

router.get('/', async (_req, res) => {
  const githubLoginUrl = authenticationService.github.getRedirectUrl();
  res.redirect(githubLoginUrl);
});

router.get('/callback', async (req, _res, next) => {
  const userPayload = await authenticationService.github.handleCallback(req);

  next(userPayload);
});

module.exports = router;

