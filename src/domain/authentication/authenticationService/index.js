const userRepository = require('../../users/user.Repository');
const UserModel = require('../../users/user.Model');
const userCredentialRepository = require('../../users/userCredential.Repository');
const UserCredentialModel = require('../../users/userCredential.Model');
const authenticationErrors = require('../authentication.Errors');
const facebookService = require('./facebook');
const githubService = require('./github');
const googleService = require('./google');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const signUp = async ({ email, password, firstName, lastName }) => {
  const isSignUp = await userRepository.getUserByEmail(email);
  if (isSignUp) throw Error(authenticationErrors.EMAIL_EXISTS);

  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);

  const userDto = UserModel({ email, firstName, lastName });
  const user = await userRepository.createUser(userDto);

  const userCredentialDto = UserCredentialModel({ UserId: user.id, ExternalType: 'password', ExternalId: hashPassword });
  userCredentialRepository.createUserCredential(userCredentialDto);

  return user;
}

const login = async ({ email, password }) => {
  const user = await userRepository.getUserByEmail(email);
  if (!user) throw Error(authenticationErrors.INVALID_CREDENTIAL);

  const hashedPassword = user.UserCredentials.find(e => e.ExternalType === 'password').ExternalId;
  const isValid = await bcrypt.compare(password, hashedPassword);
  if (!isValid) throw Error(authenticationErrors.INVALID_CREDENTIAL);

  return generateToken({ userId: user.id });
}

const generateToken = (payload) => {
  const token = jwt.sign(payload, process.env.JWT_PRIVATE_KEY, { algorithm: 'RS256' });
  return token;
}

module.exports = {
  facebook: facebookService,
  github: githubService,
  google: googleService,
  signUp,
  login,
  generateToken,
}