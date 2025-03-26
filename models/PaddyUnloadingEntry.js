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
  mandiName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  vehicleNumber: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  rstNumber: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  gunnyBags: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  ppBags: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  totalBags: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  qtlsGross: {
    type: Sequelize.DECIMAL(20, 2),
    allowNull: false,
  },
  tare: {
    type: Sequelize.DECIMAL(20, 2),
    allowNull: false,
  },
  nettUnloadedQty_qtls: {
    type: Sequelize.DECIMAL(20, 2),
    allowNull: false,
  },
  notes: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  mandiId: {
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
  godownId: {
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

module.exports = paddyUnloadingEntry;
