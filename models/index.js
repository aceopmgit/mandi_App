const sequelize = require("../util/database"); // Sequelize instance
const Admin = require("./Admin");
const AdminForgetPassword = require("./AdminForgotPassword");
const Company = require("./Company");
const CompanyLocation = require("./CompanyLocation");
const DeliveryCertificate = require("./DeliveryCertificate");
const Depot = require("./Depot");
const DirectTrader = require("./DirectTrader");
const District = require("./District");
const Factory = require("./Factory");
const FactoryLoading = require("./FactoryLoading");
const ForgotPassword = require("./ForgotPassword");
const License = require("./License");
const Mandi = require("./Mandi");
const MasterTarget = require("./MasterTarget");
const PaddyAdvance = require("./PaddyAdvance");
const PaddyLoadingEntry = require("./PaddyLoadingEntry");
const PaddyPurchase = require("./PaddyPurchase");
const PaddyRelease = require("./PaddyRelease");
const PaddyUnloadingEntry = require("./PaddyUnloadingEntry");
const Permission = require("./Permission");
const RiceAcNote = require("./RiceAcNote");
const Role = require("./Role");
const RolePermission = require("./RolePermission");
const State = require("./State");
const Trader = require("./Trader");
const User = require("./User");
const UserFactory = require("./UserFactory");

// Admin relationships
Admin.hasMany(AdminForgetPassword, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});
AdminForgetPassword.belongsTo(Admin, { foreignKey: "userId" });

// License relationships
License.hasMany(Company, { foreignKey: "licenseId" });
Company.belongsTo(License, { foreignKey: "licenseId" });

// Company relationships
Company.hasMany(User, { foreignKey: "companyId", onDelete: "CASCADE" });
User.belongsTo(Company, { foreignKey: "companyId" });

Company.hasMany(Factory, { foreignKey: "companyId", onDelete: "CASCADE" });
Factory.belongsTo(Company, { foreignKey: "companyId" });

Company.hasMany(Trader, { foreignKey: "companyId", onDelete: "CASCADE" });
Trader.belongsTo(Company, { foreignKey: "companyId" });

Company.hasMany(PaddyLoadingEntry, {
  foreignKey: "companyId",
  onDelete: "CASCADE",
});
PaddyLoadingEntry.belongsTo(Company, { foreignKey: "companyId" });

Company.hasMany(MasterTarget, { foreignKey: "companyId", onDelete: "CASCADE" });
MasterTarget.belongsTo(Company, { foreignKey: "companyId" });

// company location relation
Company.hasMany(CompanyLocation, {
  foreignKey: "companyId",
  onDelete: "CASCADE",
});
CompanyLocation.belongsTo(Company, { foreignKey: "companyId" });

// State to UserLocation
State.hasMany(CompanyLocation, { foreignKey: "stateId" });
CompanyLocation.belongsTo(State, { foreignKey: "stateId" });

// District to UserLocation
District.hasMany(CompanyLocation, { foreignKey: "districtId" });
CompanyLocation.belongsTo(District, { foreignKey: "districtId" });

// User relationships
User.hasMany(ForgotPassword, { foreignKey: "userId", onDelete: "CASCADE" });
ForgotPassword.belongsTo(User, { foreignKey: "userId" });

Role.hasMany(User, { foreignKey: "roleId" });
User.belongsTo(Role, { foreignKey: "roleId" });

User.belongsToMany(Factory, { through: UserFactory });
Factory.belongsToMany(User, { through: UserFactory });

// Role-Permission relationships
Role.belongsToMany(Permission, { through: RolePermission });
Permission.belongsToMany(Role, { through: RolePermission });

// State relationships
State.hasMany(District, { foreignKey: "stateId", onDelete: "CASCADE" });
District.belongsTo(State, { foreignKey: "stateId" });

State.hasMany(Factory, { foreignKey: "stateId" });
Factory.belongsTo(State, { foreignKey: "stateId" });

// District relationships
District.hasMany(Mandi, { foreignKey: "districtId", onDelete: "CASCADE" });
Mandi.belongsTo(District, { foreignKey: "districtId" });

District.hasMany(Depot, { foreignKey: "districtId", onDelete: "CASCADE" });
Depot.belongsTo(District, { foreignKey: "districtId" });

// Mandi relationships
Mandi.hasMany(PaddyLoadingEntry, { foreignKey: "mandiId" });
PaddyLoadingEntry.belongsTo(Mandi, { foreignKey: "mandiId" });

Mandi.hasMany(PaddyRelease, { foreignKey: "mandiId" });
PaddyRelease.belongsTo(Mandi, { foreignKey: "mandiId" });

Mandi.hasMany(PaddyPurchase, { foreignKey: "mandiId" });
PaddyPurchase.belongsTo(Mandi, { foreignKey: "mandiId" });

// Factory relationships
Factory.hasMany(DeliveryCertificate, { foreignKey: "factoryId" });
DeliveryCertificate.belongsTo(Factory, { foreignKey: "factoryId" });

Factory.hasMany(PaddyUnloadingEntry, { foreignKey: "factoryId" });
PaddyUnloadingEntry.belongsTo(Factory, { foreignKey: "factoryId" });

Factory.hasMany(RiceAcNote, { foreignKey: "factoryId" });
RiceAcNote.belongsTo(Factory, { foreignKey: "factoryId" });

Factory.hasMany(DirectTrader, { foreignKey: "factoryId" });
DirectTrader.belongsTo(Factory, { foreignKey: "factoryId" });

Factory.hasMany(PaddyAdvance, { foreignKey: "factoryId" });
PaddyAdvance.belongsTo(Factory, { foreignKey: "factoryId" });

Factory.hasMany(PaddyPurchase, { foreignKey: "factoryId" });
PaddyPurchase.belongsTo(Factory, { foreignKey: "factoryId" });

// Trader relationships
Trader.hasMany(PaddyRelease, { foreignKey: "traderId" });
PaddyRelease.belongsTo(Trader, { foreignKey: "traderId" });

Trader.hasMany(PaddyAdvance, { foreignKey: "traderId" });
PaddyAdvance.belongsTo(Trader, { foreignKey: "traderId" });

Trader.hasMany(DirectTrader, { foreignKey: "traderId" });
DirectTrader.belongsTo(Trader, { foreignKey: "traderId" });

// Delivery Certificate relationships
DeliveryCertificate.hasMany(FactoryLoading, { foreignKey: "dcId" });
FactoryLoading.belongsTo(DeliveryCertificate, { foreignKey: "dcId" });

// Export models
module.exports = {
  sequelize,
  Admin,
  Company,
  DeliveryCertificate,
  Depot,
  DirectTrader,
  District,
  Factory,
  FactoryLoading,
  ForgotPassword,
  License,
  Mandi,
  MasterTarget,
  PaddyAdvance,
  PaddyLoadingEntry,
  PaddyPurchase,
  PaddyRelease,
  PaddyUnloadingEntry,
  Permission,
  RiceAcNote,
  Role,
  RolePermission,
  State,
  Trader,
  User,
  UserFactory,
};
