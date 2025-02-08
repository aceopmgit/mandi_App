const express = require("express");
const multer = require("multer");

// Multer middleware for handling file uploads
const upload = multer({ dest: "public/uploads/" });

const adminController = require("../controllers/admin");
const homeController = require("../controllers/home");
const userAuthenticate = require("../middlewares/Authenticate").authenticate;

const router = express.Router();

// admin side data
router.get("/get-states/:Id?", userAuthenticate, adminController.getStates);

router.get("/get-districts", userAuthenticate, adminController.getDistricts);

router.get("/", homeController.home);
router.get("/manage-account", homeController.manageAccount);

router.get("/details", homeController.viewMenuItemDetails);

router.get(
  "/manage-account/account-info",
  userAuthenticate,
  homeController.accountInfo
);

router.get(
  "/manage-account/company-location",
  userAuthenticate,
  homeController.companyLocation
);

router.post(
  "/manage-account/update-company-location",
  userAuthenticate,
  homeController.updateCompanyLocation
);

router.delete(
  "/manage-account/delete-company-location/:companyLocationId",
  userAuthenticate,
  homeController.deleteCompanyLocation
);

router.get(
  "/manage-account/company-factory",
  userAuthenticate,
  homeController.companyFactory
);

router.post(
  "/manage-account/add-factory",
  userAuthenticate,
  homeController.addFactory
);

router.post(
  "/manage-account/update-factory",
  userAuthenticate,
  homeController.updateFactory
);

router.delete(
  "/manage-account/delete-factory/:companyFactoryId",
  userAuthenticate,
  homeController.deleteFactory
);

router.get(
  "/manage-account/company-trader",
  userAuthenticate,
  homeController.companyTrader
);

router.post(
  "/manage-account/add-Trader",
  userAuthenticate,
  homeController.addTrader
);

router.post(
  "/manage-account/update-trader",
  userAuthenticate,
  homeController.updateTrader
);

router.delete(
  "/manage-account/delete-trader/:companyTraderId",
  userAuthenticate,
  homeController.deleteTrader
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
