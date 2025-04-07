const { Sequelize } = require("@sequelize/core");
const { MySqlDialect } = require("@sequelize/mysql");

const sequelize = new Sequelize({
  dialect: MySqlDialect,
  database: "db",
  user: "root",
  password: "root",
  host: "mysql",
  port: 3306,
});

module.exports = {
  sequelize,
};
