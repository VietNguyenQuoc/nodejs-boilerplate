module.exports = (sequelize, DataTypes) => {
  const UserCredential = sequelize.define('UserCredential', {
    UserId: DataTypes.INTEGER,
    ExternalType: DataTypes.ENUM('password', 'google', 'facebook', 'github', 'twitter', 'instagram', 'apple'),
    ExternalId: DataTypes.STRING,
  }, {});

  UserCredential.associate = function (models) {
    UserCredential.belongsTo(models.User);
  };

  return UserCredential;
}