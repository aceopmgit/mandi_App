const path = require("path");

exports.index = (req, res, next) => {
  res.sendFile(path.join(__dirname, "..", "views", "user", "index.html"));
};

exports.signup = (req, res, next) => {
  res.sendFile(path.join(__dirname, "..", "views", "user", "signup.html"));
};

exports.login = (req, res, next) => {
  res.sendFile(path.join(__dirname, "..", "views", "user", "login.html"));
};
