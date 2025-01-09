const express = require("express");

const userController = require("../controllers/user");

const userAuthenticate = require("../middlewares/Authenticate").authenticate;
const userPermissions = require("../util/rolePermissions").rolePermissions;
const authorize = require("../util/rolePermissions").authorize;
const { loginLimiter } = require("../middlewares/rateLimiters");

const router = express.Router();

//signup and login route
router.post("/create-user", userController.addUser);
router.post("/auth/login", loginLimiter, userController.loginCheck);
router.post("/auth/logout", userAuthenticate, userController.logout);
// router.post("/refreshToken", userController.refreshAccessToken);

// Password Management Routes
router.get("/password/forgot-password", userController.forgotpassword);
router.post("/password/reset-email", userController.resetEmail);
router.get("/password/reset-password/:id", userController.resetpassword);
router.post(
  "/password/update-password/:resetPasswordId",
  userController.updatepassword
);

module.exports = router;
