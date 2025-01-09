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
  dc_number: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  depot_name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  qty_qtls: {
    type: Sequelize.DECIMAL(20, 2),
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

module.exports = deliveryCertificate;
