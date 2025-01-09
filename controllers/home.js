const path = require("path");
const { google } = require("googleapis");
const fs = require("fs");
const { format } = require("date-fns");

const sequelize = require("../util/database.js");
const Admin = require("../models/Admin");
const AdminForgetPassword = require("../models/AdminForgotPassword");
const Company = require("../models/Company");
const CompanyLocation = require("../models/CompanyLocation");
const DeliveryCertificate = require("../models/DeliveryCertificate");
const Depot = require("../models/Depot");
const DirectTrader = require("../models/DirectTrader");
const District = require("../models/District");
const Factory = require("../models/Factory");
const FactoryLoading = require("../models/FactoryLoading");
const ForgotPassword = require("../models/ForgotPassword");
const License = require("../models/License");
const Mandi = require("../models/Mandi");
const MasterTarget = require("../models/MasterTarget");
const PaddyAdvance = require("../models/PaddyAdvance");
const PaddyLoadingEntry = require("../models/PaddyLoadingEntry");
const PaddyPurchase = require("../models/PaddyPurchase");
const PaddyRelease = require("../models/PaddyRelease");
const PaddyUnloadingEntry = require("../models/PaddyUnloadingEntry");
const Permission = require("../models/Permission");
const RiceAcNote = require("../models/RiceAcNote");
const Role = require("../models/Role");
const RolePermission = require("../models/RolePermission");
const State = require("../models/State");
const Trader = require("../models/Trader");
const User = require("../models/User");
const UserFactory = require("../models/UserFactory");

// const CompanyLocation = require("../models/CompanyLocation.js");
// const State = require("../models/State.js");
// const District = require("../models/District.js");
// const mandi = require("../models/Mandi.js");
// const trader = require("../models/Trader.js");
// const purchase = require("../models/PaddyPurchase.js");
// const loading = require("../models/PaddyLoadingEntry.js");
// const master = require("../models/MasterTarget.js");
// const directTrader = require("../models/DirectTrader.js");

// error handler imports
const CustomError = require("../util/customError");
const asyncErrorHandler = require("../util/asyncErrorHandler.js");

exports.home = (req, res, next) => {
  res.sendFile(path.join(__dirname, "..", "views", "user", "home.html"));
};

exports.manageAccount = (req, res, next) => {
  res.sendFile(
    path.join(__dirname, "..", "views", "user", "manageAccount.html")
  );
};

exports.viewMenuItemDetails = (req, res, next) => {
  res.sendFile(
    path.join(__dirname, "..", "views", "user", "userViewMenuItem.html")
  );
};

// exports.userInput = (req, res, next) => {
//   res.sendFile(path.join(__dirname, "..", "views", "user", "userInput.html"));
// };

// exports.forms = (req, res, next) => {
//   res.sendFile(path.join(__dirname, "..", "views", "user", "forms.html"));
// };

// exports.report = (req, res, next) => {
//   res.sendFile(path.join(__dirname, "..", "views", "user", "report.html"));
// };

// exports.userInput_getMandi = async (req, res, next) => {
//   try {
//     const details = await mandi.findAll({
//       where: { userId: req.user.id },
//       attributes: ["name"],
//     });
//     // console.log("**************getmandi-userinput", details);
//     res.status(200).json({
//       details: details,
//     });
//   } catch (err) {
//     res.status(500).json({
//       Error: err,
//     });
//     console.log(err);
//   }
// };

// exports.userInput_addMandi = async (req, res, next) => {
//   const t = await sequelize.transaction();
//   try {
//     const { name } = req.body;
//     // console.log("add mandi body", req.body);

//     if (name.trim() === "") {
//       return res.status(400).json({
//         status: false,
//         message: "Bad Parameter. Something is Misssing !",
//       });
//     }

//     const data = await mandi.create(
//       {
//         name: name,
//         userId: req.user.id,
//       },
//       { transaction: t }
//     );

//     await t.commit();

//     res.status(201).json({ message: "Mandi added successfully" });
//   } catch (err) {
//     await t.rollback();
//     res.status(500).json({
//       Error: err,
//     });
//     console.log("add mandi error", err);
//   }
// };

// exports.userInput_getTrader = async (req, res, next) => {
//   try {
//     const details = await trader.findAll({
//       where: { userId: req.user.id },
//       attributes: ["name"],
//     });
//     console.log("**************getTrader-userinput", details);
//     res.status(200).json({
//       details: details,
//     });
//   } catch (err) {
//     res.status(500).json({
//       Error: err,
//     });
//     console.log(err);
//   }
// };

