const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../util/database");
const { v4: uuidv4 } = require("uuid");

const traderPaddyAdvance = sequelize.define("trader_paddy_advance", {
  id: {
    type: Sequelize.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  traderName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  inBags: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  gross: {
    type: Sequelize.DECIMAL(20, 2),
    allowNull: false,
  },
  bagWeightInKg: {
    type: Sequelize.DECIMAL(20, 2),
    allowNull: false,
  },
  faqPercentage: {
    type: Sequelize.DECIMAL(20, 2),
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
  seasonId: {
    type: Sequelize.UUID,
    allowNull: false,
  },
  factoryId: {
    type: Sequelize.UUID,
    allowNull: false,
  },
  godownId: {
    type: Sequelize.UUID,
    allowNull: false,
  },
  traderId: {
    type: Sequelize.UUID,
    allowNull: false,
  },
  companyId: {
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

module.exports = traderPaddyAdvance;
