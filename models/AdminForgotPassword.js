const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../util/database");
const { v4: uuidv4 } = require("uuid");

const fPassword = sequelize.define("admin_forgot_password_request", {
  id: {
    type: Sequelize.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },

  userId: {
    type: Sequelize.UUID,
    allowNull: false,
    references: {
      model: "admins",
      key: "id",
    },
  },
  isActive: Sequelize.BOOLEAN,
});

module.exports = fPassword;
