const express = require("express");
const multer = require("multer");

// Multer middleware for handling file uploads
const upload = multer({ dest: "public/uploads/" });
const authorize = require("../middlewares/rolePermissions").authorize;

const adminController = require("../controllers/admin");
const homeController = require("../controllers/home");
const userAuthenticate = require("../middlewares/Authenticate").authenticate;

const router = express.Router();

// admin side data
router.get(
  "/get-states/:Id?",
  userAuthenticate,
  authorize(),
  adminController.getStates
);

router.get(
  "/get-districts",
  userAuthenticate,
  authorize(),
  adminController.getDistricts
);

router.get("/", homeController.home);
router.get("/manage-account", homeController.manageAccount);

router.get("/manage-user", homeController.manageUser);

router.get("/details", homeController.viewMenuItemDetails);

router.get(
  "/manage-account/account-info",
  userAuthenticate,
  homeController.accountInfo
);

router.get(
  "/manage-account/company-location",
  userAuthenticate,
  authorize(),
  homeController.companyLocation
);

router.post(
  "/manage-account/update-company-location",
  userAuthenticate,
  authorize(),
  homeController.updateCompanyLocation
);

router.delete(
  "/manage-account/delete-company-location/:companyLocationId",
  userAuthenticate,
  authorize(),
  homeController.deleteCompanyLocation
);

router.get(
  "/manage-account/company-factory",
  userAuthenticate,
  authorize(),
  homeController.companyFactory
);

router.post(
  "/manage-account/add-factory",
  userAuthenticate,
  authorize(),
  homeController.addFactory
);

router.post(
  "/manage-account/update-factory",
  userAuthenticate,
  authorize(),
  homeController.updateFactory
);

router.delete(
  "/manage-account/delete-factory/:companyFactoryId",
  userAuthenticate,
  authorize(),
  homeController.deleteFactory
);

router.get(
  "/manage-account/company-season",
  userAuthenticate,
  authorize(),
  homeController.companySeason
);

router.post(
  "/manage-account/add-season",
  userAuthenticate,
  authorize(),
  homeController.addSeason
);

router.get(
  "/manage-account/company-godown",
  userAuthenticate,
  authorize(),
  homeController.companyGodown
);

router.post(
  "/manage-account/add-godown",
  userAuthenticate,
  authorize(),
  homeController.addGodown
);

router.post(
  "/manage-account/update-godown",
  userAuthenticate,
  authorize(),
  homeController.updateGodown
);

router.delete(
  "/manage-account/delete-godown/:companyGodownId",
  userAuthenticate,
  authorize(),
  homeController.deleteGodown
);

router.get(
  "/manage-account/company-trader",
  userAuthenticate,
  authorize(),
  homeController.companyTrader
);

router.post(
  "/manage-account/add-Trader",
  userAuthenticate,
  authorize(),
  homeController.addTrader
);

router.post(
  "/manage-account/update-trader",
  userAuthenticate,
  authorize(),
  homeController.updateTrader
);

router.delete(
  "/manage-account/delete-trader/:companyTraderId",
  userAuthenticate,
  authorize(),
  homeController.deleteTrader
);

router.get(
  "/manage-user/company-user",
  userAuthenticate,
  authorize(),
  homeController.companyUser
);

router.get(
  "/manage-user/user-roles",
  userAuthenticate,
  authorize(),
  adminController.getRoles
);

router.post(
  "/manage-user/add-user",
  userAuthenticate,
  authorize(),
  homeController.addUser
);

router.post(
  "/manage-user/update-user",
  userAuthenticate,
  authorize(),
  homeController.updateUser
);

router.post(
  "/manage-user/update-user-password",
  userAuthenticate,
  authorize(),
  homeController.updateUserPassword
);

router.post(
  "/manage-user/freeze-user",
  userAuthenticate,
  authorize(),
  homeController.freezeUser
);

