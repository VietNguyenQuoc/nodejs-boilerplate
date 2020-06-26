'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Users', 'resetPasswordToken', {
      type: Sequelize.TEXT,
    });
  },

  down: (queryInterface, _Sequelize) => {
    return queryInterface.removeColumn('Users', 'resetPasswordToken');
  }
};
