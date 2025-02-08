const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../util/database");
const { v4: uuidv4 } = require("uuid");

const CompanyLocation = sequelize.define("company_location", {
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
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "users",
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
});

module.exports = CompanyLocation;
