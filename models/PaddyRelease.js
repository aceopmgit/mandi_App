const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../util/database");
const { v4: uuidv4 } = require("uuid");

const paddyRelease = sequelize.define("paddy_release", {
  id: {
    type: Sequelize.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  releaseDate: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  traderName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  qty_qtls: {
    type: Sequelize.DECIMAL(20, 2),
    allowNull: false,
  },
  qty_bags: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  mandiId: {
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

module.exports = paddyRelease;
