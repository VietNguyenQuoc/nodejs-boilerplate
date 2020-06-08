const userRepository = require('../../users/userRepository');
const UserModel = require('../../users/userModel');
const userCredentialRepository = require('../../users/userCredentialRepository');
const UserCredentialModel = require('../../users/userCredentialModel');
const facebookService = require('./facebook');
const githubService = require('./github');
const googleService = require('./google');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const isSignUp = async ({ email }) => {
  const user = await userRepository.getUserByEmail({ email });
  if (!user) return false;
  return true;
}

const registerByEmail = async ({ email, password, firstName, lastName }) => {
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);

  const userDto = UserModel({ email, firstName, lastName });
  const user = await userRepository.createUser({ userDto });

  const userCredentialDto = UserCredentialModel({ UserId: user.id, ExternalType: 'password', ExternalId: hashPassword });
  await userCredentialRepository.createUserCredential({ userCredentialDto });

  return user;
}

const checkPassword = async ({ password, user }) => {
  const hashedPassword = user.UserCredentials.find(e => e.ExternalType === 'password').ExternalId;

  const isValid = await bcrypt.compare(password, hashedPassword);

  return isValid;
}

const generateToken = ({ payload }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET_KEY);
  return token;
}

module.exports = {
  facebook: facebookService,
  github: githubService,
  google: googleService,
  isSignUp,
  registerByEmail,
  checkPassword,
  generateToken,
}