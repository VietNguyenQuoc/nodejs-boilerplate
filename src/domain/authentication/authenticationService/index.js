const userRepository = require('../../users/user.Repository');
const UserModel = require('../../users/user.Model');
const userCredentialRepository = require('../../users/userCredential.Repository');
const UserCredentialModel = require('../../users/userCredential.Model');
const authenticationErrors = require('../authentication.Errors');
const facebookService = require('./facebook');
const githubService = require('./github');
const googleService = require('./google');
const bcrypt = require('bcrypt');
const logger = require('../../../infra/logger');
const sendMail = require('../../../infra/services/mailer');
const generateToken = require('../../../infra/utils/generateToken');
const verifyToken = require('../../../infra/utils/verifyToken');


const signUp = async ({ email, password, firstName, lastName }) => {
  const isSignUp = await userRepository.getUserByEmail(email);
  if (isSignUp) throw Error(authenticationErrors.EMAIL_EXISTS);

  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);
  const verifyToken = generateToken({}, { expiresIn: '30m' });

  const userDto = UserModel({ email, firstName, lastName, confirm: false, verifyToken });
  const user = await userRepository.createUser(userDto);

  sendMail({
    from: '2359Media',
    to: email,
    subject: 'Verification account',
    html: `<p>Click to <a href=${process.env.SERVER_URL}:${process.env.PORT}/auth/verify?code=${verifyToken}>this link</a> to verify account: </p> `
  });

  const userCredentialDto = UserCredentialModel({ UserId: user.id, ExternalType: 'password', ExternalId: hashPassword });
  userCredentialRepository.createUserCredential(userCredentialDto);

  return user;
}

const login = async ({ email, password }) => {
  const user = await userRepository.getUserByEmailWithCredentials(email);
  if (!user) throw Error(authenticationErrors.INVALID_CREDENTIAL);

  const hashedPassword = user.UserCredentials.find(e => e.ExternalType === 'password').ExternalId;
  const isValid = await bcrypt.compare(password, hashedPassword);
  if (!isValid) throw Error(authenticationErrors.INVALID_CREDENTIAL);

  if (!user.confirm) throw Error(authenticationErrors.EMAIL_NOT_VERIFIED);

  return generateToken({ userId: user.id });
}

const verify = async (token) => {
  const user = await userRepository.getUserByToken(token);
  if (!user) throw Error(authenticationErrors.INVALID_VERIFY_CODE);

  try {
    verifyToken(user.verifyToken);
    userRepository.updateUserByEmail(user.email, { confirm: true });
  } catch (e) {
    logger.error(e.message);
    throw Error(authenticationErrors.VERIFY_CODE_EXPIRE);
  }
}

const resendVerifyToken = async email => {
  const user = await userRepository.getUserByEmail(email);
  if (user.confirm) throw Error(authenticationErrors.INVALID_RESEND_VERIFY);

  const verifyToken = generateToken({}, { expiresIn: '30m' });
  userRepository.updateUserByEmail(email, { verifyToken });
  sendMail({
    from: '2359Media',
    to: email,
    subject: 'Verification account',
    html: `<p>Click to <a href=${process.env.SERVER_URL}:${process.env.PORT}/auth/verify?code=${verifyToken}>this link</a> to verify account: </p> `
  });
}

const forgetPassword = async email => {
  const user = await userRepository.getUserByEmail(email);
  if (!user) return;

  const resetPasswordToken = generateToken({}, { expiresIn: '30m' });
  userRepository.updateUserByEmail(email, { resetPasswordToken });
  sendMail({
    from: '2359Media',
    to: email,
    subject: 'Reset password',
    html: `<p>Click to <a href=${process.env.SERVER_URL}:${process.env.PORT}/auth/reset?code=${resetPasswordToken}>this link</a> to reset password</p> `
  });
}

const resetPassword = async ({ token, password, confirmPassword }) => {
  const user = await userRepository.getUserByResetToken(token);
  if (!user) throw Error(authenticationErrors.INVALID_RESET_PASSWORD_TOKEN);

  // Check if the token is expired
  verifyToken(token);
  if (password !== confirmPassword) throw Error(authenticationErrors.INVALID_CONFIRM_PASSWORD);

  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);
  userCredentialRepository.updateUserCredentialPassword(user.id, hashPassword);
}

module.exports = {
  facebook: facebookService,
  github: githubService,
  google: googleService,
  signUp,
  login,
  verify,
  resendVerifyToken,
  forgetPassword,
  resetPassword
}