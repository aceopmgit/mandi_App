const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../util/database");
const { v4: uuidv4 } = require("uuid");

const transitPassEntry = sequelize.define("transit_pass_entry", {
  id: {
    type: Sequelize.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  mandiName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  transitPassNumber: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },

  transitPassBags: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  transitPassQty_qtls: {
    type: Sequelize.DECIMAL(20, 2),
    allowNull: false,
  },
  uploadTPCopy: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  factoryId: {
    type: Sequelize.UUID,
    allowNull: false,
  },

  seasonId: {
    type: Sequelize.UUID,
    allowNull: false,
  },
  mandiId: {
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

module.exports = transitPassEntry;
