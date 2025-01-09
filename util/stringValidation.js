// utils/validation.js
function isStringInvalid(string) {
  return !string || typeof string !== "string" || string.trim() === "";
}

module.exports = { isStringInvalid };
