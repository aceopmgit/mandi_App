const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

exports.authenticate = async (req, res, next) => {
  try {
    const token = req.header("Authorization");
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.ADMIN_TOKEN_SECRET);

    // Fetch user from database
    const admin = await Admin.findByPk(decoded.userId);
    if (!admin) {
      return res.status(404).json({ message: "User not found" });
    }

    req.admin = admin; // Attach user to request object
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    console.error(err);
    res.status(403).json({ message: "Access denied", error: err.message });
  }
};

// how to generate access tokens
// require('crypto').randomBytes(64).toString('hex')