router.post(
  "/manage-user/active-user",
  userAuthenticate,
  authorize(),
  homeController.activeUser
);

router.get("/profile", homeController.profile);

router.get(
  "/profile-info",
  userAuthenticate,
  authorize(),
  homeController.profileInfo
);

router.post(
  "/profile/reset-password",
  userAuthenticate,
  authorize(),
  homeController.profileResetPassword
);

router.get("/paddy-management", homeController.paddyManagement);

router.get(
  "/company-mandi",
  userAuthenticate,
  authorize(),
  homeController.companyMandi
);

router.get(
  "/company-depot",
  userAuthenticate,
  authorize(),
  homeController.companyDepot
);

router.get(
  "/company-factory",
  userAuthenticate,
  authorize(),
  homeController.showcompanyFactory
);

router.get(
  "/paddy-management/master-target",
  userAuthenticate,
  authorize(),
  homeController.masterTarget
);

router.post(
  "/paddy-management/add-master-target",
  userAuthenticate,
  authorize(),
  homeController.addMasterTarget
);

router.post(
  "/paddy-management/update-master-target",
  userAuthenticate,
  authorize(),
  homeController.updateMasterTarget
);

router.post(
  "/paddy-management/add-paddy-purchase",
  userAuthenticate,
  authorize(),
  upload.single("uploadHisab"),
  homeController.addPaddyPurchase
);

router.get(
  "/paddy-management/paddy-purchase",
  userAuthenticate,
  authorize(),
  homeController.paddyPurchase
);

router.post(
  "/paddy-management/update-paddy-purchase",
  userAuthenticate,
  authorize(),
  upload.single("uploadHisab"),
  homeController.updatePaddyPurchase
);

router.post(
  "/paddy-management/add-paddy-loading",
  userAuthenticate,
  authorize(),
  // upload.fields([{ name: "uploadTPCopy" }, { name: "uploadVehiclePhoto" }]),
  homeController.addPaddyLoading
);

router.get(
  "/paddy-management/paddy-loading",
  userAuthenticate,
  authorize(),
  homeController.paddyLoading
);

router.post(
  "/paddy-management/update-paddy-loading",
  userAuthenticate,
  authorize(),
  upload.fields([{ name: "uploadTPCopy" }, { name: "uploadVehiclePhoto" }]),
  homeController.updatePaddyLoading
);

router.post(
  "/paddy-management/add-transit-pass-entry",
  userAuthenticate,
  authorize(),
  upload.single("uploadTPCopy"),
  homeController.addTransitPassEntry
);

router.get(
  "/paddy-management/transit-pass-entry",
  userAuthenticate,
  authorize(),
  homeController.transitPassEntry
);

router.post(
  "/paddy-management/update-transit-pass-entry",
  userAuthenticate,
  authorize(),
  upload.single("uploadTPCopy"),
  homeController.updateTransitPassEntry
);

router.get(
  "/paddy-management/paddy-unloading",
  userAuthenticate,
  authorize(),
  homeController.paddyUnloading
);

router.post(
  "/paddy-management/add-paddy-unloading",
  userAuthenticate,
  authorize(),
  homeController.addPaddyUnloading
);

router.post(
  "/paddy-management/update-paddy-unloading",
  userAuthenticate,
  authorize(),
  homeController.updatePaddyUnloading
);

router.get("/trader-management", homeController.traderManagement);

router.get(
  "/trader-management/trader-paddy-advance",
  userAuthenticate,
  authorize(),
  homeController.traderPaddyAdvance
);

router.post(
  "/trader-management/add-trader-paddy-advance",
  userAuthenticate,
  authorize(),
  homeController.addTraderPaddyAdvance
);

router.post(
  "/trader-management/update-trader-paddy-advance",
  userAuthenticate,
  authorize(),
  homeController.updateTraderPaddyAdvance
);

