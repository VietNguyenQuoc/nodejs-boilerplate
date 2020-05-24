const userRepository = require('./userRepository');
const userCredentialRepository = require('./userCredentialRepository');

const createUser = async ({ userDto }) => {
  return await userRepository.createUser({ userDto });
}

const getUsers = async () => {
  return await userRepository.getUsers();
}

const getUserById = async ({ userId }) => {
  return await userRepository.getUserById({ userId });
}

const getUserByEmail = async ({ email }) => {
  return await userRepository.getUserByEmail({ email });
}

const updateUser = async ({ userDto }) => {
  return await userRepository.updateUser({ userDto });
}

const deleteUser = async ({ userId }) => {
  return await userRepository.deleteUser({ userId });
}

const findOrCreateUser = async ({ email, defaultValues }) => {
  return await userRepository.findOrCreateUser({ email, defaultValues });
}

const findOrCreateUserCredential = async ({ externalId, defaultValues }) => {
  return await userCredentialRepository.findOrCreateUserCredential({ externalId, defaultValues });
}

module.exports = {
  createUser,
  getUserById,
  getUserByEmail,
  getUsers,
  updateUser,
  deleteUser,
  findOrCreateUser,
  findOrCreateUserCredential,
};