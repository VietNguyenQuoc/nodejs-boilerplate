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

const getUserByEmail = async email => {
  return await User.findOne({
    where: { email },
    include: UserCredential
  });
}

const updateUser = async userDto => {
  await User.update(userDto, {
    where: { id: userDto.userId }
  });
}

const deleteUser = async userId => {
  await User.delete({ where: { id: userId } });
}

const truncateUsers = async () => {
  await sequelize.query('SET GLOBAL FOREIGN_KEY_CHECKS = 0');
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
  updateUser,
  deleteUser,
  truncateUsers,
  findOrCreateUser
};