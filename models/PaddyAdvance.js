const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../util/database");
const { v4: uuidv4 } = require("uuid");

const paddyAdvance = sequelize.define("paddy_advance", {
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
  qty_bags: {
    type: Sequelize.DECIMAL(20, 2),
    allowNull: false,
  },
  faq_percentage: {
    type: Sequelize.DECIMAL(20, 2),
    allowNull: false,
  },
  bag_deduction: {
    type: Sequelize.DECIMAL(20, 2),
    allowNull: false,
  },
  nett_qty: {
    type: Sequelize.DECIMAL(20, 2),
    allowNull: false,
  },
  factoryId: {
    type: Sequelize.UUID,
    allowNull: false,
  },
  traderId: {
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

module.exports = paddyAdvance;