// exports.userInput_addTrader = async (req, res, next) => {
//   const t = await sequelize.transaction();
//   try {
//     const { name } = req.body;

//     if (name.trim() === "") {
//       return res.status(400).json({
//         status: false,
//         message: "Bad Parameter. Something is Misssing !",
//       });
//     }

//     const data = await trader.create(
//       {
//         name: name,
//         userId: req.user.id,
//       },
//       { transaction: t }
//     );

//     await t.commit();

//     res.status(201).json({ message: "Trader added successfully" });
//   } catch (err) {
//     await t.rollback();
//     res.status(500).json({
//       Error: err,
//     });
//     console.log("add trader error", err);
//   }
// };

// exports.forms_addMandiPurchaseData = async (req, res, next) => {
//   const t = await sequelize.transaction();
//   try {
//     const { mandiName, purchaseQuantity, gunnyBags, ppBags, bagWeight, faq } =
//       req.body;

//     console.log("forms_addMandiPurchaseData", req.body);

//     if (
//       mandiName.trim() === "" ||
//       purchaseQuantity.trim() === "" ||
//       +purchaseQuantity < 0 ||
//       gunnyBags.trim() === "" ||
//       +gunnyBags < 0 ||
//       ppBags.trim() === "" ||
//       +ppBags < 0 ||
//       bagWeight.trim() === "" ||
//       +bagWeight < 0 ||
//       faq.trim() === "" ||
//       +faq < 0 ||
//       !req.file
//     ) {
//       return res.status(400).json({
//         status: false,
//         message: "Bad Parameter. Invalid Entry !",
//       });
//     }
//     // Decode the service account key from an environment variable
//     const keyContent = Buffer.from(
//       process.env.GOOGLE_SERVICE_ACCOUNT_KEY,
//       "base64"
//     ).toString("utf-8");

//     const auth = new google.auth.GoogleAuth({
//       credentials: JSON.parse(keyContent),
//       scopes: ["https://www.googleapis.com/auth/drive.file"],
//     });

//     const drive = google.drive({ version: "v3", auth });

//     const filePath = req.file.path;
//     const fileName = req.file.originalname;

//     // Upload to Google Drive
//     const fileMetadata = {
//       name: fileName,
//       parents: ["1XfXjO9pkNDn30gBir8p4R1l1IG9Jnu5-"],
//     };
//     const media = {
//       mimeType: req.file.mimetype,
//       body: fs.createReadStream(filePath),
//     };

//     const driveResponse = await drive.files.create({
//       requestBody: fileMetadata,
//       media: media,
//       fields: "id",
//     });

//     // Get file URL
//     const fileId = driveResponse.data.id;
//     drive.permissions.create({
//       fileId,
//       requestBody: {
//         role: "reader",
//         type: "anyone",
//       },
//     });

//     const fileUrl = `https://drive.google.com/uc?id=${fileId}`;

//     const nettPurchaseQty = +purchaseQuantity - +bagWeight - +faq;
//     const purBags = +gunnyBags + +ppBags;

//     const data = await purchase.create(
//       {
//         mandiName: mandiName,
//         quantity: Number(purchaseQuantity),
//         gunnyBags: gunnyBags,
//         ppBags: ppBags,
//         bagWeight: Number(bagWeight),
//         faq: Number(faq),
//         uploadHisab: fileUrl,
//         purBags: purBags,
//         nettPurchaseQty: Number(nettPurchaseQty),
//         userId: req.user.id,
//       },
//       { transaction: t }
//     );

//     // const details = await purchase.findAll();

//     // console.log("***********fromresponsedata***********", data);
//     // console.log("*************all purchase data***********", details);

//     // Delete the file from local uploads folder
//     fs.unlinkSync(filePath);
//     await t.commit();
//     res.status(201).json({ message: "Form data submitted successfully" });
//   } catch (err) {
//     await t.rollback();
//     res.status(500).json({
//       Error: err,
//     });
//     console.log("add response form error", err);
//   }
// };

// exports.forms_addLoadingFormData = async (req, res, next) => {
//   const t = await sequelize.transaction();
//   try {
//     console.log(req.body);
//     const { mandiName, tpNumber, vehicleNumber, bagsLoaded, tpBags, tpQty } =
//       req.body;

