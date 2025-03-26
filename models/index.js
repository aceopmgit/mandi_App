const sequelize = require("../util/database"); // Sequelize instance
const Admin = require("./Admin");
const AdminForgetPassword = require("./AdminForgotPassword");
const Company = require("./Company");
const CompanyDistrict = require("./CompanyDistrict");
const CompanyLocation = require("./CompanyLocation");
const DeliveryCertificate = require("./DeliveryCertificate");
const Depot = require("./Depot");
const District = require("./District");
const Factory = require("./Factory");
const FactoryRiceLoading = require("./FactoryRiceLoading");
const ForgotPassword = require("./ForgotPassword");
const Godown = require("./Godown");
const License = require("./License");
const Mandi = require("./Mandi");
const MasterTarget = require("./MasterTarget");
const PaddyLoadingEntry = require("./PaddyLoadingEntry");
const PaddyPurchase = require("./PaddyPurchase");
const PaddyUnloadingEntry = require("./PaddyUnloadingEntry");
const RiceAcNote = require("./RiceAcNote");
const Role = require("./Role");
const Season = require("./Season.js");
const State = require("./State");
const Trader = require("./Trader");
const TraderPaddyRelease = require("../models/TraderPaddyRelease.js");
const TraderPaddyAdvance = require("../models/TraderPaddyAdvance.js");
const TransitPassEntry = require("./TransitPassEntry.js");
const User = require("./User");
const UserFactory = require("./UserFactory");

// Admin → AdminForgetPassword
Admin.hasMany(AdminForgetPassword, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});
AdminForgetPassword.belongsTo(Admin, { foreignKey: "userId" });

// License → Company
License.hasMany(Company, {
  foreignKey: "licenseId",
});
Company.belongsTo(License, { foreignKey: "licenseId" });

// ====================================================
// COMPANY & RELATED MODELS
// ====================================================

// Company relationships

// Company → User
Company.hasMany(User, {
  foreignKey: "companyId",
  onDelete: "CASCADE",
});
User.belongsTo(Company, { foreignKey: "companyId" });

// Company → Factory
Company.hasMany(Factory, {
  foreignKey: "companyId",
  onDelete: "CASCADE",
});
Factory.belongsTo(Company, { foreignKey: "companyId" });

// Company → Season
Company.hasMany(Season, { foreignKey: "companyId", onDelete: "CASCADE" });
Season.belongsTo(Company, { foreignKey: "companyId" });

// Company → Godown
Company.hasMany(Godown, { foreignKey: "companyId", onDelete: "CASCADE" });
Godown.belongsTo(Company, { foreignKey: "companyId" });

// Company → Trader
Company.hasMany(Trader, { foreignKey: "companyId", onDelete: "CASCADE" });
Trader.belongsTo(Company, { foreignKey: "companyId" });

// Company → MasterTarget
Company.hasMany(MasterTarget, { foreignKey: "companyId", onDelete: "CASCADE" });
MasterTarget.belongsTo(Company, { foreignKey: "companyId" });

// Company → PaddyPurchase
Company.hasMany(PaddyPurchase, {
  foreignKey: "companyId",
  onDelete: "CASCADE",
});
PaddyPurchase.belongsTo(Company, { foreignKey: "companyId" });

// Company → PaddyLoadingEntry
Company.hasMany(PaddyLoadingEntry, {
  foreignKey: "companyId",
  onDelete: "CASCADE",
});
PaddyLoadingEntry.belongsTo(Company, { foreignKey: "companyId" });

// Company → TransitPassEntry
Company.hasMany(TransitPassEntry, {
  foreignKey: "companyId",
  onDelete: "CASCADE",
});
TransitPassEntry.belongsTo(Company, { foreignKey: "companyId" });

// Company → PaddyUnloadingEntry
Company.hasMany(PaddyUnloadingEntry, {
  foreignKey: "companyId",
  onDelete: "CASCADE",
});
PaddyUnloadingEntry.belongsTo(Company, { foreignKey: "companyId" });

