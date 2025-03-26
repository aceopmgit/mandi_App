const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../util/database");
const { v4: uuidv4 } = require("uuid");

const masterTarget = sequelize.define("master_target", {
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
  mandiId: {
    type: Sequelize.UUID,
    allowNull: false,
    unique: true,
  },
  targetQtls: {
    type: Sequelize.DECIMAL(20, 2),
    allowNull: false,
  },
  liftedQauntity: {
    type: Sequelize.DECIMAL(20, 2),
    allowNull: false,
  },
  targetBalance: {
    type: Sequelize.DECIMAL(20, 2),
    allowNull: false,
  },
  seasonId: {
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

module.exports = masterTarget;