//     if (
//       mandiName.trim() === "" ||
//       tpNumber.trim() === "" ||
//       +tpNumber < 0 ||
//       vehicleNumber.trim() === "" ||
//       bagsLoaded.trim() === "" ||
//       +bagsLoaded < 0 ||
//       tpBags.trim() === "" ||
//       +tpBags < 0 ||
//       tpQty.trim() === "" ||
//       +tpQty < 0 ||
//       !req.file
//     ) {
//       return res.status(400).json({
//         status: false,
//         message: "Bad Parameter. Invalid Entry !",
//       });
//     }
//     // Decode the service account key from an environment variable
//     const keyContent = Buffer.from(
//       process.env.GOOGLE_SERVICE_ACCOUNT_KEY,
//       "base64"
//     ).toString("utf-8");

//     const auth = new google.auth.GoogleAuth({
//       credentials: JSON.parse(keyContent),
//       scopes: ["https://www.googleapis.com/auth/drive.file"],
//     });

//     const drive = google.drive({ version: "v3", auth });

//     const filePath = req.file.path;
//     const fileName = req.file.originalname;

//     // Upload to Google Drive
//     const fileMetadata = {
//       name: fileName,
//       parents: ["17GbbMLU0jmihuG6iNJvAOa0wn-nqCiht"],
//     };
//     const media = {
//       mimeType: req.file.mimetype,
//       body: fs.createReadStream(filePath),
//     };

//     const driveResponse = await drive.files.create({
//       requestBody: fileMetadata,
//       media: media,
//       fields: "id",
//     });

//     // Get file URL
//     const fileId = driveResponse.data.id;
//     drive.permissions.create({
//       fileId,
//       requestBody: {
//         role: "reader",
//         type: "anyone",
//       },
//     });

//     const fileUrl = `https://drive.google.com/uc?id=${fileId}`;

//     const data = await loading.create(
//       {
//         mandiName: mandiName,
//         tpNumber: tpNumber,
//         vehicleNumber: vehicleNumber,
//         bagsLoaded: bagsLoaded,
//         tpBags: tpBags,
//         tpQty: Number(tpQty).toFixed(2),
//         uploadVehiclePhoto: fileUrl,
//         userId: req.user.id,
//       },
//       { transaction: t }
//     );

//     const details = await loading.findAll();

//     console.log("***********fromresponsedata***********", data);
//     console.log("*************all purchase data***********", details);

//     // Delete the file from local uploads folder
//     fs.unlinkSync(filePath);
//     res.status(201).json({ message: "Form data submitted successfully" });
//   } catch (err) {
//     await t.rollback();
//     res.status(500).json({
//       Error: err,
//     });
//     console.log("add response form error", err);
//   }
// };

// exports.forms_addMasterFormData = async (req, res, next) => {
//   const t = await sequelize.transaction();
//   try {
//     console.log(req.body);
//     const { mandiName, targetQtls, liftedQauntity, targetBalance } = req.body;
//     if (
//       mandiName.trim() === "" ||
//       targetQtls.trim() === "" ||
//       targetQtls < 0 ||
//       liftedQauntity.trim() === "" ||
//       liftedQauntity < 0 ||
//       targetBalance.trim() === "" ||
//       targetBalance < 0
//     ) {
//       return res.status(400).json({
//         status: false,
//         message: "Invalid data!",
//       });
//     }
//     const data = await master.create(
//       {
//         mandiName: mandiName,
//         targetQtls: Number(targetQtls),
//         liftedQauntity: Number(liftedQauntity),
//         targetBalance: Number(targetBalance),
//         userId: req.user.id,
//       },
//       { transaction: t }
//     );

//     await t.commit();

//     console.log(data);

//     res.status(201).json({ message: "Master added successfully" });
//   } catch (err) {
//     await t.rollback();
//     res.status(500).json({
//       Error: err,
//     });
//     console.log("add response form error", err);
//   }
// };

// exports.forms_addDirectTraderFormData = async (req, res, next) => {
//   const t = await sequelize.transaction();
//   try {
//     console.log(req.body);
//     const { partyName, inBags, gross, bagWtInKg, percent, specialCuttingInKg } =
//       req.body;
//     if (
//       partyName.trim() === "" ||
//       inBags.trim() === "" ||
//       inBags < 0 ||
//       gross.trim() === "" ||
//       gross < 0 ||
//       bagWtInKg.trim() === "" ||
//       bagWtInKg < 0 ||
//       percent.trim() === "" ||
//       percent < 0 ||
//       specialCuttingInKg.trim() === ""
//     ) {
//       return res.status(400).json({
//         status: false,
//         message: "Invalid data!",
//       });
//     }
//     const faq = ((+gross - +bagWtInKg) * (+percent / 100)).toFixed(2);
//     console.log("********faq*********", faq);
//     const nettIn = +gross - +bagWtInKg - +faq - +specialCuttingInKg;

//     console.log("*******nettIn**********", nettIn);

