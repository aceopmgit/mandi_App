const { DataTypes } = require("sequelize");
const sequelize = require("../util/database");

const CompanyDistrict = sequelize.define("company_district", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  companyLocationId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "company_locations",
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

module.exports = CompanyDistrict;
