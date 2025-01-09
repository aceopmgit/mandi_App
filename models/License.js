const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../util/database");
const { v4: uuidv4 } = require("uuid");

const license = sequelize.define("license", {
  id: {
    type: Sequelize.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  maxSubAdmin: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  maxAccounts: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  maxNormalUsers: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  validDuration: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});

module.exports = license;
