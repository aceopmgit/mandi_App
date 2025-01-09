const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../util/database");
const { v4: uuidv4 } = require("uuid");

const paddyPurchase = sequelize.define("paddy_purchase", {
  id: {
    type: Sequelize.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  purchaseDate: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  mandiName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  qty_qtls: {
    type: Sequelize.DECIMAL(20, 2),
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
  bagWeight: {
    type: Sequelize.DECIMAL(20, 2),
    allowNull: false,
  },
  faq: {
    type: Sequelize.DECIMAL(20, 2),
    allowNull: false,
  },
  purBags: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  nettPurchaseQty_qtls: {
    type: Sequelize.DECIMAL(20, 2),
    allowNull: false,
  },
  uploadHisab: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  factoryId: {
    type: Sequelize.UUID,
    allowNull: false,
  },
  mandiId: {
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

module.exports = paddyPurchase;