//     const data = await directTrader.create(
//       {
//         partyName: partyName,
//         inBags: inBags,
//         gross: gross,
//         bagWtInKg: Number(bagWtInKg),
//         percent: Number(percent),
//         specialCuttingInKg: Number(specialCuttingInKg),
//         faq: Number(faq),
//         nettIn: Number(nettIn),
//         userId: req.user.id,
//       },
//       { transaction: t }
//     );

//     await t.commit();

//     console.log(data);

//     res.status(201).json({ message: "Master added successfully" });
//   } catch (err) {
//     await t.rollback();
//     res.status(500).json({
//       Error: err,
//     });
//     console.log("add response form error", err);
//   }
// };

// exports.report_getMasterReport = async (req, res, next) => {
//   try {
//     const details = await master.findAll({
//       where: { userId: req.user.id },
//       attributes: [
//         "mandiName",
//         "targetQtls",
//         "liftedQauntity",
//         "targetBalance",
//         "createdAt",
//       ],
//     });
//     console.log("**************report_getMasterReport", details);
//     res.status(200).json({
//       details: details,
//     });
//   } catch (err) {
//     res.status(500).json({
//       Error: err,
//     });
//     console.log(err);
//   }
// };

// exports.report_getMandiPurchaseReport = async (req, res, next) => {
//   try {
//     const details = await purchase.findAll({
//       where: { userId: req.user.id },
//       attributes: [
//         "createdAt",
//         "mandiName",
//         "quantity",
//         "gunnyBags",
//         "ppBags",
//         "bagWeight",
//         "faq",
//         "purBags",
//         "nettPurchaseQty",
//       ],
//     });
//     console.log("**************report_getMandiPurchaseReport", details);
//     res.status(200).json({
//       details: details,
//     });
//   } catch (err) {
//     res.status(500).json({
//       Error: err,
//     });
//     console.log(err);
//   }
// };

// exports.report_getLoadingReport = async (req, res, next) => {
//   try {
//     const details = await loading.findAll({
//       where: { userId: req.user.id },
//       attributes: [
//         "createdAt",
//         "mandiName",
//         "tpNumber",
//         "vehicleNumber",
//         "bagsLoaded",
//         "tpBags",
//         "tpQty",
//         "uploadVehiclePhoto",
//       ],
//     });
//     console.log("**************report_getLoadingReport", details);
//     res.status(200).json({
//       details: details,
//     });
//   } catch (err) {
//     res.status(500).json({
//       Error: err,
//     });
//     console.log(err);
//   }
// };

// exports.report_getDirectTradersReport = async (req, res, next) => {
//   try {
//     const details = await directTrader.findAll({
//       where: { userId: req.user.id },
//       attributes: [
//         "createdAt",
//         "partyName",
//         "inBags",
//         "gross",
//         "bagWtInKg",
//         "percent",
//         "specialCuttingInKg",
//         "faq",
//         "nettIn",
//       ],
//     });
//     console.log("**************report_getLoadingReport", details);
//     res.status(200).json({
//       details: details,
//     });
//   } catch (err) {
//     res.status(500).json({
//       Error: err,
//     });
//     console.log(err);
//   }
// };

exports.accountInfo = asyncErrorHandler(async (req, res, next) => {
  const details = {
    name: req.user.company.name,
    email: req.user.company.email,
    licenseStartDate: format(
      new Date(req.user.company.licenseStartDate),
      "dd-MM-yyyy HH:mm:ss"
    ),
    licenseExpiryDate: format(
      new Date(req.user.company.licenseExpiryDate),
      "dd-MM-yyyy HH:mm:ss"
    ),
    activeSubAdmin: req.user.company.activeSubAdmin,
    activeAccounts: req.user.company.activeAccounts,
    activeNormalUsers: req.user.company.activeNormalUsers,
    licenseName: req.user.company.license.name,
    maxSubAdmin: req.user.company.license.maxSubAdmin,
    maxAccounts: req.user.company.license.maxAccounts,
    maxNormalUsers: req.user.company.license.maxNormalUsers,
  };
  console.log(details);
  res.status(200).json({
    status: true,
    accountDetails: details,
    message: "Data Fetched Successfully",
  });
});

exports.userStates = asyncErrorHandler(async (req, res, next) => {
  const states = await CompanyLocation.findAll({
    where: {
      companyId: req.user.company.id,
    },
    include: {
      model: State,
      attributes: ["id", "name"],
    },
  });

  res.status(200).json({
    status: true,
    userStates: states,
    message: "Data Fetched Successfully",
  });
});
