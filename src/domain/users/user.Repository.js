const { sequelize, User, UserCredential } = require('../../infra/db/sequelize/models');

const createUser = async userDto => {
  return await User.create(userDto);
}

const getUsers = async () => {
  return await User.findAll();
}

const getUserById = async userId => {
  return await User.findByPk(userId);
}

const getUserByEmail = async (email, options) => {
  return await User.findOne({
    where: { email },
    ...options
  });
}

const getUserByEmailWithCredentials = async (email) => {
  return await User.findOne({
    where: { email },
    include: UserCredential
  })
}

const getUserByToken = async token => {
  return await User.findOne({
    where: { verifyToken: token },
  });
}

const getUserByResetToken = async token => {
  return await User.findOne({
    where: { resetPasswordToken: token }
  });
}

const updateUserByEmail = async (email, userDto) => {
  await User.update(userDto, {
    where: { email }
  });
}

const deleteUser = async userId => {
  await User.delete({ where: { id: userId } });
}

const truncateUsers = async () => {
  await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
  await User.truncate();
}

const findOrCreateUser = async ({ email, defaultValues }) => {
  return await User.findCreateFind({
    where: { email },
    defaults: {
      email: email,
      lastName: defaultValues.lastName,
      firstName: defaultValues.firstName,
    }
  });
}

module.exports = {
  createUser,
  getUserById,
  getUsers,
  getUserByEmail,
  getUserByEmailWithCredentials,
  getUserByToken,
  getUserByResetToken,
  updateUserByEmail,
  deleteUser,
  truncateUsers,
  findOrCreateUser
};