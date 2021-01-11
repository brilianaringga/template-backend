const Sequelize = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define(
  "user",
  {
    userName: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: "compositeIndex",
    },
    // attributes
    firstName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    lastName: {
      type: Sequelize.STRING,
    },
    employeeId: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    department: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  {
    // options
  }
);

module.exports = User;
