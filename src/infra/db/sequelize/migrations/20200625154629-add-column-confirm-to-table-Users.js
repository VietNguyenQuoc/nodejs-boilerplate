'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Users', 'confirm', {
      type: Sequelize.BOOLEAN,
      defaultValue: 0
    });
  },

  down: (queryInterface, _Sequelize) => {
    return queryInterface.removeColumn('Users', 'confirm');
  }
};
