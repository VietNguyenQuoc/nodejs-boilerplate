'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('UserCredentials', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      UserId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade',
      },
      ExternalType: {
        type: Sequelize.ENUM(['password', 'google', 'facebook', 'github', 'twitter', 'instagram', 'apple']),
        allowNull: false,
      },
      ExternalId: {
        type: Sequelize.STRING,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
    });
  },

  down: (queryInterface, _Sequelize) => {
    return queryInterface.dropTable('UserCredentials');
  }
};
