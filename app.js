const express = require("express");
const bodyparser = require("body-parser");
const path = require("path");
const fs = require("fs");
const morgan = require("morgan");
require("dotenv").config();
const cookieParser = require("cookie-parser");

// const sequelize = require("./util/database");
// const admin = require("./models/admin");
// const company = require("./models/Company");
// const deliveryCertificate = require("./models/DeliveryCertificate");
// const depot = require("./models/Depot");
// const directTrader = require("./models/DirectTrader");
// const district = require("./models/District");
// const factory = require("./models/Factory");
// const factoryLoading = require("./models/FactoryLoading");
// const fPassword = require("./models/ForgotPassword");
// const license = require("./models/License");
// const mandi = require("./models/Mandi");
// const masterTarget = require("./models/MasterTarget");
// const paddyAdvance = require("./models/PaddyAdvance");
// const paddyLoadingEntry = require("./models/PaddyLoadingEntry");
// const paddyPurchase = require("./models/PaddyPurchase");
// const paddyRelease = require("./models/PaddyRelease");
// const paddyUnloadingEntry = require("./models/PaddyUnloadingEntry");
// const permission = require("./models/Permission");
// const riceAcNote = require("./models/RiceAcNote");
// const role = require("./models/Role");
// const rolePermission = require("./models/RolePermission");
// const state = require("./models/State");
// const trader = require("./models/Trader");
// const user = require("./models/User");
// const userFactory = require("./models/UserFactory");

const app = express();
const { sequelize } = require("./models/index");
const adminRoutes = require("./routes/admin");
const userRoutes = require("./routes/user");
const homeRoutes = require("./routes/home");
const errorRoutes = require("./routes/error");
const indexRoutes = require("./routes/index");
const { globalLimiter } = require("./middlewares/rateLimiters");
const globalErrorHandler = require("./controllers/error").errorHandler;

// const accessLogStream = fs.createWriteStream(
//   path.join(__dirname, "logs", "access.log"),
//   { flags: "a" }
// );

app.use(cookieParser());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
// app.use(morgan("combined", { stream: accessLogStream }));

app.use(express.static(path.join(__dirname, "public")));

// app.use("/", () => {
//   console.log("Code Running successg= fully");
// });

const PORT = 4000;

app.use("/admin", adminRoutes);
app.use("/user", userRoutes);
app.use("/home", homeRoutes);
app.use(indexRoutes);
app.use(errorRoutes);

// // license relation structure
// license.hasMany(company, { foreignKey: "licenseId" });
// company.belongsTo(license, { foreignKey: "licenseId" });

// // company relationship structure
// company.hasMany(user, { foreignKey: "companyId" });
// user.belongsTo(company, { foreignKey: "companyId" });

// // user Relationship Structure

// user.hasMany(fPassword, { foreignKey: "userId" });
// fPassword.belongsTo(user, { foreignKey: "userId" });

// user.hasMany(factory, { foreignKey: "userId" });
// factory.belongsTo(user, { foreignKey: "userId" });

// user.hasMany(trader, { foreignKey: "userId" });
// trader.belongsTo(user, { foreignKey: "userId" });

// user.hasMany(paddyLoadingEntry, { foreignKey: "userId" });
// paddyLoadingEntry.belongsTo(user, { foreignKey: "userId" });

// user.hasMany(masterTarget, { foreignKey: "userId" });
// masterTarget.belongsTo(user, { foreignKey: "userId" });

// //user role relation
// role.hasMany(user, { foreignKey: "roleId" });
// user.belongsTo(role, { foreignKey: "roleId" });

// user.belongsToMany(factory, { through: userFactory });
// factory.belongsToMany(user, { through: userFactory });

// // Role-Permission Association
// role.belongsToMany(permission, { through: rolePermission });
// permission.belongsToMany(role, { through: rolePermission });

// //mandi location Relationship structure
// state.hasMany(district, { foreignKey: "stateId" });
// district.belongsTo(state, { foreignKey: "stateId" });

// district.hasMany(mandi, { foreignKey: "districtId" });
// mandi.belongsTo(district, { foreignKey: "districtId" });

// district.hasMany(depot, { foreignKey: "districtId" });
// depot.belongsTo(district, { foreignKey: "districtId" });

// //trader relation structure
// trader.hasMany(paddyRelease, { foreignKey: "traderId" });
// paddyRelease.belongsTo(trader, { foreignKey: "traderId" });

// trader.hasMany(paddyAdvance, { foreignKey: "traderId" });
// paddyAdvance.belongsTo(trader), { foreignKey: "traderId" };

// trader.hasMany(directTrader, { foreignKey: "traderId" });
// directTrader.belongsTo(trader, { foreignKey: "traderId" });

// // mandi relation structure
// mandi.hasMany(paddyLoadingEntry, { foreignKey: "mandiId" });
// paddyLoadingEntry.belongsTo(mandi, { foreignKey: "mandiId" });

// mandi.hasMany(paddyRelease, { foreignKey: "mandiId" });
// paddyRelease.belongsTo(mandi, { foreignKey: "mandiId" });

// mandi.hasMany(paddyPurchase, { foreignKey: "mandiId" });
// paddyPurchase.belongsTo(mandi, { foreignKey: "mandiId" });

// // factory relationship structure
// factory.hasMany(deliveryCertificate, { foreignKey: "factoryId" });
// deliveryCertificate.belongsTo(factory, { foreignKey: "factoryId" });

// factory.hasMany(paddyUnloadingEntry, { foreignKey: "factoryId" });
// paddyUnloadingEntry.belongsTo(factory, { foreignKey: "factoryId" });

// factory.hasMany(riceAcNote, { foreignKey: "factoryId" });
// riceAcNote.belongsTo(factory, { foreignKey: "factoryId" });

// factory.hasMany(directTrader, { foreignKey: "factoryId" });
// directTrader.belongsTo(factory, { foreignKey: "factoryId" });

// state.hasMany(factory, { foreignKey: "stateId" });
// factory.belongsTo(state, { foreignKey: "stateId" });

// factory.hasMany(paddyAdvance, { foreignKey: "factoryId" });
// paddyAdvance.belongsTo(factory, { foreignKey: "factoryId" });

// factory.hasMany(paddyPurchase, { foreignKey: "factoryId" });
// paddyPurchase.belongsTo(factory, { foreignKey: "factoryId" });

// // dc relationship structure
// deliveryCertificate.hasMany(factoryLoading, { foreignKey: "dcId" });
// factoryLoading.belongsTo(deliveryCertificate, { foreignKey: "dcId" });

app.use(globalLimiter);
app.use(globalErrorHandler);

sequelize
  .sync()
  // .sync({ force: true }) //it syncs our models to the database by creating the appropriate tables and relations if we have them
  // .sync({ alter: true }) //alters the table without deleting the table data
  .then((result) => {
    app.listen(PORT, () => {
      console.log(
        `*********************Port is running at port ${PORT}****************************`
      );
    });
  })
  .catch((err) => {
    console.log(err);
  });
