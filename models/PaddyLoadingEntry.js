const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../util/database");
const { v4: uuidv4 } = require("uuid");

const paddyLoadingEntry = sequelize.define("paddy_loading_Entry", {
  id: {
    type: Sequelize.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  loadingDate: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  mandiName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  transitPassNumber: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  vehicleNumber: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  bagsLoaded: {
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
  uploadVehiclePhoto: {
    type: Sequelize.STRING,
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

module.exports = paddyLoadingEntry;
