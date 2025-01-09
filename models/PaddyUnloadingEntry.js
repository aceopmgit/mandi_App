const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../util/database");
const { v4: uuidv4 } = require("uuid");

const paddyUnloadingEntry = sequelize.define("paddy_unloading_Entry", {
  id: {
    type: Sequelize.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  unloadedQty_qtls: {
    type: Sequelize.DECIMAL(20, 2),
    allowNull: false,
  },
  bagsUnloaded: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  loadingId: {
    type: Sequelize.UUID,
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

module.exports = paddyUnloadingEntry;
