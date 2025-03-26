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

  mandiName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  purchaseQtlsGross: {
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
  faqQtls: {
    type: Sequelize.DECIMAL(20, 2),
    allowNull: false,
  },
  purBags: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  nettPurchaseQtyQtls: {
    type: Sequelize.DECIMAL(20, 2),
    allowNull: false,
  },
  uploadHisab: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  quantityLoaded: {
    type: Sequelize.DECIMAL(20, 2),
    allowNull: false,
    defaultValue: 0,
  },

  seasonId: {
    type: Sequelize.UUID,
    allowNull: false,
  },

  companyId: {
    type: Sequelize.UUID,
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
