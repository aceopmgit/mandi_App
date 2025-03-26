const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../util/database");
const { v4: uuidv4 } = require("uuid");

const factoryRiceLoading = sequelize.define("factory_rice_loading", {
  id: {
    type: Sequelize.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  vehicleNumber: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  qtyBags: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  qtyQtls: {
    type: Sequelize.DECIMAL(20, 2),
    allowNull: false,
  },
  dcId: {
    type: Sequelize.UUID,
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
  depotId: {
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

module.exports = factoryRiceLoading;
