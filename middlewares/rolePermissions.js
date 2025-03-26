const CustomError = require("../util/customError");
const rolePermissions = {
  // Admin routes
  "43aaaf56-9259-4e96-a95e-0722f5e50d7a": ["*"], // Access to all routes
  // sub admin routes
  "590a1176-228d-4355-9f1e-900b407bbc54": [
    "/manage-account/account-info",
    "/manage-account/company-location",
    "/manage-account/update-company-location",
    "/manage-account/delete-company-location/:companyLocationId",
    "/manage-account/company-factory",
    "/manage-account/add-factory",
    "/manage-account/update-factory",
    "/manage-account/delete-factory/:companyFactoryId",
    "/manage-account/company-trader",
    "/manage-account/add-Trader",
    "/manage-account/update-trader",
    "/manage-account/delete-trader/:companyTraderId",
    "/manage-user/company-user",
    "/manage-user/user-roles",
    "/manage-user/add-user",
    "home/manage-user/update-user",
    "/manage-user/update-user-password",
    "/manage-user/freeze-user",
    "/profile-info",
    "/profile/reset-password",
    "/company-mandi",
    "/company-factory",
    "/paddy-management/master-target",
    "/paddy-management/add-master-target",
    "/paddy-management/update-master-target",
    "/paddy-management/add-paddy-purchase",
    "/paddy-management/paddy-purchase",
  ],
  // Accounts route
  "91f84f71-74bf-4cf1-8084-b1da2463c990": [
    "/profile-info",
    "/profile/reset-password",
    "/company-mandi",
    "/company-factory",
    "/paddy-management/master-target",
    "/paddy-management/add-paddy-purchase",
    "/paddy-management/paddy-purchase",
  ],
  // normal user routes
  "0c52455a-50ba-42d5-8a59-522cf0cb3f71": [
    "/profile-info",
    "/profile/reset-password",
    "/company-mandi",
    "/company-factory",
    "/paddy-management/master-target",
    "/paddy-management/add-paddy-purchase",
    "/paddy-management/paddy-purchase",
  ],
};
exports.authorize = (allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user.role.id; // Assuming `req.user.role` is set after authentication
    console.log("userrole id", userRole);
    console.log(req.path);
    const allowedPaths = rolePermissions[`${userRole}`]; // Get allowed paths for this role

    console.log(allowedPaths);

    if (!allowedPaths) {
      return res.status(403).json({ message: "Role not found or invalid" });
    }

    if (allowedPaths.includes("*") || allowedPaths.includes(req.path)) {
      return next(); // Grant access
    }

    return next(new CustomError("Access denied", 403));
  };
};
