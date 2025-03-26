const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../util/database");
const { v4: uuidv4 } = require("uuid");
const { boolean } = require("joi");

const season = sequelize.define("season", {
  id: {
    type: Sequelize.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  seasonName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  startDate: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      is: /^\d{4}-(0[1-9]|1[0-2])$/, // Ensures format YYYY-MM
    },
  },

  endDate: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      is: /^\d{4}-(0[1-9]|1[0-2])$/, // Ensures format YYYY-MM
    },
  },

  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
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

module.exports = season;
