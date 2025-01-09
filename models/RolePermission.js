const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../util/database");
const { v4: uuidv4 } = require("uuid");

const RolePermission = sequelize.define("role_permission", {
  id: {
    type: Sequelize.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  roleId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  permissionId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
});

module.exports = RolePermission;
