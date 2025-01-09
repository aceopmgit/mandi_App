exports.rolePermissions = {
  admin: ["*"], // Access to all routes
  subAdmin: ["/user/create-user", "/user/view-data", "/block-user"],
  accounts: ["/generate-report", "/view-data"],
  normalUser: ["/create-data", "/edit-data", "/delete-data"],
};

exports.authorize = (allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user.role; // Assuming `req.user.role` is set after authentication

    if (allowedRoles.includes("*") || allowedRoles.includes(req.path)) {
      return next(); // Grant access
    }

    return res.status(403).json({ message: "Access denied" });
  };
};
