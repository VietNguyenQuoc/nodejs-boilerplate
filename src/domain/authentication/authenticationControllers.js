const router = require('express').Router();
const authenticationService = require('./authenticationService');
const userService = require('../users/userService');
const { facebookMethod, githubMethod, googleMethod } = require('./methods');

router.use('/google', googleMethod);
router.use('/facebook', facebookMethod);
router.use('/github', githubMethod);

router.post('/signup', async (req, res, _next) => {
  const { email, password, firstName, lastName } = req.body;

  const isSignup = await authenticationService.isSignUp({ email });
  if (isSignup) return res.status(400).send('Email has already exists');

  const newUser = await authenticationService.registerByEmail({ email, password, firstName, lastName });

  return res.status(200).send('Successfully signup.');
});

router.post('/login', async (req, res, _next) => {
  const { email, password } = req.body;

  const user = await userService.getUserByEmail({ email });
  if (!user) return res.status(400).send('Email or password is incorrect');

  const isPasswordValid = authenticationService.checkPassword({ password, user });
  if (!isPasswordValid) return res.status(400).send('Email or password is incorrect.');

  const token = authenticationService.generateToken({ payload: { email } });

  return res.status(200).json({ token });
})

module.exports = router;