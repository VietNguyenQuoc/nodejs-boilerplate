const userService = require('../../users/userService');
const facebookService = require('./facebook');
const githubService = require('./github');
const googleService = require('./google');

const isSignUp = async email => {
  const user = await userService.getUserByEmail({ email });
  if (!user) return false;
  return true;
}

module.exports = {
  facebook: facebookService,
  github: githubService,
  google: googleService,
  isSignUp,
}