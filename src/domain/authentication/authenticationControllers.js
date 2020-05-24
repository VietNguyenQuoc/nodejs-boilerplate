const router = require('express').Router();
const authenticationService = require('./authenticationService');
const { facebookMethod, githubMethod, googleMethod } = require('./methods');

router.use('/google', googleMethod);
router.use('/facebook', facebookMethod);
router.use('/github', githubMethod);

router.post('/signup', async (req, res, next) => {
  const { email, password } = req.body;
  const isSignup = await authenticationService.isSignup({ email });
  if (isSignup) return res.status(400).json({ message: 'Email has already existed.' });

})

module.exports = router;