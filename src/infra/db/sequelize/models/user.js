module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: DataTypes.STRING,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    confirm: DataTypes.BOOLEAN,
    verifyToken: DataTypes.TEXT,
    resetPasswordToken: DataTypes.TEXT,
  }, {});

  User.associate = function (models) {
    User.hasMany(models.UserCredential);
  };

  return User;
}