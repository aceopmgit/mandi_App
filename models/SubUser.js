const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../util/database");
const { v4: uuidv4 } = require("uuid");

const subUser = sequelize.define("sub-user", {
  id: {
    type: Sequelize.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  Name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  Email: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
  },
  Phone: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
  },
  Password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  factoryId: {
    type: Sequelize.UUID,
    allowNull: false,
  },
  roleType: {
    type: Sequelize.UUID,
    allowNull: false,
  },
  roleId: {
    type: Sequelize.UUID,
    allowNull: false,
  },
  userId: {
    type: Sequelize.UUID,
    allowNull: false,
  },
});

module.exports = subUser;
