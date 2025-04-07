const { DataTypes } = require("@sequelize/core");

const { sequelize } = require("../db/index");

const UserModel = sequelize.define("user", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
});

module.exports = {
  UserModel,
};
