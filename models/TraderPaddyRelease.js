const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../util/database");
const { v4: uuidv4 } = require("uuid");

const traderPaddyRelease = sequelize.define("trader_paddy_release", {
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
  mandiName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  releaseQtls: {
    type: Sequelize.DECIMAL(20, 2),
    allowNull: false,
  },
  releaseBags: {
    type: Sequelize.INTEGER,
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

module.exports = traderPaddyRelease;
