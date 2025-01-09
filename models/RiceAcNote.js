const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../util/database");
const { v4: uuidv4 } = require("uuid");

const riceAcNote = sequelize.define("rice_Ac_Note", {
  id: {
    type: Sequelize.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  acNoteNumber: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  depotName: {
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
  note: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  depotId: {
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

module.exports = riceAcNote;
