const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../util/database");
const { v4: uuidv4 } = require("uuid");

const deliveryCertificate = sequelize.define("delivery_certificate", {
  id: {
    type: Sequelize.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  dcNumber: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  depotName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  qtyQtls: {
    type: Sequelize.DECIMAL(20, 2),
    allowNull: false,
  },
  dcBalance: {
    type: Sequelize.DECIMAL(20, 2),
    allowNull: false,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
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

module.exports = deliveryCertificate;
