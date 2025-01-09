const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../util/database");
const { v4: uuidv4 } = require("uuid");

const directTrader = sequelize.define("direct_trader", {
  id: {
    type: Sequelize.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  partyName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  inBags: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  gross: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  bagWtInKg: {
    type: Sequelize.DECIMAL(20, 2),
    allowNull: false,
  },
  percent: {
    type: Sequelize.DECIMAL(10, 2),
    allowNull: false,
  },
  specialCuttingInKg: {
    type: Sequelize.DECIMAL(20, 2),
    allowNull: false,
  },
  faq: {
    type: Sequelize.DECIMAL(20, 2),
    allowNull: false,
  },
  nettIn: {
    type: Sequelize.DECIMAL(20, 2),
    allowNull: false,
  },
  traderId: {
    type: Sequelize.UUID,
    allowNull: false,
  },
  factoryId: {
    type: Sequelize.UUID,
    allowNull: false,
  },
  createdBy: {
    type: Sequelize.UUID,
    allowNull: false,
  },
  lastModifiedBy: {
    type: Sequelize.UUID,
    allowNull: false,
  },
});

module.exports = directTrader;

// model name should be like DirectTrader.js
// table name is like direct_trader