// Company → TraderPaddyAdvance
Company.hasMany(TraderPaddyAdvance, {
  foreignKey: "companyId",
  onDelete: "CASCADE",
});
TraderPaddyAdvance.belongsTo(Company, { foreignKey: "companyId" });

// Company → TraderPaddyAdvance
Company.hasMany(TraderPaddyRelease, {
  foreignKey: "companyId",
  onDelete: "CASCADE",
});
TraderPaddyRelease.belongsTo(Company, { foreignKey: "companyId" });

// Company → DeliveryCertificate
Company.hasMany(DeliveryCertificate, {
  foreignKey: "companyId",
  onDelete: "CASCADE",
});
DeliveryCertificate.belongsTo(Company, { foreignKey: "companyId" });

// Company → FactoryRiceLoading
Company.hasMany(FactoryRiceLoading, {
  foreignKey: "companyId",
  onDelete: "CASCADE",
});
FactoryRiceLoading.belongsTo(Company, { foreignKey: "companyId" });

// Company →
Company.hasMany(RiceAcNote, {
  foreignKey: "companyId",
  onDelete: "CASCADE",
});
RiceAcNote.belongsTo(Company, { foreignKey: "companyId" });

// Company → CompanyLocation
Company.hasMany(CompanyLocation, {
  foreignKey: "companyId",
  onDelete: "CASCADE",
});
CompanyLocation.belongsTo(Company, { foreignKey: "companyId" });

// ====================================================
// SEASON ASSOCIATIONS
// ===================================================

// Season → MasterTarget
Season.hasMany(MasterTarget, {
  foreignKey: "seasonId",
  onDelete: "CASCADE",
});
MasterTarget.belongsTo(Season, { foreignKey: "seasonId" });

// Season → PaddyPurchase
Season.hasMany(PaddyPurchase, {
  foreignKey: "seasonId",
  onDelete: "CASCADE",
});
PaddyPurchase.belongsTo(Season, { foreignKey: "seasonId" });

// Season → PaddyLoadingEntry
Season.hasMany(PaddyLoadingEntry, {
  foreignKey: "seasonId",
  onDelete: "CASCADE",
});
PaddyLoadingEntry.belongsTo(Season, { foreignKey: "seasonId" });

// Season → TransitPassEntry
Season.hasMany(TransitPassEntry, {
  foreignKey: "seasonId",
  onDelete: "CASCADE",
});
TransitPassEntry.belongsTo(Season, { foreignKey: "seasonId" });

// Season → PaddyUnloadingEntry
Season.hasMany(PaddyUnloadingEntry, {
  foreignKey: "seasonId",
  onDelete: "CASCADE",
});
PaddyUnloadingEntry.belongsTo(Season, { foreignKey: "seasonId" });

// Season → TraderPaddyAdvance
Season.hasMany(TraderPaddyAdvance, {
  foreignKey: "seasonId",
  onDelete: "CASCADE",
});
TraderPaddyAdvance.belongsTo(Season, { foreignKey: "seasonId" });

// Season → TraderPaddyRelease
Season.hasMany(TraderPaddyRelease, {
  foreignKey: "seasonId",
  onDelete: "CASCADE",
});
TraderPaddyRelease.belongsTo(Season, { foreignKey: "seasonId" });

// Season → DeliveryCertificate
Season.hasMany(DeliveryCertificate, {
  foreignKey: "seasonId",
  onDelete: "CASCADE",
});
DeliveryCertificate.belongsTo(Season, { foreignKey: "seasonId" });

// Season → RiceAcNote
Season.hasMany(RiceAcNote, {
  foreignKey: "seasonId",
  onDelete: "CASCADE",
});
RiceAcNote.belongsTo(Season, { foreignKey: "seasonId" });

// Season → FactoryRiceLoading
Season.hasMany(FactoryRiceLoading, {
  foreignKey: "seasonId",
  onDelete: "CASCADE",
});
FactoryRiceLoading.belongsTo(Season, { foreignKey: "seasonId" });

