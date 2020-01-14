'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('teams', {
      number: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
      },
      number_short: {
        type: Sequelize.STRING,
      },
      intro: {
        type: Sequelize.STRING,
        defaultValue: "",
      },
      header_media_url: {
        type: Sequelize.STRING,
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('teams');
  }
};