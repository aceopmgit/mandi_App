exports.rolePermissions = {
  admin: ["*"], // Access to all routes
  subAdmin: ["/user/create-user", "/user/view-data", "/block-user"],
  accounts: ["/generate-report", "/view-data"],
  normalUser: ["/create-data", "/edit-data", "/delete-data"],
};

exports.authorize = (allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user.role; // Assuming `req.user.role` is set after authentication
    const allowedPaths = rolePermissions[userRole]; // Get allowed paths for this role

    if (!allowedPaths) {
      return res.status(403).json({ message: "Role not found or invalid" });
    }

    if (allowedPaths.includes("*") || allowedPaths.includes(req.path)) {
      return next(); // Grant access
    }

    return res.status(403).json({ message: "Access denied" });
  };
};
