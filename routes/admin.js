const express = require("express");

const adminController = require("../controllers/admin");

const adminAuthenticate =
  require("../middlewares/adminAuthenticate").authenticate;

const router = express.Router();

// show admin index page
router.get("/", adminController.adminIndex);
router.get("/home", adminController.adminHome);
router.get("/mandiDetails", adminController.adminMandiDetails);
router.get("/rolesAndPermission", adminController.rolesAndPermission);
router.get("/license", adminController.license);

//signup and login route
router.post("/loginCheck", adminController.loginCheck);
router.post("/logout", adminAuthenticate, adminController.logout);
// router.post("/refreshToken", adminController.refreshAccessToken);

//forgot Password route
router.get("/password/forgotPassword", adminController.forgotpassword);
router.post("/password/resetEmail", adminController.resetEmail);
router.get("/password/resetpassword/:id", adminController.resetpassword);
router.post(
  "/password/updatepassword/:resetPasswordId",
  adminController.updatepassword
);

// admin view, add, delete menu item handling

router.get("/viewMenuItemDetails", adminController.viewMenuItemDetails);

// router.get(
//   "/getViewMenuItemDetails",
//   adminAuthenticate.authenticate,
//   adminController.getViewMenuItemDetails
// );

//admin data handling

// state data handling
router.get("/getStates/:Id?", adminAuthenticate, adminController.getStates);

router.post("/addState", adminAuthenticate, adminController.addState);

router.post(
  "/updateStateDetails/:Id",
  adminAuthenticate,
  adminController.updateStateDetails
);

router.delete(
  "/deleteState/:Id",
  adminAuthenticate,
  adminController.deleteState
);

// district data handling
router.get("/getDistricts", adminAuthenticate, adminController.getDistricts);

router.post("/addDistrict", adminAuthenticate, adminController.addDistrict);

router.post(
  "/updateDistrictDetails/:Id",
  adminAuthenticate,
  adminController.updateDistrictDetails
);

router.delete(
  "/deleteDistrict/:Id",
  adminAuthenticate,
  adminController.deleteDistrict
);

// mandi data handling
router.get("/getMandis", adminAuthenticate, adminController.getMandis);

router.post("/addMandi", adminAuthenticate, adminController.addMandi);

router.post(
  "/updateMandiDetails/:Id",
  adminAuthenticate,
  adminController.updateMandiDetails
);

router.delete(
  "/deleteMandi/:Id",
  adminAuthenticate,
  adminController.deleteMandi
);

// depot data handling
router.get("/getDepots", adminAuthenticate, adminController.getDepots);

router.post("/addDepot", adminAuthenticate, adminController.addDepot);

router.post(
  "/updateDepotDetails/:Id",
  adminAuthenticate,
  adminController.updateDepotDetails
);

router.delete(
  "/deleteDepot/:Id",
  adminAuthenticate,
  adminController.deleteDepot
);

// roles data handling
router.get("/getRoles", adminAuthenticate, adminController.getRoles);

router.post("/addRole", adminAuthenticate, adminController.addRole);

router.post(
  "/updateRoleDetails/:Id",
  adminAuthenticate,
  adminController.updateRoleDetails
);

router.delete("/deleteRole/:Id", adminAuthenticate, adminController.deleteRole);

// permissions data handling
router.get(
  "/getPermissions",
  adminAuthenticate,
  adminController.getPermissions
);

router.post("/addPermission", adminAuthenticate, adminController.addPermission);

router.post(
  "/updatePermissionDetails/:Id",
  adminAuthenticate,
  adminController.updatePermissionDetails
);

router.delete(
  "/deletePermission/:Id",
  adminAuthenticate,
  adminController.deletePermission
);

// license data handling
router.get("/getLicenses", adminAuthenticate, adminController.getLicenses);

router.post("/addLicense", adminAuthenticate, adminController.addLicense);

router.post(
  "/updateLicenseDetails/:Id",
  adminAuthenticate,
  adminController.updateLicenseDetails
);

router.delete(
  "/deleteLicense/:Id",
  adminAuthenticate,
  adminController.deleteLicense
);

module.exports = router;
