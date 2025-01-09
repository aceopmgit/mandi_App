const CustomError = require("../util/customError");

const rateLimit = require("express-rate-limit");

// Global Rate Limiter
const globalLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute window
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests, please try again later.",
  handler: (req, res, next) => {
    // Use CustomError for the rate-limit error
    const rateLimitError = new CustomError(
      "Too many requests, please try again later.",
      429
    );
    next(rateLimitError); // Pass the error to the global error handler
  },
});

// Login Rate Limiter
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 5, // limit each IP to 5 login attempts per windowMs
  message: "Too many login attempts, please try again later.",
  handler: (req, res, next) => {
    const rateLimitError = new CustomError(
      "Too many login attempts, please try again later.",
      429
    );
    next(rateLimitError); // Pass the error to the global error handler
  },
});

module.exports = { globalLimiter, loginLimiter };
