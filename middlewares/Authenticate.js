const jwt = require("jsonwebtoken");

const User = require("../models/User.js");
const Company = require("../models/Company.js");
const Role = require("../models/Role.js");
const License = require("../models/License.js");

exports.authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
      return res.status(401).json({ error: "Authorization header missing" });
    }

    // Extract the token after "Bearer "
    const token = authHeader.split(" ")[1];

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    } catch (error) {
      return res
        .status(401)
        .json({ message: "Invalid or expired token", error: error.message });
    }

    // Fetch user from database
    // const user = await User.findByPk(decoded.userId);

    const user = await User.findOne({
      where: { id: decoded.userId },
      include: [
        {
          model: Role,
          attributes: ["id", "name"],
        },
        {
          model: Company,

          include: [
            {
              model: License,
              attributes: [
                "id",
                "name",
                "maxSubAdmin",
                "maxAccounts",
                "maxNormalUsers",
              ],
            },
          ],
        },
      ],
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // const userDetails = {
    //   id: user.id,
    //   name: user.name,
    //   email: user.email,
    //   phone: user.phone,
    //   isActive: user.isActive,
    //   roleId: user.roleId,
    //   role: user.role.name,
    //   companyId: user.companyId,
    //   companyName: user.company.name,
    //   companyLicenseId: user.company.licenseId,
    //   companyLicenseStartDate: user.company.licenseStartDate,
    //   companyLicenseExpiryDate: user.company.licenseExpiryDate,
    //   companyIsActive: user.company.isActive,
    // };

    req.user = user; // Attach user to request object

    //company license expiry handle
    if (
      !user.company.isActive ||
      new Date(user.company.licenseExpiryDate) < new Date()
    ) {
      if (userDetails.companyIsActive) {
        await Company.update(
          { isActive: false },
          { where: { id: userDetails.companyId } }
        );
      }
      return res.status(403).json({
        status: false,
        message:
          "Your company's license has expired. Please renew to regain access.",
      });
    }

    // user is blocked by the admin
    if (!user.isActive) {
      return res.status(403).json({
        status: false,
        message:
          "Your account has been temporarily frozen. Contact your administrator.",
      });
    }

    next(); // Proceed to the next middleware or route handler

    // console.log("*******User Check*********", userDetails);
  } catch (err) {
    console.error(err);
    res.status(403).json({ message: "Access denied", error: err.message });
  }
};

// how to generate access tokens
// node
// require('crypto').randomBytes(64).toString('hex')