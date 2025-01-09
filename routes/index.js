const express = require("express");

const indexController = require("../controllers/index");

const router = express.Router();

router.get("/", indexController.index);

router.get("/signup", indexController.signup);

router.get("/login", indexController.login);

module.exports = router;