// ====================================================
// User & RELATED MODELS
// ====================================================

// User → CompanyLocation
User.hasMany(CompanyLocation, { foreignKey: "userId" });
CompanyLocation.belongsTo(User, { foreignKey: "userId" });

Role.hasMany(User, { foreignKey: "roleId" });
User.belongsTo(Role, { foreignKey: "roleId" });

User.belongsToMany(Factory, { through: UserFactory });
Factory.belongsToMany(User, { through: UserFactory });

// ====================================================
// Location MODELS
// ====================================================

// State → CompanyLocation
State.hasMany(CompanyLocation, { foreignKey: "stateId" });
CompanyLocation.belongsTo(State, { foreignKey: "stateId" });

// CompanyLocation → CompanyDistrict
CompanyLocation.hasMany(CompanyDistrict, {
  foreignKey: "companyLocationId",
  onDelete: "CASCADE",
});
CompanyDistrict.belongsTo(CompanyLocation, { foreignKey: "companyLocationId" });

// District → CompanyDistrict
District.hasMany(CompanyDistrict, { foreignKey: "districtId" });
CompanyDistrict.belongsTo(District, { foreignKey: "districtId" });

// User relationships
User.hasMany(ForgotPassword, { foreignKey: "userId", onDelete: "CASCADE" });
ForgotPassword.belongsTo(User, { foreignKey: "userId" });

// State relationships
State.hasMany(District, { foreignKey: "stateId", onDelete: "CASCADE" });
District.belongsTo(State, { foreignKey: "stateId" });

State.hasMany(Factory, { foreignKey: "stateId" });
Factory.belongsTo(State, { foreignKey: "stateId" });

State.hasMany(Godown, { foreignKey: "stateId" });
Godown.belongsTo(State, { foreignKey: "stateId" });

// District relationships
District.hasMany(Mandi, { foreignKey: "districtId", onDelete: "CASCADE" });
Mandi.belongsTo(District, { foreignKey: "districtId" });

District.hasMany(Depot, { foreignKey: "districtId", onDelete: "CASCADE" });
Depot.belongsTo(District, { foreignKey: "districtId" });

// ====================================================
// Mandi Related MODELS
// ====================================================

// Mandi relationships
Mandi.hasMany(PaddyPurchase, { foreignKey: "mandiId" });
PaddyPurchase.belongsTo(Mandi, { foreignKey: "mandiId" });

Mandi.hasMany(PaddyLoadingEntry, { foreignKey: "mandiId" });
PaddyLoadingEntry.belongsTo(Mandi, { foreignKey: "mandiId" });

Mandi.hasMany(TransitPassEntry, { foreignKey: "mandiId" });
TransitPassEntry.belongsTo(Mandi, { foreignKey: "mandiId" });

Mandi.hasMany(PaddyLoadingEntry, { foreignKey: "mandiId" });
PaddyLoadingEntry.belongsTo(Mandi, { foreignKey: "mandiId" });

Mandi.hasMany(PaddyUnloadingEntry, { foreignKey: "mandiId" });
PaddyUnloadingEntry.belongsTo(Mandi, { foreignKey: "mandiId" });

Mandi.hasMany(TraderPaddyRelease, { foreignKey: "mandiId" });
TraderPaddyRelease.belongsTo(Mandi, { foreignKey: "mandiId" });

// ====================================================
// Factory Related MODELS
// ====================================================

// Factory relationships
Factory.hasMany(PaddyPurchase, { foreignKey: "factoryId" });
PaddyPurchase.belongsTo(Factory, { foreignKey: "factoryId" });

Factory.hasMany(PaddyLoadingEntry, { foreignKey: "factoryId" });
PaddyLoadingEntry.belongsTo(Factory, { foreignKey: "factoryId" });

