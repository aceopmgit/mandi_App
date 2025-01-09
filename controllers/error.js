const path = require("path");

exports.errorMessage = (req, res, next) => {
  res.status(400).sendFile(path.join(__dirname, "..", "views", "error.html"));
};

exports.errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const status = statusCode >= 500 ? "error" : "fail";

  // Log the error
  console.error("******* Error Details ******", {
    message: err.message,
    stack: err.stack,
    name: err.name,
  });

  // Send the response
  res.status(statusCode).json({
    status: status,
    message: statusCode >= 500 ? "Internal Server Error." : err.message,
    error:
      process.env.NODE_ENV === "production"
        ? undefined
        : {
            stack: err.stack,
            name: err.name,
          },
  });
};
