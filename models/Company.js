const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../util/database");
const { v4: uuidv4 } = require("uuid");

const company = sequelize.define("company", {
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
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  licenseId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  licenseStartDate: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
    allowNull: false,
  },
  licenseExpiryDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  activeSubAdmin: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  activeAccounts: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  activeNormalUsers: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
});

module.exports = company;
