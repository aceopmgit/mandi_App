const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../util/database");
const { v4: uuidv4 } = require("uuid");

const companyLocation = sequelize.define("company_location", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  companyId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "companies",
      key: "id",
    },
  },
  stateId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "states",
      key: "id",
    },
  },
  districtId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "districts",
      key: "id",
    },
  },
});

module.exports = companyLocation;