Factory.hasMany(TransitPassEntry, { foreignKey: "factoryId" });
TransitPassEntry.belongsTo(Factory, { foreignKey: "factoryId" });

Factory.hasMany(PaddyUnloadingEntry, { foreignKey: "factoryId" });
PaddyUnloadingEntry.belongsTo(Factory, { foreignKey: "factoryId" });

Factory.hasMany(TraderPaddyAdvance, { foreignKey: "factoryId" });
TraderPaddyAdvance.belongsTo(Factory, { foreignKey: "factoryId" });

Factory.hasMany(DeliveryCertificate, { foreignKey: "factoryId" });
DeliveryCertificate.belongsTo(Factory, { foreignKey: "factoryId" });

Factory.hasMany(RiceAcNote, { foreignKey: "factoryId" });
RiceAcNote.belongsTo(Factory, { foreignKey: "factoryId" });

Factory.hasMany(FactoryRiceLoading, { foreignKey: "factoryId" });
FactoryRiceLoading.belongsTo(Factory, { foreignKey: "factoryId" });

// ====================================================
// Godown Related MODELS
// ====================================================

// Godown relationships
Godown.hasMany(PaddyUnloadingEntry, { foreignKey: "godownId" });
PaddyUnloadingEntry.belongsTo(Godown, { foreignKey: "godownId" });

Godown.hasMany(TraderPaddyAdvance, { foreignKey: "godownId" });
TraderPaddyAdvance.belongsTo(Godown, { foreignKey: "godownId" });

// ====================================================
// Trader Related MODELS
// ====================================================

// Trader relationships
Trader.hasMany(TraderPaddyRelease, { foreignKey: "traderId" });
TraderPaddyRelease.belongsTo(Trader, { foreignKey: "traderId" });

Trader.hasMany(TraderPaddyAdvance, { foreignKey: "traderId" });
TraderPaddyAdvance.belongsTo(Trader, { foreignKey: "traderId" });

// ====================================================
// Delivery Certificate relationships
// ====================================================

DeliveryCertificate.hasMany(FactoryRiceLoading, { foreignKey: "dcId" });
FactoryRiceLoading.belongsTo(DeliveryCertificate, { foreignKey: "dcId" });

// ====================================================
// Depot Related Models
// ====================================================
Depot.hasMany(RiceAcNote, { foreignKey: "depotId" });
RiceAcNote.belongsTo(Depot, { foreignKey: "depotId" });

Depot.hasMany(DeliveryCertificate, { foreignKey: "depotId" });
DeliveryCertificate.belongsTo(Depot, { foreignKey: "depotId" });

Depot.hasMany(FactoryRiceLoading, { foreignKey: "depotId" });
FactoryRiceLoading.belongsTo(Depot, { foreignKey: "depotId" });

// Export models
module.exports = {
  sequelize,
  Admin,
  Company,
  DeliveryCertificate,
  Depot,
  District,
  Factory,
  FactoryRiceLoading,
  ForgotPassword,
  License,
  Mandi,
  MasterTarget,
  PaddyLoadingEntry,
  PaddyPurchase,
  PaddyUnloadingEntry,
  RiceAcNote,
  Role,
  State,
  Trader,
  TraderPaddyRelease,
  TraderPaddyAdvance,
  TransitPassEntry,
  User,
  UserFactory,
};

// // paddy purchase and paddy Loading relation
// PaddyPurchase.hasMany(PaddyLoadingEntry, {
//   foreignKey: "paddyPurchaseId",
//   onDelete: "CASCADE",
// });
// PaddyLoadingEntry.belongsTo(PaddyPurchase, { foreignKey: "paddyPurchaseId" });

// // paddy Loading and paddy unloading relation
// PaddyLoadingEntry.hasOne(PaddyUnloadingEntry, {
//   foreignKey: "paddyLoadingId",
//   onDelete: "CASCADE",
// });
// PaddyUnloadingEntry.belongsTo(PaddyLoadingEntry, {
//   foreignKey: "paddyLoadingId",
// });
