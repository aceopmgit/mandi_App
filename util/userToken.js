// utils/auth.js
const jwt = require("jsonwebtoken");

function generateAccessToken(id) {
  return jwt.sign({ userId: id }, process.env.TOKEN_SECRET, {
    expiresIn: "24h",
  });
}

module.exports = { generateAccessToken };
