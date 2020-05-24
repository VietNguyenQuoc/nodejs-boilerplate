module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: DataTypes.STRING,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
  }, {});

  User.associate = function (models) {
    User.hasMany(models.UserCredential);
  };

  return User;
}