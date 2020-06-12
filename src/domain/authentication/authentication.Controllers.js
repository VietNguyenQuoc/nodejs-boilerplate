const router = require('express').Router();
const authenticationService = require('./authenticationService');
const { facebookMethod, githubMethod, googleMethod } = require('./methods');
const logger = require('../../infra/logger');
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
    return res.status(200).send('Successfully signup.');
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

router.get('/', validateUser, (req, res) => {
  return res.json(req.userInfo);
});


module.exports = router;