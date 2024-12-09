"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addIndex("Users", ["email"], {
      unique: true,
      name: "users_email_unique_index", // This name can be anything, but it's useful for debugging
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex("Users", "users_email_unique_index");
  },
};
