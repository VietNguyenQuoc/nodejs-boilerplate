const { User, UserCredential } = require('../../infra/db/sequelize/models');

const createUser = async ({ userDto }) => {
  const user = await User.create(userDto);
  return user;
}

const getUsers = async () => {
  const users = await User.findAll();
  return users;
}

const getUserById = async ({ userId }) => {
  const user = await User.findByPk(userId);
  return user;
}

const getUserByEmail = async ({ email }) => {
  const user = await User.findOne({
    where: { email },
    include: UserCredential
  });
  return user;
}

const updateUser = async ({ userDto }) => {
  await User.update(userDto, {
    where: { id: userDto.userId }
  });
}

const deleteUser = async ({ userId }) => {
  await User.delete({ where: { id: userId } });
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
  findOrCreateUser
};