router.get(
  "/trader-management/trader-paddy-release",
  userAuthenticate,
  authorize(),
  homeController.traderPaddyRelease
);

router.post(
  "/trader-management/add-trader-paddy-release",
  userAuthenticate,
  authorize(),
  homeController.addTraderPaddyRelease
);

router.post(
  "/trader-management/update-trader-paddy-release",
  userAuthenticate,
  authorize(),
  homeController.updateTraderPaddyRelease
);

router.get("/rice-management", homeController.riceManagement);

router.get(
  "/rice-management/delivery-certificate",
  userAuthenticate,
  authorize(),
  homeController.deliveryCertificate
);

router.post(
  "/rice-management/add-delivery-certificate",
  userAuthenticate,
  authorize(),
  homeController.addDeliveryCertificate
);

router.post(
  "/rice-management/update-delivery-certificate",
  userAuthenticate,
  authorize(),
  homeController.updateDeliveryCertificate
);

router.get(
  "/rice-management/current-delivery-certificate",
  userAuthenticate,
  authorize(),
  homeController.currentDeliveryCertificate
);

router.get(
  "/rice-management/factory-rice-loading",
  userAuthenticate,
  authorize(),
  homeController.factoryRiceLoading
);

router.post(
  "/rice-management/add-factory-rice-loading",
  userAuthenticate,
  authorize(),
  homeController.addFactoryRiceLoading
);

router.post(
  "/rice-management/update-factory-rice-loading",
  userAuthenticate,
  authorize(),
  homeController.updateFactoryRiceLoading
);

router.get(
  "/rice-management/rice-AcNote",
  userAuthenticate,
  authorize(),
  homeController.riceAcNote
);

router.post(
  "/rice-management/add-rice-AcNote",
  userAuthenticate,
  authorize(),
  homeController.addRiceAcNote
);

router.post(
  "/rice-management/update-rice-AcNote",
  userAuthenticate,
  authorize(),
  homeController.updateRiceAcNote
);

// router.post("/update-user-states", userAuthenticate, homeController.updateUserStates);

// router.get("/check", userAuthenticate);

// router.get("/userInput", homeController.userInput);

// router.get(
//   "/userInput/getMandi",
//   userAuthenticate,
//   homeController.userInput_getMandi
// );

// router.post(
//   "/userInput/addMandi",
//   userAuthenticate,
//   homeController.userInput_addMandi
// );

// router.get(
//   "/userInput/getTrader",
//   userAuthenticate,
//   homeController.userInput_getTrader
// );

// router.post(
//   "/userInput/addTrader",
//   userAuthenticate,
//   homeController.userInput_addTrader
// );

// router.get("/forms", homeController.forms);

// router.post(
//   "/forms/addMandiPurchaseData",
//   userAuthenticate,
//   upload.single("uploadHisab"),
//   homeController.forms_addMandiPurchaseData
// );

// router.post(
//   "/forms/addLoadingFormData",
//   userAuthenticate,
//   upload.single("uploadVehiclePhoto"),
//   homeController.forms_addLoadingFormData
// );

// router.post(
//   "/forms/addMasterFormData",
//   userAuthenticate,
//   homeController.forms_addMasterFormData
// );

// router.post(
//   "/forms/addDirectTraderFormData",
//   userAuthenticate,
//   homeController.forms_addDirectTraderFormData
// );

// router.get("/report", homeController.report);

// router.get(
//   "/report/getMasterReport",
//   userAuthenticate,
//   homeController.report_getMasterReport
// );

// router.get(
//   "/report/getMandiPurchaseReport",
//   userAuthenticate,
//   homeController.report_getMandiPurchaseReport
// );

// router.get(
//   "/report/getLoadingReport",
//   userAuthenticate,
//   homeController.report_getLoadingReport
// );

// router.get(
//   "/report/getDirectTradersReport",
//   userAuthenticate,
//   homeController.report_getDirectTradersReport
// );

module.exports = router;
