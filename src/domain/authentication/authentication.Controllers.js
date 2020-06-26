const router = require('express').Router();
const authenticationService = require('./authenticationService');
const { facebookMethod, githubMethod, googleMethod } = require('./methods');
const logger = require('../../infra/logger');
const verifyToken = require('../../infra/utils/verifyToken');
const validateUser = require('../../app/middlewares/validateUser');
const validate = require('../../app/middlewares/validator');
const { signUpRules } = require('../../infra/schemas/Authentication');

router.use('/google', googleMethod);
router.use('/facebook', facebookMethod);
router.use('/github', githubMethod);

router.post('/signup', validate(signUpRules), async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  try {
    await authenticationService.signUp({ email, password, firstName, lastName });
    return res.status(200).send(`We will send you an email to ${email} to confirm the registration.`);
  } catch (e) {
    logger.error(e.stack);
    return res.status(400).send(e.message);
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const token = await authenticationService.login({ email, password });
    return res.status(200).json({ token });
  } catch (e) {
    return res.status(400).send(e.message);
  }
});

router.get('/verify', async (req, res) => {
  const { code } = req.query;
  if (!code) return res.status(400).send("Invalid verification url.");

  await authenticationService.verify(code)
    .then(() => { return res.status(200).send('Your account has been successfully verified.'); })
    .catch(e => { return res.status(404).send(e.message) });
});

router.post('/resend', async (req, res) => {
  const { email } = req.body;
  authenticationService.resendVerifyToken(email)
    .then(() => { return res.status(200).send(`We will send you and email to ${email} to confirm the registration.`) })
    .catch(e => { return res.status(400).send(e.message) });
});

router.post('/forgetPassword', (req, res) => {
  const { email } = req.body;
  authenticationService.forgetPassword(email)
    .then(() => { return res.status(200).send(`If the email ${email} exists in our system, we will send an email to proceed the password recovery.`) })
});

router.get('/reset', (req, res) => {
  const { code } = req.query;
  if (!code) return res.status(400).send("Invalid reset password url.");

  try {
    // Check if the token is expired
    verifyToken(code);
    return res.sendFile(`${__dirname}/statics/resetPassword.html`, () => { });
  } catch (e) {
    console.log(e);
    return res.status(400).send("Reset password token is expired.");
  }
});

router.post('/resetPassword', (req, res) => {
  const { token, password, confirmPassword } = req.body;
  authenticationService.resetPassword({ token, password, confirmPassword })
    .then(() => { return res.status(200).send('Successfully changed the password. Please sign in again.') })
    .catch(e => { return res.status(400).send(e.message) });
})


module.exports = router;