const { sequelize, UserCredential } = require('../../infra/db/sequelize/models');

const createUserCredential = async userCredentialDto => {
  return await UserCredential.create(userCredentialDto);
}

const findOrCreateUserCredential = async ({ externalId, defaultValues: { userId, externalType } }) => {
  return await UserCredential.findCreateFind({
    where: { ExternalId: externalId },
    defaults: {
      UserId: userId,
      ExternalType: externalType,
    }
  });
}

const truncateUserCredentials = async () => {
  // await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
  await UserCredential.truncate();
}

module.exports = {
  createUserCredential,
  findOrCreateUserCredential,
  truncateUserCredentials
}