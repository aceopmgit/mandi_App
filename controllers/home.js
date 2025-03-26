const path = require("path");
const { google } = require("googleapis");
const fs = require("fs");
const { format } = require("date-fns");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");

const sequelize = require("../util/database.js");

const Company = require("../models/Company");
const CompanyLocation = require("../models/CompanyLocation");
const CompanyDistrict = require("../models/CompanyDistrict.js");
const DeliveryCertificate = require("../models/DeliveryCertificate");
const Depot = require("../models/Depot");
const District = require("../models/District");
const Factory = require("../models/Factory");
const FactoryRiceLoading = require("../models/FactoryRiceLoading.js");
const ForgotPassword = require("../models/ForgotPassword");
const Godown = require("../models/Godown.js");
const License = require("../models/License");
const Mandi = require("../models/Mandi");
const MasterTarget = require("../models/MasterTarget");

const PaddyLoadingEntry = require("../models/PaddyLoadingEntry");
const PaddyPurchase = require("../models/PaddyPurchase");

const PaddyUnloadingEntry = require("../models/PaddyUnloadingEntry");
const RiceAcNote = require("../models/RiceAcNote");
const Role = require("../models/Role");
const Season = require("../models/Season.js");
const State = require("../models/State");
const Trader = require("../models/Trader");
const TraderPaddyRelease = require("../models/TraderPaddyRelease.js");
const TraderPaddyAdvance = require("../models/TraderPaddyAdvance.js");
const TransitPassEntry = require("../models/TransitPassEntry.js");
const User = require("../models/User");

// const CompanyLocation = require("../models/CompanyLocation.js");
// const State = require("../models/State.js");
// const District = require("../models/District.js");
// const mandi = require("../models/Mandi.js");
// const trader = require("../models/Trader.js");
// const purchase = require("../models/PaddyPurchase.js");
// const loading = require("../models/PaddyLoadingEntry.js");
// const master = require("../models/MasterTarget.js");
// const directTrader = require("../models/DirectTrader.js");

// error handler imports
const CustomError = require("../util/customError");
const asyncErrorHandler = require("../util/asyncErrorHandler.js");

// Joi validation schema
const userValidationSchema = Joi.object({
  Name: Joi.string().trim().min(3).max(100).required().messages({
    "string.empty": "Name is required",
    "string.min": "Name must be at least 3 characters",
    "string.max": "Name must not exceed 50 characters",
  }),
  Email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email",
    "string.empty": "Email is required",
  }),
  Phone: Joi.string()
    .pattern(/^[6-9]\d{9}$/) // Indian phone numbers: starts with 6-9 followed by 9 digits
    .length(10) // Ensures the phone number is exactly 10 digits long
    .required()
    .messages({
      "string.pattern.base": "Invalid Phone Number",
      "string.length": "Phone number must be exactly 10 digits long",
      "string.empty": "Phone is required",
    }),
  Password: Joi.string()
    .min(8)
    .max(50)
    .pattern(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    )
    .required()
    .messages({
      "string.min": "Password must be at least 8 characters long",
      "string.max": "Password must not exceed 30 characters",
      "string.pattern.base":
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      "string.empty": "Password is required",
    }),
  userRoleId: Joi.string().trim().required().messages({
    "string.empty": "Name is required",
  }),
});

exports.home = (req, res, next) => {
  res.sendFile(path.join(__dirname, "..", "views", "user", "home.html"));
};

exports.manageAccount = (req, res, next) => {
  res.sendFile(
    path.join(__dirname, "..", "views", "user", "manageAccount.html")
  );
};

exports.manageUser = (req, res, next) => {
  res.sendFile(path.join(__dirname, "..", "views", "user", "manageUser.html"));
};

exports.viewMenuItemDetails = (req, res, next) => {
  res.sendFile(
    path.join(__dirname, "..", "views", "user", "userViewMenuItem.html")
  );
};

exports.profile = (req, res, next) => {
  res.sendFile(path.join(__dirname, "..", "views", "user", "userProfile.html"));
};

exports.paddyManagement = (req, res, next) => {
  res.sendFile(
    path.join(__dirname, "..", "views", "user", "paddyManagement.html")
  );
};

exports.traderManagement = (req, res, next) => {
  res.sendFile(
    path.join(__dirname, "..", "views", "user", "traderManagement.html")
  );
};

exports.riceManagement = (req, res, next) => {
  res.sendFile(
    path.join(__dirname, "..", "views", "user", "riceManagement.html")
  );
};

// exports.userInput = (req, res, next) => {
//   res.sendFile(path.join(__dirname, "..", "views", "user", "userInput.html"));
// };

// exports.forms = (req, res, next) => {
//   res.sendFile(path.join(__dirname, "..", "views", "user", "forms.html"));
// };

// exports.report = (req, res, next) => {
//   res.sendFile(path.join(__dirname, "..", "views", "user", "report.html"));
// };

// exports.userInput_getMandi = async (req, res, next) => {
//   try {
//     const details = await mandi.findAll({
//       where: { userId: req.user.id },
//       attributes: ["name"],
//     });
//     // console.log("**************getmandi-userinput", details);
//     res.status(200).json({
//       details: details,
//     });
//   } catch (err) {
//     res.status(500).json({
//       Error: err,
//     });
//     console.log(err);
//   }
// };

// exports.userInput_addMandi = async (req, res, next) => {
//   const t = await sequelize.transaction();
//   try {
//     const { name } = req.body;
//     // console.log("add mandi body", req.body);

//     if (name.trim() === "") {
//       return res.status(400).json({
//         status: false,
//         message: "Bad Parameter. Something is Misssing !",
//       });
//     }

//     const data = await mandi.create(
//       {
//         name: name,
//         userId: req.user.id,
//       },
//       { transaction: t }
//     );

//     await t.commit();

//     res.status(201).json({ message: "Mandi added successfully" });
//   } catch (err) {
//     await t.rollback();
//     res.status(500).json({
//       Error: err,
//     });
//     console.log("add mandi error", err);
//   }
// };

// exports.userInput_getTrader = async (req, res, next) => {
//   try {
//     const details = await trader.findAll({
//       where: { userId: req.user.id },
//       attributes: ["name"],
//     });
//     console.log("**************getTrader-userinput", details);
//     res.status(200).json({
//       details: details,
//     });
//   } catch (err) {
//     res.status(500).json({
//       Error: err,
//     });
//     console.log(err);
//   }
// };

// exports.userInput_addTrader = async (req, res, next) => {
//   const t = await sequelize.transaction();
//   try {
//     const { name } = req.body;

//     if (name.trim() === "") {
//       return res.status(400).json({
//         status: false,
//         message: "Bad Parameter. Something is Misssing !",
//       });
//     }

//     const data = await trader.create(
//       {
//         name: name,
//         userId: req.user.id,
//       },
//       { transaction: t }
//     );

//     await t.commit();

//     res.status(201).json({ message: "Trader added successfully" });
//   } catch (err) {
//     await t.rollback();
//     res.status(500).json({
//       Error: err,
//     });
//     console.log("add trader error", err);
//   }
// };

// exports.forms_addMandiPurchaseData = async (req, res, next) => {
//   const t = await sequelize.transaction();
//   try {
//     const { mandiName, purchaseQuantity, gunnyBags, ppBags, bagWeight, faq } =
//       req.body;

//     console.log("forms_addMandiPurchaseData", req.body);

//     if (
//       mandiName.trim() === "" ||
//       purchaseQuantity.trim() === "" ||
//       +purchaseQuantity < 0 ||
//       gunnyBags.trim() === "" ||
//       +gunnyBags < 0 ||
//       ppBags.trim() === "" ||
//       +ppBags < 0 ||
//       bagWeight.trim() === "" ||
//       +bagWeight < 0 ||
//       faq.trim() === "" ||
//       +faq < 0 ||
//       !req.file
//     ) {
//       return res.status(400).json({
//         status: false,
//         message: "Bad Parameter. Invalid Entry !",
//       });
//     }
//     // Decode the service account key from an environment variable
//     const keyContent = Buffer.from(
//       process.env.GOOGLE_SERVICE_ACCOUNT_KEY,
//       "base64"
//     ).toString("utf-8");

//     const auth = new google.auth.GoogleAuth({
//       credentials: JSON.parse(keyContent),
//       scopes: ["https://www.googleapis.com/auth/drive.file"],
//     });

//     const drive = google.drive({ version: "v3", auth });

//     const filePath = req.file.path;
//     const fileName = req.file.originalname;

//     // Upload to Google Drive
//     const fileMetadata = {
//       name: fileName,
//       parents: ["1XfXjO9pkNDn30gBir8p4R1l1IG9Jnu5-"],
//     };
//     const media = {
//       mimeType: req.file.mimetype,
//       body: fs.createReadStream(filePath),
//     };

//     const driveResponse = await drive.files.create({
//       requestBody: fileMetadata,
//       media: media,
//       fields: "id",
//     });

//     // Get file URL
//     const fileId = driveResponse.data.id;
//     drive.permissions.create({
//       fileId,
//       requestBody: {
//         role: "reader",
//         type: "anyone",
//       },
//     });

//     const fileUrl = `https://drive.google.com/uc?id=${fileId}`;

//     const nettPurchaseQty = +purchaseQuantity - +bagWeight - +faq;
//     const purBags = +gunnyBags + +ppBags;

//     const data = await purchase.create(
//       {
//         mandiName: mandiName,
//         quantity: Number(purchaseQuantity),
//         gunnyBags: gunnyBags,
//         ppBags: ppBags,
//         bagWeight: Number(bagWeight),
//         faq: Number(faq),
//         uploadHisab: fileUrl,
//         purBags: purBags,
//         nettPurchaseQty: Number(nettPurchaseQty),
//         userId: req.user.id,
//       },
//       { transaction: t }
//     );

//     // const details = await purchase.findAll();

//     // console.log("***********fromresponsedata***********", data);
//     // console.log("*************all purchase data***********", details);

//     // Delete the file from local uploads folder
//     fs.unlinkSync(filePath);
//     await t.commit();
//     res.status(201).json({ message: "Form data submitted successfully" });
//   } catch (err) {
//     await t.rollback();
//     res.status(500).json({
//       Error: err,
//     });
//     console.log("add response form error", err);
//   }
// };

// exports.forms_addLoadingFormData = async (req, res, next) => {
//   const t = await sequelize.transaction();
//   try {
//     console.log(req.body);
//     const { mandiName, tpNumber, vehicleNumber, bagsLoaded, tpBags, tpQty } =
//       req.body;

//     if (
//       mandiName.trim() === "" ||
//       tpNumber.trim() === "" ||
//       +tpNumber < 0 ||
//       vehicleNumber.trim() === "" ||
//       bagsLoaded.trim() === "" ||
//       +bagsLoaded < 0 ||
//       tpBags.trim() === "" ||
//       +tpBags < 0 ||
//       tpQty.trim() === "" ||
//       +tpQty < 0 ||
//       !req.file
//     ) {
//       return res.status(400).json({
//         status: false,
//         message: "Bad Parameter. Invalid Entry !",
//       });
//     }
//     // Decode the service account key from an environment variable
//     const keyContent = Buffer.from(
//       process.env.GOOGLE_SERVICE_ACCOUNT_KEY,
//       "base64"
//     ).toString("utf-8");

//     const auth = new google.auth.GoogleAuth({
//       credentials: JSON.parse(keyContent),
//       scopes: ["https://www.googleapis.com/auth/drive.file"],
//     });

//     const drive = google.drive({ version: "v3", auth });

//     const filePath = req.file.path;
//     const fileName = req.file.originalname;

//     // Upload to Google Drive
//     const fileMetadata = {
//       name: fileName,
//       parents: ["17GbbMLU0jmihuG6iNJvAOa0wn-nqCiht"],
//     };
//     const media = {
//       mimeType: req.file.mimetype,
//       body: fs.createReadStream(filePath),
//     };

//     const driveResponse = await drive.files.create({
//       requestBody: fileMetadata,
//       media: media,
//       fields: "id",
//     });

//     // Get file URL
//     const fileId = driveResponse.data.id;
//     drive.permissions.create({
//       fileId,
//       requestBody: {
//         role: "reader",
//         type: "anyone",
//       },
//     });

//     const fileUrl = `https://drive.google.com/uc?id=${fileId}`;

//     const data = await loading.create(
//       {
//         mandiName: mandiName,
//         tpNumber: tpNumber,
//         vehicleNumber: vehicleNumber,
//         bagsLoaded: bagsLoaded,
//         tpBags: tpBags,
//         tpQty: Number(tpQty).toFixed(2),
//         uploadVehiclePhoto: fileUrl,
//         userId: req.user.id,
//       },
//       { transaction: t }
//     );

//     const details = await loading.findAll();

//     console.log("***********fromresponsedata***********", data);
//     console.log("*************all purchase data***********", details);

//     // Delete the file from local uploads folder
//     fs.unlinkSync(filePath);
//     res.status(201).json({ message: "Form data submitted successfully" });
//   } catch (err) {
//     await t.rollback();
//     res.status(500).json({
//       Error: err,
//     });
//     console.log("add response form error", err);
//   }
// };

// exports.forms_addMasterFormData = async (req, res, next) => {
//   const t = await sequelize.transaction();
//   try {
//     console.log(req.body);
//     const { mandiName, targetQtls, liftedQauntity, targetBalance } = req.body;
//     if (
//       mandiName.trim() === "" ||
//       targetQtls.trim() === "" ||
//       targetQtls < 0 ||
//       liftedQauntity.trim() === "" ||
//       liftedQauntity < 0 ||
//       targetBalance.trim() === "" ||
//       targetBalance < 0
//     ) {
//       return res.status(400).json({
//         status: false,
//         message: "Invalid data!",
//       });
//     }
//     const data = await master.create(
//       {
//         mandiName: mandiName,
//         targetQtls: Number(targetQtls),
//         liftedQauntity: Number(liftedQauntity),
//         targetBalance: Number(targetBalance),
//         userId: req.user.id,
//       },
//       { transaction: t }
//     );

//     await t.commit();

//     console.log(data);

//     res.status(201).json({ message: "Master added successfully" });
//   } catch (err) {
//     await t.rollback();
//     res.status(500).json({
//       Error: err,
//     });
//     console.log("add response form error", err);
//   }
// };

// exports.forms_addDirectTraderFormData = async (req, res, next) => {
//   const t = await sequelize.transaction();
//   try {
//     console.log(req.body);
//     const { partyName, inBags, gross, bagWtInKg, percent, specialCuttingInKg } =
//       req.body;
//     if (
//       partyName.trim() === "" ||
//       inBags.trim() === "" ||
//       inBags < 0 ||
//       gross.trim() === "" ||
//       gross < 0 ||
//       bagWtInKg.trim() === "" ||
//       bagWtInKg < 0 ||
//       percent.trim() === "" ||
//       percent < 0 ||
//       specialCuttingInKg.trim() === ""
//     ) {
//       return res.status(400).json({
//         status: false,
//         message: "Invalid data!",
//       });
//     }
//     const faq = ((+gross - +bagWtInKg) * (+percent / 100)).toFixed(2);
//     console.log("********faq*********", faq);
//     const nettIn = +gross - +bagWtInKg - +faq - +specialCuttingInKg;

//     console.log("*******nettIn**********", nettIn);

//     const data = await directTrader.create(
//       {
//         partyName: partyName,
//         inBags: inBags,
//         gross: gross,
//         bagWtInKg: Number(bagWtInKg),
//         percent: Number(percent),
//         specialCuttingInKg: Number(specialCuttingInKg),
//         faq: Number(faq),
//         nettIn: Number(nettIn),
//         userId: req.user.id,
//       },
//       { transaction: t }
//     );

//     await t.commit();

//     console.log(data);

//     res.status(201).json({ message: "Master added successfully" });
//   } catch (err) {
//     await t.rollback();
//     res.status(500).json({
//       Error: err,
//     });
//     console.log("add response form error", err);
//   }
// };

// exports.report_getMasterReport = async (req, res, next) => {
//   try {
//     const details = await master.findAll({
//       where: { userId: req.user.id },
//       attributes: [
//         "mandiName",
//         "targetQtls",
//         "liftedQauntity",
//         "targetBalance",
//         "createdAt",
//       ],
//     });
//     console.log("**************report_getMasterReport", details);
//     res.status(200).json({
//       details: details,
//     });
//   } catch (err) {
//     res.status(500).json({
//       Error: err,
//     });
//     console.log(err);
//   }
// };

// exports.report_getMandiPurchaseReport = async (req, res, next) => {
//   try {
//     const details = await purchase.findAll({
//       where: { userId: req.user.id },
//       attributes: [
//         "createdAt",
//         "mandiName",
//         "quantity",
//         "gunnyBags",
//         "ppBags",
//         "bagWeight",
//         "faq",
//         "purBags",
//         "nettPurchaseQty",
//       ],
//     });
//     console.log("**************report_getMandiPurchaseReport", details);
//     res.status(200).json({
//       details: details,
//     });
//   } catch (err) {
//     res.status(500).json({
//       Error: err,
//     });
//     console.log(err);
//   }
// };

// exports.report_getLoadingReport = async (req, res, next) => {
//   try {
//     const details = await loading.findAll({
//       where: { userId: req.user.id },
//       attributes: [
//         "createdAt",
//         "mandiName",
//         "tpNumber",
//         "vehicleNumber",
//         "bagsLoaded",
//         "tpBags",
//         "tpQty",
//         "uploadVehiclePhoto",
//       ],
//     });
//     console.log("**************report_getLoadingReport", details);
//     res.status(200).json({
//       details: details,
//     });
//   } catch (err) {
//     res.status(500).json({
//       Error: err,
//     });
//     console.log(err);
//   }
// };

// exports.report_getDirectTradersReport = async (req, res, next) => {
//   try {
//     const details = await directTrader.findAll({
//       where: { userId: req.user.id },
//       attributes: [
//         "createdAt",
//         "partyName",
//         "inBags",
//         "gross",
//         "bagWtInKg",
//         "percent",
//         "specialCuttingInKg",
//         "faq",
//         "nettIn",
//       ],
//     });
//     console.log("**************report_getLoadingReport", details);
//     res.status(200).json({
//       details: details,
//     });
//   } catch (err) {
//     res.status(500).json({
//       Error: err,
//     });
//     console.log(err);
//   }
// };

exports.accountInfo = asyncErrorHandler(async (req, res, next) => {
  const details = {
    name: req.user.company.name,
    email: req.user.company.email,
    licenseStartDate: format(
      new Date(req.user.company.licenseStartDate),
      "dd-MM-yyyy HH:mm:ss"
    ),
    licenseExpiryDate: format(
      new Date(req.user.company.licenseExpiryDate),
      "dd-MM-yyyy HH:mm:ss"
    ),
    activeSubAdmin: req.user.company.activeSubAdmin,
    activeAccounts: req.user.company.activeAccounts,
    activeNormalUsers: req.user.company.activeNormalUsers,
    licenseName: req.user.company.license.name,
    maxSubAdmin: req.user.company.license.maxSubAdmin,
    maxAccounts: req.user.company.license.maxAccounts,
    maxNormalUsers: req.user.company.license.maxNormalUsers,
  };
  console.log(details);
  res.status(200).json({
    status: true,
    accountDetails: details,
    message: "Data Fetched Successfully",
  });
});

exports.companyLocation = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.query;
  console.log(id);

  let details;

  if (id) {
    const companyLocation = await CompanyLocation.findOne({
      where: { id: id },
      include: [
        {
          model: Company,
          attributes: ["name"],
        },
        {
          model: State,
          attributes: ["id", "name"],
        },
        {
          model: CompanyDistrict,
          include: [
            {
              model: District,
              attributes: ["id", "name"], // Fetch only necessary fields
            },
          ],
        },
      ],
    });

    if (!companyLocation) {
      return next(new CustomError("Company location not found", 404));
    }

    console.log("Company Location details", companyLocation);

    details = {
      companyLocationId: companyLocation.id,
      state: companyLocation.state.name,
      stateId: companyLocation.state.id,
      districts: companyLocation.company_districts.map((entry) => ({
        id: entry.district.id,
        name: entry.district.name,
      })),
      createdAt: format(
        new Date(companyLocation.createdAt),
        "dd-MM-yyyy HH:mm:ss"
      ),
      updatedAt: format(
        new Date(companyLocation.updatedAt),
        "dd-MM-yyyy HH:mm:ss"
      ),
    };
  } else {
    const companyLocation = await CompanyLocation.findAll({
      where: {
        companyId: req.user.company.id,
      },
      include: [
        {
          model: State,
          attributes: ["id", "name"],
        },
      ],
    });

    if (!companyLocation) {
      return next(new CustomError("Company location not found", 404));
    }

    details = companyLocation.map((ele) => {
      const obj = {
        id: ele.id,
        companyId: ele.companyId,
        stateId: ele.state.id,
        stateName: ele.state.name,
        createdAt: format(new Date(ele.createdAt), "dd-MM-yyyy"),
        updatedAt: format(new Date(ele.updatedAt), "dd-MM-yyyy"),
      };

      return obj;
    });
  }

  res.status(200).json({
    status: true,
    companyLocations: details,
    message: "Data Fetched Successfully",
  });
});

exports.updateCompanyLocation = asyncErrorHandler(
  async (req, res, next, transaction) => {
    const { stateId, districts } = req.body;
    const companyId = req.user.companyId;
    const userId = req.user.id;

    // Check if CompanyLocation exists
    let companyLocation = await CompanyLocation.findOne({
      where: { companyId, stateId },
      transaction,
    });

    if (!companyLocation) {
      companyLocation = await CompanyLocation.create(
        {
          companyId,
          stateId,
          userId,
        },
        { transaction }
      );
    }

    // Remove existing districts to avoid duplicates
    await CompanyDistrict.destroy({
      where: { companyLocationId: companyLocation.id },
      transaction,
    });

    // Insert new districts
    const districtEntries = districts.map((districtId) => ({
      companyLocationId: companyLocation.id,
      districtId,
    }));

    await CompanyDistrict.bulkCreate(districtEntries, { transaction });

    res.status(200).json({ message: "Company location updated successfully." });
  },
  true
);

exports.deleteCompanyLocation = asyncErrorHandler(
  async (req, res, next, transaction) => {
    const companyLocationId = req.params.companyLocationId;

    const companyLocation = await CompanyLocation.destroy({
      where: { id: companyLocationId },
      transaction,
    });

    await CompanyDistrict.destroy({
      where: { companyLocationId },
      transaction,
    });

    if (companyLocation === 0) {
      return next(new CustomError("Company location not found", 404));
    }

    res.status(200).json({ message: "Company Location deleted successfully" });
  },
  true
);

exports.companySeason = asyncErrorHandler(async (req, res, next) => {
  console.log("Helloooooooo");
  const { id } = req.query;
  console.log(id);

  let details;

  if (id) {
    const companySeason = await Season.findOne({
      where: { id: id },
      include: [
        {
          model: Company,
          attributes: ["name"],
        },
      ],
    });

    if (!companySeason) {
      return next(new CustomError("Comapny season not found", 404));
    }

    console.log("Company season details", companySeason);

    const createdByUser = await User.findOne({
      where: { id: companySeason.createdBy },
      attributes: ["name"],
    });

    const modifiedByUser = await User.findOne({
      where: { id: companySeason.lastModifiedBy },
      attributes: ["name"],
    });

    details = {
      seasonId: companySeason.id,
      name: companySeason.name,
      seasonName: companySeason.seasonName,
      startDate: companySeason.startDate,
      endDate: companySeason.endDate,
      companyName: companySeason.company.name,
      createdBy: createdByUser.name,
      lastModifiedBy: modifiedByUser.name,
      createdAt: format(
        new Date(companySeason.createdAt),
        "dd-MM-yyyy HH:mm:ss"
      ),
      updatedAt: format(
        new Date(companySeason.updatedAt),
        "dd-MM-yyyy HH:mm:ss"
      ),
    };
  } else {
    const companySeason = await Season.findAll({
      where: {
        companyId: req.user.company.id,
      },
      attributes: ["id", "name", "active", "createdAt", "updatedAt"],
    });

    console.log(companySeason);

    if (!companySeason) {
      return next(new CustomError("Company season not found", 404));
    }

    details = companySeason.map((ele) => {
      const obj = {
        seasonId: ele.id,
        status: ele.active,
        name: ele.name,
        createdAt: format(new Date(ele.createdAt), "dd-MM-yyyy"),
        updatedAt: format(new Date(ele.updatedAt), "dd-MM-yyyy"),
      };

      return obj;
    });
  }

  res.status(200).json({
    status: true,
    companySeasons: details,
    message: "Data Fetched Successfully",
  });
});

exports.addSeason = asyncErrorHandler(async (req, res, next, transaction) => {
  const { name, season, startDate, endDate } = req.body;

  if (!name || typeof name !== "string" || name.trim() === "") {
    return next(new CustomError("Invalid name. Name is required.", 400));
  }

  // Allowed seasons
  const allowedSeasons = ["Kharif", "Rabi"];
  if (!season || !allowedSeasons.includes(season)) {
    return next(
      new CustomError("Invalid season. Choose 'Kharif' or 'Rabi'.", 400)
    );
  }

  // Ensure startDate and endDate are in YYYY-MM format
  const dateRegex = /^\d{4}-(0[1-9]|1[0-2])$/; // Matches YYYY-MM format
  if (!startDate || !dateRegex.test(startDate)) {
    return next(
      new CustomError("Invalid start date format. Use YYYY-MM.", 400)
    );
  }
  if (!endDate || !dateRegex.test(endDate)) {
    return next(new CustomError("Invalid end date format. Use YYYY-MM.", 400));
  }

  // Parse year from start and end dates
  const startYear = parseInt(startDate.split("-")[0], 10);
  const endYear = parseInt(endDate.split("-")[0], 10);

  // Get the current year
  const currentYear = new Date().getFullYear();

  // Ensure startDate and endDate are within the allowed range
  const minYear = currentYear - 2;
  const maxYear = currentYear + 2;

  if (startYear < minYear || startYear > maxYear) {
    return next(
      new CustomError(
        `Start date should be between ${minYear} and ${maxYear}.`,
        400
      )
    );
  }

  if (endYear < minYear || endYear > maxYear) {
    return next(
      new CustomError(
        `End date should be between ${minYear} and ${maxYear}.`,
        400
      )
    );
  }

  // Ensure startDate is not after endDate
  if (new Date(startDate) > new Date(endDate)) {
    return next(new CustomError("Start date cannot be after end date.", 400));
  }

  const data = await Season.create(
    {
      name: name.trim(),
      seasonName: season,
      startDate: startDate,
      endDate: endDate,
      companyId: req.user.company.id,
      createdBy: req.user.id,
      lastModifiedBy: req.user.id,
    },
    { transaction }
  );

  console.log("Season created:", data);
  res.status(201).json({
    status: true,
    message: "Season added successfully",
  });
}, true);

exports.companyFactory = asyncErrorHandler(async (req, res, next) => {
  console.log("Helloooooooo");
  const { id } = req.query;
  console.log(id);

  let details;

  if (id) {
    const companyFactory = await Factory.findOne({
      where: { id: id },
      include: [
        {
          model: Company,
          attributes: ["name"],
        },
        {
          model: State,
          attributes: ["id", "name"],
        },
      ],
    });

    if (!companyFactory) {
      return next(new CustomError("Comapny Factory not found", 404));
    }

    console.log("Company Location details", companyFactory);

    const createdByUser = await User.findOne({
      where: { id: companyFactory.createdBy },
      attributes: ["name"],
    });

    const modifiedByUser = await User.findOne({
      where: { id: companyFactory.lastModifiedBy },
      attributes: ["name"],
    });

    details = {
      factoryId: companyFactory.id,
      factoryName: companyFactory.name,
      stateName: companyFactory.state.name,
      stateId: companyFactory.state.id,
      companyName: companyFactory.company.name,
      createdBy: createdByUser.name,
      lastModifiedBy: modifiedByUser.name,
      createdAt: format(
        new Date(companyFactory.createdAt),
        "dd-MM-yyyy HH:mm:ss"
      ),
      updatedAt: format(
        new Date(companyFactory.updatedAt),
        "dd-MM-yyyy HH:mm:ss"
      ),
    };
  } else {
    const companyFactory = await Factory.findAll({
      where: {
        companyId: req.user.company.id,
      },
      include: [
        {
          model: State,
          attributes: ["id", "name"],
        },
      ],
    });

    console.log(companyFactory);

    if (!companyFactory) {
      return next(new CustomError("Company Factory not found", 404));
    }

    details = companyFactory.map((ele) => {
      const obj = {
        factoryId: ele.id,
        factoryName: ele.name,
        stateId: ele.state.id,
        stateName: ele.state.name,
        createdAt: format(new Date(ele.createdAt), "dd-MM-yyyy"),
        updatedAt: format(new Date(ele.updatedAt), "dd-MM-yyyy"),
      };

      return obj;
    });
  }

  res.status(200).json({
    status: true,
    companyFactories: details,
    message: "Data Fetched Successfully",
  });
});

exports.addFactory = asyncErrorHandler(async (req, res, next, transaction) => {
  const { factoryName, factoryStateId } = req.body;

  if (
    !factoryName ||
    typeof factoryName !== "string" ||
    factoryName.trim() === ""
  ) {
    return next(new CustomError("Invalid Factory Name", 404));
  }

  if (
    !factoryStateId ||
    typeof factoryStateId !== "string" ||
    factoryStateId.trim() === ""
  ) {
    return next(new CustomError("Invalid data", 404));
  }

  const data = await Factory.create(
    {
      name: factoryName.trim(),
      companyId: req.user.companyId,
      stateId: factoryStateId,
      createdBy: req.user.id,
      lastModifiedBy: req.user.id,
    },
    { transaction }
  );

  console.log("Factory created:", data);
  res.status(201).json({
    status: true,
    message: "Factory added successfully",
  });
}, true);

exports.updateFactory = asyncErrorHandler(
  async (req, res, next, transaction) => {
    const { factoryName, factoryId } = req.body;

    console.log(req.body);
    const { id } = req.query;

    if (
      !factoryName ||
      typeof factoryName !== "string" ||
      factoryName.trim() === ""
    ) {
      return next(new CustomError("Invalid Factory Name", 404));
    }

    const [updatedRows] = await Factory.update(
      { name: factoryName.trim(), lastModifiedBy: req.user.id },
      {
        where: { id },
        transaction,
      }
    );

    if (updatedRows === 0) {
      return next(
        new CustomError("Factory not found or no changes made.", 404)
      );
    }

    console.log("Updated factory details:", updatedRows);
    res.status(200).json({
      status: true,
      message: "Factory details updated successfully.",
    });
  },
  true
);

exports.deleteFactory = asyncErrorHandler(
  async (req, res, next, transaction) => {
    const companyFactoryId = req.params.companyFactoryId;

    const factory = await Factory.destroy({
      where: { id: companyFactoryId },
    });

    if (factory === 0) {
      return next(new CustomError("Company Factory not found", 404));
    }

    res.status(200).json({ message: "Factory deleted successfully" });
  },
  true
);

exports.companyGodown = asyncErrorHandler(async (req, res, next) => {
  console.log("Helloooooooo");
  const { id } = req.query;
  console.log(id);

  let details;

  if (id) {
    const companyGodown = await Godown.findOne({
      where: { id: id },
      include: [
        {
          model: Company,
          attributes: ["name"],
        },
        {
          model: State,
          attributes: ["id", "name"],
        },
      ],
    });

    if (!companyGodown) {
      return next(new CustomError("Comapny Godown not found", 404));
    }

    console.log("Company Godown details", companyGodown);

    const createdByUser = await User.findOne({
      where: { id: companyGodown.createdBy },
      attributes: ["name"],
    });

    const modifiedByUser = await User.findOne({
      where: { id: companyGodown.lastModifiedBy },
      attributes: ["name"],
    });

    details = {
      godownId: companyGodown.id,
      godownName: companyGodown.name,
      stateName: companyGodown.state.name,
      stateId: companyGodown.state.id,
      companyName: companyGodown.company.name,
      createdBy: createdByUser.name,
      lastModifiedBy: modifiedByUser.name,
      createdAt: format(
        new Date(companyGodown.createdAt),
        "dd-MM-yyyy HH:mm:ss"
      ),
      updatedAt: format(
        new Date(companyGodown.updatedAt),
        "dd-MM-yyyy HH:mm:ss"
      ),
    };
  } else {
    const companyGodown = await Godown.findAll({
      where: {
        companyId: req.user.company.id,
      },
      include: [
        {
          model: State,
          attributes: ["id", "name"],
        },
      ],
    });

    console.log(companyGodown);

    if (!companyGodown) {
      return next(new CustomError("Company Godown not found", 404));
    }

    details = companyGodown.map((ele) => {
      const obj = {
        godownId: ele.id,
        godownName: ele.name,
        stateId: ele.state.id,
        stateName: ele.state.name,
        createdAt: format(new Date(ele.createdAt), "dd-MM-yyyy"),
        updatedAt: format(new Date(ele.updatedAt), "dd-MM-yyyy"),
      };

      return obj;
    });
  }

  res.status(200).json({
    status: true,
    companyGodowns: details,
    message: "Data Fetched Successfully",
  });
});

exports.addGodown = asyncErrorHandler(async (req, res, next, transaction) => {
  const { godownName, factoryStateId } = req.body;

  if (
    !godownName ||
    typeof godownName !== "string" ||
    godownName.trim() === ""
  ) {
    return next(new CustomError("Invalid Godown Name", 404));
  }

  if (
    !factoryStateId ||
    typeof factoryStateId !== "string" ||
    factoryStateId.trim() === ""
  ) {
    return next(new CustomError("Invalid data", 404));
  }

  const data = await Godown.create(
    {
      name: godownName.trim(),
      companyId: req.user.companyId,
      stateId: factoryStateId,
      createdBy: req.user.id,
      lastModifiedBy: req.user.id,
    },
    { transaction }
  );

  console.log("Godown created:", data);
  res.status(201).json({
    status: true,
    message: "Godown added successfully",
  });
}, true);

exports.updateGodown = asyncErrorHandler(
  async (req, res, next, transaction) => {
    const { godownName, godownId } = req.body;

    console.log(req.body);
    const { id } = req.query;

    if (
      !godownName ||
      typeof godownName !== "string" ||
      godownName.trim() === ""
    ) {
      return next(new CustomError("Invalid godown name", 404));
    }

    const [updatedRows] = await Godown.update(
      { name: godownName.trim(), lastModifiedBy: req.user.id },
      {
        where: { id },
        transaction,
      }
    );

    if (updatedRows === 0) {
      return next(new CustomError("Godown not found or no changes made.", 404));
    }

    console.log("Updated godown details:", updatedRows);
    res.status(200).json({
      status: true,
      message: "Godown details updated successfully.",
    });
  },
  true
);

exports.deleteGodown = asyncErrorHandler(
  async (req, res, next, transaction) => {
    const companyGodownId = req.params.companyGodownId;

    const godown = await Godown.destroy({
      where: { id: companyGodownId },
    });

    if (godown === 0) {
      return next(new CustomError("Company Godown not found", 404));
    }

    res.status(200).json({ message: "Godown deleted successfully" });
  },
  true
);

exports.companyTrader = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.query;
  console.log(id);

  let details;

  if (id) {
    const companyTrader = await Trader.findOne({
      where: { id: id },
      include: [
        {
          model: Company,
          attributes: ["name"],
        },
      ],
    });

    if (!companyTrader) {
      return next(new CustomError("Comapny Trader not found", 404));
    }

    console.log("Company Trader details", companyTrader);

    const createdByUser = await User.findOne({
      where: { id: companyTrader.createdBy },
      attributes: ["name"],
    });

    const modifiedByUser = await User.findOne({
      where: { id: companyTrader.lastModifiedBy },
      attributes: ["name"],
    });

    details = {
      traderId: companyTrader.id,
      traderName: companyTrader.name,
      companyName: companyTrader.company.name,
      createdBy: createdByUser.name,
      lastModifiedBy: modifiedByUser.name,
      createdAt: format(
        new Date(companyTrader.createdAt),
        "dd-MM-yyyy HH:mm:ss"
      ),
      updatedAt: format(
        new Date(companyTrader.updatedAt),
        "dd-MM-yyyy HH:mm:ss"
      ),
    };
  } else {
    const companyTrader = await Trader.findAll({
      where: {
        companyId: req.user.company.id,
      },
    });

    if (!companyTrader) {
      return next(new CustomError("Company Trader not found", 404));
    }

    details = companyTrader.map((ele) => {
      const obj = {
        traderId: ele.id,
        traderName: ele.name,
        createdAt: format(new Date(ele.createdAt), "dd-MM-yyyy"),
        updatedAt: format(new Date(ele.updatedAt), "dd-MM-yyyy"),
      };

      return obj;
    });
  }

  res.status(200).json({
    status: true,
    companyTraders: details,
    message: "Data Fetched Successfully",
  });
});

exports.addTrader = asyncErrorHandler(async (req, res, next, transaction) => {
  const { traderName } = req.body;

  if (
    !traderName ||
    typeof traderName !== "string" ||
    traderName.trim() === ""
  ) {
    return next(new CustomError("Invalid Trader Name", 404));
  }

  const data = await Trader.create(
    {
      name: traderName.trim(),
      companyId: req.user.companyId,
      createdBy: req.user.id,
      lastModifiedBy: req.user.id,
    },
    { transaction }
  );

  console.log("Trader created:", data);
  res.status(201).json({
    status: true,
    message: "Trader added successfully",
  });
}, true);

exports.updateTrader = asyncErrorHandler(
  async (req, res, next, transaction) => {
    const { traderName, traderId } = req.body;

    console.log(req.body);
    const { id } = req.query;

    if (
      !traderName ||
      typeof traderName !== "string" ||
      traderName.trim() === ""
    ) {
      return next(new CustomError("Invalid trader Name", 404));
    }

    const [updatedRows] = await Trader.update(
      { name: traderName.trim(), lastModifiedBy: req.user.id },
      {
        where: { id },
        transaction,
      }
    );

    if (updatedRows === 0) {
      return next(new CustomError("Trader not found or no changes made.", 404));
    }

    console.log("Updated trader details:", updatedRows);
    res.status(200).json({
      status: true,
      message: "Trader details updated successfully.",
    });
  },
  true
);

exports.deleteTrader = asyncErrorHandler(
  async (req, res, next, transaction) => {
    const companyTraderId = req.params.companyTraderId;

    const trader = await Trader.destroy({
      where: { id: companyTraderId },
    });

    if (trader === 0) {
      return next(new CustomError("Company trader not found", 404));
    }

    res.status(200).json({ message: "Trader deleted successfully" });
  },
  true
);

exports.companyUser = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.query;
  console.log(id);

  let details;

  if (id) {
    const companyUser = await User.findOne({
      where: { id: id },
      include: [
        {
          model: Company,
          attributes: ["name"],
        },
        {
          model: Role,
          attributes: ["id", "name"],
        },
      ],
    });

    if (!companyUser) {
      return next(new CustomError("User not found", 404));
    }

    // console.log("Company User details", companyUser);

    // const createdByUser = await User.findOne({
    //   where: { id: companyUser.createdBy },
    //   attributes: ["name"],
    // });

    // const modifiedByUser = await User.findOne({
    //   where: { id: companyUser.lastModifiedBy },
    //   attributes: ["name"],
    // });

    // if (companyUser.isActive) {
    //   companyUser.isActive = "&#10003;";
    // } else {
    //   companyUser.isActive = "";
    // }

    details = {
      userId: companyUser.id,
      userName: companyUser.name,
      companyName: companyUser.company.name,
      email: companyUser.email,
      phone: companyUser.phone,
      roleId: companyUser.role.id,
      role: companyUser.role.name,
      isActive: companyUser.isActive,
      isFreezed: companyUser.isFreezed,
      createdAt: format(new Date(companyUser.createdAt), "dd-MM-yyyy HH:mm:ss"),
      updatedAt: format(new Date(companyUser.updatedAt), "dd-MM-yyyy HH:mm:ss"),
    };
  } else {
    // console.log("000000", req.user);
    const companyUser = await User.findAll({
      where: {
        companyId: req.user.company.id,
      },

      include: [
        {
          model: Company,
          attributes: ["name"],
        },
        {
          model: Role,
          attributes: ["id", "name"],
        },
      ],
    });

    if (!companyUser) {
      return next(new CustomError("No users found", 404));
    }

    details = companyUser.map((ele) => {
      // if (ele.isActive) {
      //   ele.isActive = "&#10003;";
      // } else {
      //   ele.isActive = "";
      // }
      const obj = {
        userId: ele.id,
        userName: ele.name,
        email: ele.email,
        role: ele.role.name,
        isActive: ele.isActive,
        createdAt: format(new Date(ele.createdAt), "dd-MM-yyyy"),
        updatedAt: format(new Date(ele.updatedAt), "dd-MM-yyyy"),
      };

      return obj;
    });
  }

  res.status(200).json({
    status: true,
    companyUsers: details,
    message: "Data Fetched Successfully",
  });
});

exports.addUser = asyncErrorHandler(async (req, res, next, transaction) => {
  // Validate input using Joi
  const { error } = userValidationSchema.validate(req.body, {
    abortEarly: true,
  });

  if (error) {
    // Return all validation errors
    const errors = error.details.map((err) => err.message);
    console.log(errors);
    return next(new CustomError(errors[0], 400));
  }
  const { Name, Email, Phone, Password, userRoleId } = req.body;

  const existingEmail = await User.findOne({
    where: { email: Email, isActive: true },
  });

  if (existingEmail) {
    return next(new CustomError("Email already exists", 400));
  }

  // Check if the phone number already exists
  const existingPhone = await User.findOne({
    where: { phone: Phone, isActive: true },
  });

  if (existingPhone) {
    return next(new CustomError("Phone number already exists", 400));
  }

  const role = await Role.findOne({ where: { id: userRoleId } });

  console.log(role);

  let activeUser;

  if (role.name === "Normal User") {
    activeUser = +req.user.company.activeNormalUsers + 1;

    if (activeUser > req.user.company.license.maxNormalUsers) {
      return next(
        new CustomError(
          "Maximum number of Normal Users reached. You cannot create any more users with the 'Normal User' role under the current license.",
          400
        )
      );
    }
    const [updatedRows] = await Company.update(
      {
        activeNormalUsers: activeUser,
      },
      {
        where: { id: req.user.company.id },
        transaction,
      }
    );

    if (updatedRows === 0) {
      return next(new CustomError("Company not found.", 404));
    }
  } else if (role.name === "Sub-Admin") {
    activeUser = +req.user.company.activeSubAdmin + 1;

    if (activeUser > req.user.company.license.maxSubAdmin) {
      return next(
        new CustomError(
          "Maximum number of Sub-Admin reached. You cannot create any more users with the 'Sub-Admin' role under the current license.",
          400
        )
      );
    }

    const [updatedRows] = await Company.update(
      {
        activeSubAdmin: activeUser,
      },
      {
        where: { id: req.user.company.id },
        transaction,
      }
    );

    if (updatedRows === 0) {
      return next(new CustomError("Company not found.", 404));
    }
  } else if (role.name === "Accounts") {
    activeUser = +req.user.company.activeAccounts + 1;

    if (activeUser > req.user.company.license.maxAccounts) {
      return next(
        new CustomError(
          "Maximum number of Accounts reached. You cannot create any more users with the 'Accounts' role under the current license.",
          400
        )
      );
    }

    const [updatedRows] = await Company.update(
      {
        activeAccounts: activeUser,
      },
      {
        where: { id: req.user.company.id },
        transaction,
      }
    );

    if (updatedRows === 0) {
      return next(new CustomError("Company not found.", 404));
    }
  }

  console.log("******add user role****", role);

  // Hash the password using bcrypt with async/await
  const hash = await bcrypt.hash(Password, 10);

  const user = await User.create(
    {
      name: Name,
      email: Email,
      phone: Phone,
      password: hash,
      roleId: userRoleId,
      companyId: req.user.companyId,
      isActive: true,
    },
    { transaction }
  );

  res.status(201).json({
    status: true,
    message: "User Created Successfully",
  });
}, true);

exports.updateUser = async (req, res, next) => {
  // Joi validation schema
  const userValidationSchema = Joi.object({
    Name: Joi.string().trim().min(3).max(100).required().messages({
      "string.empty": "Name is required",
      "string.min": "Name must be at least 3 characters",
      "string.max": "Name must not exceed 100 characters",
    }),
    Email: Joi.string().email().required().messages({
      "string.email": "Please provide a valid email",
      "string.empty": "Email is required",
    }),
    Phone: Joi.string()
      .pattern(/^[6-9]\d{9}$/) // Indian phone numbers: starts with 6-9 followed by 9 digits
      .length(10) // Ensures the phone number is exactly 10 digits long
      .required()
      .messages({
        "string.pattern.base": "Invalid Phone Number",
        "string.length": "Phone number must be exactly 10 digits long",
        "string.empty": "Phone is required",
      }),
    userRoleId: Joi.string().trim().required().messages({
      "string.empty": "Role ID is required",
    }),
  });

  // Validate input using Joi
  const { error } = userValidationSchema.validate(req.body, {
    abortEarly: true,
  });

  if (error) {
    return next(new CustomError(error.details[0].message, 400));
  }

  const { id } = req.query;
  const { Name, Email, Phone, userRoleId } = req.body;

  // Start a transaction
  const transaction = await sequelize.transaction();

  try {
    // Check if email or phone already exists (excluding the current user)
    const existingEmail = await User.findOne({
      where: { email: Email, id: { [Op.ne]: id } },
      transaction,
    });

    if (existingEmail) {
      await transaction.rollback();
      return next(new CustomError("Email already exists", 400));
    }

    const existingPhone = await User.findOne({
      where: { phone: Phone, id: { [Op.ne]: id } },
      transaction,
    });

    if (existingPhone) {
      await transaction.rollback();
      return next(new CustomError("Phone number already exists", 400));
    }

    // Fetch the current user along with role and company details
    const user = await User.findOne({
      where: { id },
      include: [
        { model: Role, attributes: ["id", "name"] },
        {
          model: Company,
          attributes: [
            "id",
            "name",
            "activeSubAdmin",
            "activeAccounts",
            "activeNormalUsers",
          ],
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
      transaction,
    });

    if (!user) {
      await transaction.rollback();
      return next(new CustomError("User not found.", 404));
    }
    console.log("***userRole****", user.role);

    const currentRole = user.role.name; // User's current role
    const company = user.company; // User's company
    const role = await Role.findOne({ where: { id: userRoleId } });

    if (!role) {
      await transaction.rollback();
      return next(new CustomError("Invalid role specified.", 400));
    }

    // If role is changing, adjust active user counts
    if (currentRole !== role.name) {
      // Decrease count for old role
      if (currentRole === "Normal User" && company.activeNormalUsers > 0) {
        await Company.update(
          { activeNormalUsers: company.activeNormalUsers - 1 },
          { where: { id: company.id }, transaction }
        );
      } else if (currentRole === "Sub-Admin" && company.activeSubAdmin > 0) {
        await Company.update(
          { activeSubAdmin: company.activeSubAdmin - 1 },
          { where: { id: company.id }, transaction }
        );
      } else if (currentRole === "Accounts" && company.activeAccounts > 0) {
        await Company.update(
          { activeAccounts: company.activeAccounts - 1 },
          { where: { id: company.id }, transaction }
        );
      }

      // Increase count for new role
      if (role.name === "Normal User") {
        if (company.activeNormalUsers + 1 > company.license.maxNormalUsers) {
          await transaction.rollback();
          return next(
            new CustomError(
              "Maximum number of Normal Users reached. You cannot assign this role.",
              400
            )
          );
        }
        await Company.update(
          { activeNormalUsers: company.activeNormalUsers + 1 },
          { where: { id: company.id }, transaction }
        );
      } else if (role.name === "Sub-Admin") {
        if (company.activeSubAdmin + 1 > company.license.maxSubAdmin) {
          await transaction.rollback();
          return next(
            new CustomError(
              "Maximum number of Sub-Admins reached. You cannot assign this role.",
              400
            )
          );
        }
        await Company.update(
          { activeSubAdmin: company.activeSubAdmin + 1 },
          { where: { id: company.id }, transaction }
        );
      } else if (role.name === "Accounts") {
        if (company.activeAccounts + 1 > company.license.maxAccounts) {
          await transaction.rollback();
          return next(
            new CustomError(
              "Maximum number of Accounts reached. You cannot assign this role.",
              400
            )
          );
        }
        await Company.update(
          { activeAccounts: company.activeAccounts + 1 },
          { where: { id: company.id }, transaction }
        );
      }
    }

    // Update the user role
    const [updatedRows] = await User.update(
      { name: Name, email: Email, phone: Phone, roleId: userRoleId },
      { where: { id }, transaction }
    );

    if (updatedRows === 0) {
      await transaction.rollback();
      return next(new CustomError("User not found or no changes made.", 404));
    }

    // Commit the transaction if everything succeeds
    await transaction.commit();

    res
      .status(200)
      .json({ status: true, message: "User updated successfully" });
  } catch (error) {
    await transaction.rollback();
    console.error("Error in updateUser function:", error);

    next(new CustomError("An error occurred while updating the user.", 500));
  }
};

exports.updateUserPassword = asyncErrorHandler(
  async (req, res, next, transaction) => {
    const { password } = req.body;

    console.log(req.body);
    const { id } = req.query;

    // Joi validation schema
    const userValidationSchema = Joi.object({
      password: Joi.string()
        .min(8)
        .max(50)
        .pattern(
          /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
        )
        .required()
        .messages({
          "string.min": "Password must be at least 8 characters long",
          "string.max": "Password must not exceed 30 characters",
          "string.pattern.base":
            "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
          "string.empty": "Password is required",
        }),
    });

    // Validate input using Joi
    const { error } = userValidationSchema.validate(req.body, {
      abortEarly: true,
    });

    if (error) {
      return next(new CustomError(error.details[0].message, 400));
    }

    const hash = await bcrypt.hash(password, 10);

    const [updatedRows] = await User.update(
      { password: hash },
      {
        where: { id },
        transaction,
      }
    );

    if (updatedRows === 0) {
      return next(new CustomError("User not found or no changes made.", 404));
    }

    res.status(200).json({
      status: true,
      message: "Password changed successfully",
    });
  },
  true
);

exports.freezeUser = asyncErrorHandler(async (req, res, next, transaction) => {
  console.log(req.body);
  const { id } = req.query;
  let { value } = req.body;
  console.log("0000000free", typeof value);

  if (value === "true") {
    value = true;
  } else {
    value = false;
  }

  console.log("99999", value, typeof value);
  console.log(id);
  const user = await User.findOne({ id });
  console.log("8888888", user);
  const [updatedRows] = await User.update(
    { isFreezed: value },
    {
      where: { id },
      transaction,
    }
  );

  if (updatedRows === 0) {
    return next(new CustomError("User not found or no changes made.", 404));
  }

  let message;
  if (value === true) {
    message = `User freezed successfully`;
  } else {
    message = `User unfreezed successfully`;
  }

  res.status(200).json({
    status: true,
    message: message,
  });
}, true);

exports.activeUser = async (req, res, next) => {
  const { id } = req.query;
  let { value } = req.body;

  const transaction = await sequelize.transaction();
  try {
    // Fetch the current user along with role and company details
    const user = await User.findOne({
      where: { id },
      include: [
        { model: Role, attributes: ["id", "name"] },
        {
          model: Company,
          attributes: [
            "id",
            "name",
            "activeSubAdmin",
            "activeAccounts",
            "activeNormalUsers",
          ],
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
      transaction,
    });

    if (!user) {
      await transaction.rollback();
      return next(new CustomError("User not found.", 404));
    }

    const currentRole = user.role.name;
    const company = user.company;

    if (value === "true") {
      value = true;

      // Increase count for new role
      if (currentRole === "Normal User") {
        if (company.activeNormalUsers + 1 > company.license.maxNormalUsers) {
          await transaction.rollback();
          return next(
            new CustomError(
              "Maximum number of Normal Users reached. You cannot assign this role.To activate this user please deactivate another user with same role or upgrade your license.",
              400
            )
          );
        }
        await Company.update(
          { activeNormalUsers: company.activeNormalUsers + 1 },
          { where: { id: company.id }, transaction }
        );
      } else if (currentRole === "Sub-Admin") {
        if (company.activeSubAdmin + 1 > company.license.maxSubAdmin) {
          await transaction.rollback();
          return next(
            new CustomError(
              "Maximum number of Sub-Admins reached. You cannot assign this role.To activate this user please deactivate another user with same role or upgrade your license.",
              400
            )
          );
        }
        await Company.update(
          { activeSubAdmin: company.activeSubAdmin + 1 },
          { where: { id: company.id }, transaction }
        );
      } else if (currentRole === "Accounts") {
        if (company.activeAccounts + 1 > company.license.maxAccounts) {
          await transaction.rollback();
          return next(
            new CustomError(
              "Maximum number of Accounts reached. You cannot assign this role.To activate this user please deactivate another user with same role or upgrade your license.",
              400
            )
          );
        }
        await Company.update(
          { activeAccounts: company.activeAccounts + 1 },
          { where: { id: company.id }, transaction }
        );
      }
    } else {
      value = false;
      // Decrease count for old role
      if (currentRole === "Normal User" && company.activeNormalUsers > 0) {
        await Company.update(
          { activeNormalUsers: company.activeNormalUsers - 1 },
          { where: { id: company.id }, transaction }
        );
      } else if (currentRole === "Sub-Admin" && company.activeSubAdmin > 0) {
        await Company.update(
          { activeSubAdmin: company.activeSubAdmin - 1 },
          { where: { id: company.id }, transaction }
        );
      } else if (currentRole === "Accounts" && company.activeAccounts > 0) {
        await Company.update(
          { activeAccounts: company.activeAccounts - 1 },
          { where: { id: company.id }, transaction }
        );
      }
    }

    const [updatedRows] = await User.update(
      { isActive: value },
      {
        where: { id },
        transaction,
      }
    );

    if (updatedRows === 0) {
      return next(new CustomError("User not found or no changes made.", 404));
    }

    // Commit the transaction
    await transaction.commit();

    let message;
    if (value === true) {
      message = `User activated successfully`;
    } else {
      message = `User deactivated successfully`;
    }

    res.status(200).json({
      status: true,
      message: message,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error in updateUser function:", error);

    next(new CustomError("An error occurred while updating the user.", 500));
  }
};

exports.profileInfo = asyncErrorHandler(async (req, res, next) => {
  const userInfo = {
    userName: req.user.name,
    email: req.user.email,
    phone: req.user.phone,
    role: req.user.role.name,
    company: req.user.company.name,
  };

  // console.log(userinfo);

  res.status(200).json({
    status: true,
    userInfo: userInfo,
    message: "Data Fetched Successfully",
  });
});

exports.profileResetPassword = asyncErrorHandler(
  async (req, res, next, transaction) => {
    const { oldPassword, newPassword, cPassword } = req.body;

    const match = await bcrypt.compare(oldPassword, req.user.password);

    if (!match) {
      return next(new CustomError("Incorrect password", 400));
    }

    if (newPassword !== cPassword) {
      return next(
        new CustomError(
          "New Password and Confirm Password do not match. Please try again.",
          400
        )
      );
    }

    console.log(req.body);

    // Joi validation schema
    const userValidationSchema = Joi.object({
      password: Joi.string()
        .min(8)
        .max(50)
        .pattern(
          /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
        )
        .required()
        .messages({
          "string.min": "Password must be at least 8 characters long",
          "string.max": "Password must not exceed 30 characters",
          "string.pattern.base":
            "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
          "string.empty": "Password is required",
        }),
    });

    // Validate input using Joi
    const { error } = userValidationSchema.validate(
      { password: newPassword },
      {
        abortEarly: true,
      }
    );

    if (error) {
      return next(new CustomError(error.details[0].message, 400));
    }

    const hash = await bcrypt.hash(newPassword, 10);

    const [updatedRows] = await User.update(
      { password: hash },
      {
        where: { id: req.user.id },
        transaction,
      }
    );

    if (updatedRows === 0) {
      return next(new CustomError("User not found or no changes made.", 404));
    }

    res.status(200).json({
      status: true,
      message: "Password changed successfully",
    });
  },
  true
);

exports.companyMandi = asyncErrorHandler(async (req, res, next) => {
  const companyId = req.user.company.id;

  const companyLocation = await CompanyLocation.findAll({
    where: {
      companyId: companyId,
    },
    include: [
      {
        model: CompanyDistrict,
        include: [
          {
            model: District,
            attributes: ["id"],
            include: [
              {
                model: Mandi,
                attributes: ["id", "name"],
              },
            ],
          },
        ],
      },
    ],
  });

  if (companyLocation.length === 0) {
    return next(
      new CustomError(
        "No company location added. Please contact the admin to add company location",
        404
      )
    );
  }

  // console.log("company***************", companyLocation);

  // const { id } = req.query;
  // console.log(id);

  // let details;

  // if (id) {
  //   const companyLocation = await CompanyLocation.findOne({
  //     where: { id: id },
  //     include: [
  //       {
  //         model: Company,
  //         attributes: ["name"],
  //       },
  //       {
  //         model: State,
  //         attributes: ["id", "name"],
  //       },
  //       {
  //         model: CompanyDistrict,
  //         include: [
  //           {
  //             model: District,
  //             attributes: ["id", "name"], // Fetch only necessary fields
  //           },
  //         ],
  //       },
  //     ],
  //   });

  //   if (!companyLocation) {
  //     return next(new CustomError("Company location not found", 404));
  //   }

  //   console.log("Company Location details", companyLocation);

  //   details = {
  //     companyLocationId: companyLocation.id,
  //     state: companyLocation.state.name,
  //     stateId: companyLocation.state.id,
  //     districts: companyLocation.company_districts.map((entry) => ({
  //       id: entry.district.id,
  //       name: entry.district.name,
  //     })),
  //     createdAt: format(
  //       new Date(companyLocation.createdAt),
  //       "dd-MM-yyyy HH:mm:ss"
  //     ),
  //     updatedAt: format(
  //       new Date(companyLocation.updatedAt),
  //       "dd-MM-yyyy HH:mm:ss"
  //     ),
  //   };
  // } else {
  //   const companyLocation = await CompanyLocation.findAll({
  //     where: {
  //       companyId: req.user.company.id,
  //     },
  //     include: [
  //       {
  //         model: State,
  //         attributes: ["id", "name"],
  //       },
  //     ],
  //   });

  //   if (!companyLocation) {
  //     return next(new CustomError("Company location not found", 404));
  //   }

  //   details = companyLocation.map((ele) => {
  //     const obj = {
  //       id: ele.id,
  //       companyId: ele.companyId,
  //       stateName: ele.state.name,
  //       createdAt: format(new Date(ele.createdAt), "dd-MM-yyyy"),
  //       updatedAt: format(new Date(ele.updatedAt), "dd-MM-yyyy"),
  //     };

  //     return obj;
  //   });
  // }

  const companyMandi = [];

  companyLocation.map((cl) => {
    cl.company_districts.map((cd) => {
      cd.district.mandis.map((ele) => {
        companyMandi.push(ele);
      });
    });
  });

  res.status(200).json({
    status: true,
    companyMandi,
    message: "Data Fetched Successfully",
  });
});

exports.companyDepot = asyncErrorHandler(async (req, res, next) => {
  const companyId = req.user.company.id;

  const companyLocation = await CompanyLocation.findAll({
    where: {
      companyId: companyId,
    },
    include: [
      {
        model: CompanyDistrict,
        include: [
          {
            model: District,
            attributes: ["id"],
            include: [
              {
                model: Depot,
                attributes: ["id", "name"],
              },
            ],
          },
        ],
      },
    ],
  });

  if (companyLocation.length === 0) {
    return next(
      new CustomError(
        "No company location added. Please contact the admin to add company location",
        404
      )
    );
  }

  const companyDepot = [];

  companyLocation.map((cl) => {
    cl.company_districts.map((cd) => {
      cd.district.depots.map((ele) => {
        companyDepot.push(ele);
      });
    });
  });

  res.status(200).json({
    status: true,
    companyDepot,
    message: "Data Fetched Successfully",
  });
});

exports.masterTarget = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.query;
  console.log(id);

  let details;

  if (id) {
    const masterTarget = await MasterTarget.findOne({
      where: { id: id },
      include: [
        {
          model: Company,
          attributes: ["id", "name"],
        },
        {
          model: Season,
          attributes: ["id", "name"],
        },
      ],
    });

    if (!masterTarget) {
      return next(new CustomError("Master Target not found", 404));
    }

    console.log("Master target details", masterTarget);

    const createdByUser = await User.findOne({
      where: { id: masterTarget.createdBy },
      attributes: ["name"],
    });

    const modifiedByUser = await User.findOne({
      where: { id: masterTarget.lastModifiedBy },
      attributes: ["name"],
    });

    details = {
      id: masterTarget.id,
      mandiName: masterTarget.mandiName,
      seasonName: masterTarget.season.name,
      targetQtls: masterTarget.targetQtls,
      liftedQauntity: masterTarget.liftedQauntity,
      targetBalance: masterTarget.targetBalance,
      companyName: masterTarget.company.name,
      createdBy: createdByUser.name,
      lastModifiedBy: modifiedByUser.name,
      createdAt: format(
        new Date(masterTarget.createdAt),
        "dd-MM-yyyy HH:mm:ss"
      ),
      updatedAt: format(
        new Date(masterTarget.updatedAt),
        "dd-MM-yyyy HH:mm:ss"
      ),
    };
  } else {
    const masterTarget = await MasterTarget.findAll({
      where: {
        companyId: req.user.company.id,
      },
      include: [
        {
          model: Company,
          attributes: ["id", "name"],
        },
      ],
    });

    if (!masterTarget) {
      return next(new CustomError("Master target not found", 404));
    }

    details = masterTarget.map((ele) => {
      const obj = {
        id: ele.id,
        mandiName: ele.mandiName,
        targetQtls: ele.targetQtls,
        targetBalance: ele.targetBalance,
        createdAt: format(new Date(ele.createdAt), "dd-MM-yyyy"),
        updatedAt: format(new Date(ele.updatedAt), "dd-MM-yyyy"),
      };

      return obj;
    });
  }

  res.status(200).json({
    status: true,
    masterTarget: details,
    message: "Data Fetched Successfully",
  });
});

exports.addMasterTarget = asyncErrorHandler(
  async (req, res, next, transaction) => {
    let { comapanyMandiId, companySeasonId, targetQtls } = req.body;
    const companyId = req.user.companyId;
    const userId = req.user.id;
    targetQtls = +targetQtls;

    const mandi = await Mandi.findOne({
      where: { id: comapanyMandiId },
    });

    if (!mandi) {
      return next(new CustomError("Mandi not found", 404));
    }

    if (isNaN(targetQtls) || targetQtls === "") {
      return next(new CustomError("Invalid Quantity", 404));
    }

    const masterTarget = await MasterTarget.create(
      {
        mandiId: comapanyMandiId,
        seasonId: companySeasonId,
        mandiName: mandi.name,
        targetQtls: targetQtls,
        liftedQauntity: 0.0,
        targetBalance: targetQtls,
        companyId: companyId,
        createdBy: userId,
        lastModifiedBy: userId,
      },
      { transaction }
    );

    res.status(200).json({ message: "Master target added  successfully." });
  },
  true
);

exports.updateMasterTarget = asyncErrorHandler(
  async (req, res, next, transaction) => {
    let { targetQtls } = req.body;
    const { id } = req.query;
    const userId = req.user.id;
    targetQtls = +targetQtls;

    if (isNaN(targetQtls) || targetQtls === "") {
      return next(new CustomError("Invalid Quantity", 404));
    }

    const oldMasterTarget = await MasterTarget.findOne({ where: { id: id } });

    if (oldMasterTarget.targetQtls > targetQtls) {
      return next(
        new CustomError(
          "Invalid Quantity. New target quantity cannot be less than old target quantity.",
          404
        )
      );
    }

    const masterTarget = await MasterTarget.update(
      {
        targetQtls: targetQtls,
        targetBalance: targetQtls - oldMasterTarget.liftedQauntity,
        lastModifiedBy: userId,
      },
      {
        where: { id },
        transaction,
      }
    );

    res.status(200).json({ message: "Master target updated successfully." });
  },
  true
);

exports.showcompanyFactory = asyncErrorHandler(async (req, res, next) => {
  const companyId = req.user.company.id;

  const companyFactory = await Factory.findAll({
    where: {
      companyId: companyId,
    },
  });

  if (companyFactory.length === 0) {
    return next(
      new CustomError(
        "No company factory added. Please contact the admin to add factory for procedding further.",
        404
      )
    );
  }

  res.status(200).json({
    status: true,
    companyFactory,
    message: "Data Fetched Successfully",
  });
});

exports.addPaddyPurchase = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const {
      companyMandiId,
      companyFactoryId,
      companySeasonId,
      purchaseQtlsGross,
      gunnyBags,
      ppBags,
      bagWeight,
      faqQtls,
    } = req.body;
    const companyId = req.user.companyId;
    const userId = req.user.id;

    // console.log(req.body);
    // console.log("upload hisab", req.file);

    const mandi = await Mandi.findOne({
      where: { id: companyMandiId },
    });

    if (!mandi) {
      return next(new CustomError("Mandi not found", 404));
    }

    const factory = await Factory.findOne({
      where: { id: companyFactoryId },
    });

    if (!factory) {
      return next(new CustomError("Factory not found", 404));
    }

    const season = await Season.findOne({
      where: { id: companySeasonId },
    });

    if (!season) {
      return next(new CustomError("Season not found", 404));
    }

    // console.log(mandi, factory);

    // console.log("forms_addMandiPurchaseData", req.body);

    if (
      purchaseQtlsGross.trim() === "" ||
      isNaN(purchaseQtlsGross) ||
      +purchaseQtlsGross < 0 ||
      gunnyBags.trim() === "" ||
      isNaN(gunnyBags) ||
      +gunnyBags < 0 ||
      ppBags.trim() === "" ||
      isNaN(ppBags) ||
      +ppBags < 0 ||
      bagWeight.trim() === "" ||
      isNaN(bagWeight) ||
      +bagWeight < 0 ||
      faqQtls.trim() === "" ||
      isNaN(faqQtls) ||
      +faqQtls < 0 ||
      !req.file
    ) {
      return next(new CustomError("Bad Parameter. Invalid Entry !", 400));
    }
    // Decode the service account key from an environment variable
    const keyContent = Buffer.from(
      process.env.GOOGLE_SERVICE_ACCOUNT_KEY,
      "base64"
    ).toString("utf-8");

    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(keyContent),
      scopes: ["https://www.googleapis.com/auth/drive.file"],
    });

    const drive = google.drive({ version: "v3", auth });

    const filePath = req.file.path;
    const fileName = req.file.originalname;

    // Upload to Google Drive
    const fileMetadata = {
      name: fileName,
      parents: ["1XfXjO9pkNDn30gBir8p4R1l1IG9Jnu5-"],
    };
    const media = {
      mimeType: req.file.mimetype,
      body: fs.createReadStream(filePath),
    };

    const driveResponse = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: "id",
    });

    // Get file URL
    const fileId = driveResponse.data.id;
    drive.permissions.create({
      fileId,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });

    const fileUrl = `https://drive.google.com/uc?id=${fileId}`;

    const nettPurchaseQtyQtls = +purchaseQtlsGross - +bagWeight - +faqQtls;
    const purBags = +gunnyBags + +ppBags;

    const oldMasterTarget = await MasterTarget.findOne({
      where: {
        [Op.and]: [
          { mandiId: companyMandiId },
          { seasonId: companySeasonId }, // Add more conditions here
        ],
      },
    });

    if (!oldMasterTarget) {
      return next(
        new CustomError(
          `No master target have been added for  mandi : ${mandi.name}. Please add master target for the mandi for proceeding further.`,
          400
        )
      );
    }

    const data = await PaddyPurchase.create(
      {
        mandiName: mandi.name,
        purchaseQtlsGross: Number(purchaseQtlsGross),
        gunnyBags: +gunnyBags,
        ppBags: +ppBags,
        bagWeight: Number(bagWeight),
        faqQtls: Number(faqQtls),
        purBags: purBags,
        nettPurchaseQtyQtls: Number(nettPurchaseQtyQtls),
        uploadHisab: fileUrl,
        companyId: companyId,
        factoryId: companyFactoryId,
        mandiId: companyMandiId,
        seasonId: companySeasonId,
        createdBy: userId,
        lastModifiedBy: userId,
      },
      { transaction }
    );

    const liftedQauntity =
      Number(oldMasterTarget.liftedQauntity) + Number(nettPurchaseQtyQtls);

    const targetBalance =
      Number(oldMasterTarget.targetQtls) - Number(liftedQauntity);

    if (targetBalance < 0) {
      return next(
        new CustomError(
          "Total paddy purchase can not exceed the master target for the mandi",
          400
        )
      );
    }

    const masterUpdate = await MasterTarget.update(
      { liftedQauntity: liftedQauntity, targetBalance: targetBalance },
      { where: { id: oldMasterTarget.id }, transaction }
    );

    // Delete the file from local uploads folder
    fs.unlinkSync(filePath);
    await transaction.commit();
    res
      .status(201)
      .json({ message: "Paddy purchase form data submitted successfully" });
  } catch (error) {
    await transaction.rollback();
    console.error("Error in adding paddy purchase form data", error);

    next(
      new CustomError(
        "An error occurred while addding paddy purchase form data",
        500
      )
    );
  }
};

exports.paddyPurchase = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.query;
  // console.log(id);

  let details;

  if (id) {
    const paddyPurchase = await PaddyPurchase.findOne({
      where: { id: id },
      include: [
        {
          model: Company,
          attributes: ["id", "name"],
        },
        {
          model: Factory,
          attributes: ["id", "name"],
        },
        {
          model: Mandi,
          attributes: ["id", "name"],
        },
        {
          model: Season,
          attributes: ["id", "name"],
        },
      ],
    });

    if (!paddyPurchase) {
      return next(new CustomError("Paddy purchase not found.", 404));
    }

    // console.log("paddy purchase details", paddyPurchase);

    const createdByUser = await User.findOne({
      where: { id: paddyPurchase.createdBy },
      attributes: ["name"],
    });

    const modifiedByUser = await User.findOne({
      where: { id: paddyPurchase.lastModifiedBy },
      attributes: ["name"],
    });

    details = {
      id: paddyPurchase.id,
      mandiName: paddyPurchase.mandiName,
      factoryName: paddyPurchase.factory.name,
      seasonName: paddyPurchase.season.name,
      purchaseQtlsGross: paddyPurchase.purchaseQtlsGross,
      gunnyBags: paddyPurchase.gunnyBags,
      ppBags: paddyPurchase.ppBags,
      bagWeight: paddyPurchase.bagWeight,
      faqQtls: paddyPurchase.faqQtls,
      purBags: paddyPurchase.purBags,
      nettPurchaseQtyQtls: paddyPurchase.nettPurchaseQtyQtls,
      uploadHisab: paddyPurchase.uploadHisab,
      companyName: paddyPurchase.company.name,
      createdBy: createdByUser.name,
      lastModifiedBy: modifiedByUser.name,
      createdAt: format(
        new Date(paddyPurchase.createdAt),
        "dd-MM-yyyy HH:mm:ss"
      ),
      updatedAt: format(
        new Date(paddyPurchase.updatedAt),
        "dd-MM-yyyy HH:mm:ss"
      ),
    };
  } else {
    const paddyPurchase = await PaddyPurchase.findAll({
      where: {
        companyId: req.user.company.id,
      },
      include: [
        {
          model: Company,
          attributes: ["id", "name"],
        },
        {
          model: Factory,
          attributes: ["id", "name"],
        },
        {
          model: Mandi,
          attributes: ["id", "name"],
        },
        {
          model: Season,
          attributes: ["id", "name"],
        },
      ],
    });

    if (!paddyPurchase) {
      return next(new CustomError("Paddy Purchase not found", 404));
    }

    details = paddyPurchase.map((ele) => {
      const obj = {
        id: ele.id,
        date: format(new Date(ele.createdAt), "dd-MM-yyyy"),
        mandiName: ele.mandiName,
        seasonName: ele.season.name,
        factoryName: ele.factory.name,
        nettPurchaseQtyQtls: ele.nettPurchaseQtyQtls,
      };

      return obj;
    });
  }

  res.status(200).json({
    status: true,
    paddyPurchase: details,
    message: "Data Fetched Successfully",
  });
});

exports.updatePaddyPurchase = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const { purchaseQtlsGross, gunnyBags, ppBags, bagWeight, faqQtls } =
      req.body;

    const { id } = req.query;

    if (
      purchaseQtlsGross.trim() === "" ||
      isNaN(purchaseQtlsGross) ||
      +purchaseQtlsGross < 0 ||
      gunnyBags.trim() === "" ||
      isNaN(gunnyBags) ||
      +gunnyBags < 0 ||
      ppBags.trim() === "" ||
      isNaN(ppBags) ||
      +ppBags < 0 ||
      bagWeight.trim() === "" ||
      isNaN(bagWeight) ||
      +bagWeight < 0 ||
      faqQtls.trim() === "" ||
      isNaN(faqQtls) ||
      +faqQtls < 0 ||
      !req.file
    ) {
      return next(
        new CustomError(
          "Bad Parameter. Invalid Entry. Please check the data entered carefully !",
          400
        )
      );
    }
    // Decode the service account key from an environment variable
    const keyContent = Buffer.from(
      process.env.GOOGLE_SERVICE_ACCOUNT_KEY,
      "base64"
    ).toString("utf-8");

    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(keyContent),
      scopes: ["https://www.googleapis.com/auth/drive.file"],
    });

    const drive = google.drive({ version: "v3", auth });

    const filePath = req.file.path;
    const fileName = req.file.originalname;

    // Upload to Google Drive
    const fileMetadata = {
      name: fileName,
      parents: ["1XfXjO9pkNDn30gBir8p4R1l1IG9Jnu5-"],
    };
    const media = {
      mimeType: req.file.mimetype,
      body: fs.createReadStream(filePath),
    };

    const driveResponse = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: "id",
    });

    // Get file URL
    const fileId = driveResponse.data.id;
    drive.permissions.create({
      fileId,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });

    const fileUrl = `https://drive.google.com/uc?id=${fileId}`;

    const nettPurchaseQtyQtls = +purchaseQtlsGross - +bagWeight - +faqQtls;
    const purBags = +gunnyBags + +ppBags;

    const oldPaddyPurchase = await PaddyPurchase.findOne({ where: { id: id } });

    const data = await PaddyPurchase.update(
      {
        purchaseQtlsGross: Number(purchaseQtlsGross),
        gunnyBags: +gunnyBags,
        ppBags: +ppBags,
        bagWeight: Number(bagWeight),
        faqQtls: Number(faqQtls),
        purBags: purBags,
        nettPurchaseQtyQtls: Number(nettPurchaseQtyQtls),
        uploadHisab: fileUrl,
        lastModifiedBy: req.user.id,
      },
      {
        where: { id },
        transaction,
      }
    );

    const oldMasterTarget = await MasterTarget.findOne({
      where: {
        [Op.and]: [
          { mandiId: oldPaddyPurchase.mandiId },
          { seasonId: oldPaddyPurchase.seasonId }, // Add more conditions here
        ],
      },
    });

    if (!oldMasterTarget) {
      return next(
        new CustomError(
          `No master target have been added for  mandi : ${mandi.name}. Please add manster target for the mandi for proceeding further.`,
          400
        )
      );
    }

    const liftedQauntity =
      Number(oldMasterTarget.liftedQauntity) -
      Number(oldPaddyPurchase.nettPurchaseQtyQtls) +
      Number(nettPurchaseQtyQtls);

    const targetBalance =
      Number(oldMasterTarget.targetQtls) - Number(liftedQauntity);

    if (targetBalance < 0) {
      return next(
        new CustomError(
          "Total paddy purchase can not exceed the master target for the mandi",
          400
        )
      );
    }

    const masterUpdate = await MasterTarget.update(
      { liftedQauntity: liftedQauntity, targetBalance: targetBalance },
      { where: { mandiId: oldPaddyPurchase.mandiId }, transaction }
    );

    // Delete the file from local uploads folder
    fs.unlinkSync(filePath);
    await transaction.commit();
    res
      .status(201)
      .json({ message: "Paddy purchase data updated successfully" });
  } catch (error) {
    await transaction.rollback();
    console.error("Error in adding paddy purchase form data", error);

    next(
      new CustomError(
        "An error occurred while addding paddy purchase form data",
        500
      )
    );
  }
};

exports.addPaddyLoading = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const {
      vehicleNumber,
      bagsLoaded,
      companyMandiId,
      companySeasonId,
      companyFactoryId,
    } = req.body;

    console.log("mandiId", req.body);
    const companyId = req.user.companyId;
    const userId = req.user.id;

    const mandi = await Mandi.findOne({
      where: { id: companyMandiId },
    });

    if (!mandi) {
      return next(new CustomError("Mandi not found", 404));
    }

    const factory = await Factory.findOne({
      where: { id: companyFactoryId },
    });

    if (!factory) {
      return next(new CustomError("Factory not found", 404));
    }

    const season = await Season.findOne({
      where: { id: companySeasonId },
    });

    if (!season) {
      return next(new CustomError("Season not found", 404));
    }

    // // Access files by field name
    // const uploadTPCopy = req.files["uploadTPCopy"]
    //   ? req.files["uploadTPCopy"][0]
    //   : null;
    // const uploadVehiclePhoto = req.files["uploadVehiclePhoto"]
    //   ? req.files["uploadVehiclePhoto"][0]
    //   : null;

    // // console.log(req.body);
    // // console.log("upload hisab", req.file);

    // const oldPaddyPurchase = await PaddyPurchase.findOne({
    //   where: { id: paddyPurchaseId },
    // });

    // if (!oldPaddyPurchase) {
    //   return next(new CustomError("Paddy Purchase not found", 404));
    // }

    // console.log(mandi, factory);

    // console.log("forms_addMandiPurchaseData", req.body);

    if (
      vehicleNumber.trim() === "" ||
      bagsLoaded.trim() === "" ||
      isNaN(bagsLoaded) ||
      +bagsLoaded < 0
    ) {
      return next(new CustomError("Bad Parameter. Invalid Entry !", 400));
    }
    // Decode the service account key from an environment variable
    // const keyContent = Buffer.from(
    //   process.env.GOOGLE_SERVICE_ACCOUNT_KEY,
    //   "base64"
    // ).toString("utf-8");

    // const auth = new google.auth.GoogleAuth({
    //   credentials: JSON.parse(keyContent),
    //   scopes: ["https://www.googleapis.com/auth/drive.file"],
    // });

    // const drive = google.drive({ version: "v3", auth });

    // const files = [uploadTPCopy, uploadVehiclePhoto];
    // console.log("uploaded files()()()()()()()()()()()()", files);
    // const fileUrls = [];

    // for (const file of files) {
    //   const filePath = file.path;
    //   const fileName = file.originalname;

    //   const fileMetadata = {
    //     name: fileName,
    //     parents: ["1XfXjO9pkNDn30gBir8p4R1l1IG9Jnu5-"], // Ensure this folder ID is correct
    //   };

    //   const media = {
    //     mimeType: file.mimetype,
    //     body: fs.createReadStream(filePath),
    //   };

    //   const driveResponse = await drive.files.create({
    //     requestBody: fileMetadata,
    //     media: media,
    //     fields: "id",
    //   });

    //   const fileId = driveResponse.data.id;

    //   drive.permissions.create({
    //     fileId,
    //     requestBody: {
    //       role: "reader",
    //       type: "anyone",
    //     },
    //   });

    //   const fileUrl = `https://drive.google.com/uc?id=${fileId}`;
    //   fileUrls.push(fileUrl);

    //   // Delete the file from local uploads folder
    //   fs.unlinkSync(filePath);
    // }

    // console.log("fileUrls()()()()()()()()()()()()()()()()()()", fileUrls);

    // const nettPurchaseQtyQtls = +purchaseQtlsGross - +bagWeight - +faqQtls;
    // const purBags = +gunnyBags + +ppBags;

    const data = await PaddyLoadingEntry.create(
      {
        mandiName: mandi.name,
        seasonName: season.name,
        factoryName: factory.name,
        vehicleNumber: vehicleNumber,
        bagsLoaded: Number(bagsLoaded),
        seasonId: companySeasonId,
        factoryId: companyFactoryId,
        mandiId: companyMandiId,
        companyId: companyId,
        createdBy: userId,
        lastModifiedBy: userId,
      },
      { transaction }
    );

    // const quantityLoaded = Number(oldPaddyPurchase.quantityLoaded) + Number(transitPassQty_qtls);

    // console.log("quantityLoaded()()()()()()()()()()()()()()()", quantityLoaded);

    // const paddyPurchase = await PaddyPurchase.update(
    //   { quantityLoaded: quantityLoaded },
    //   { where: { id: paddyPurchaseId }, transaction }
    // );

    // console.log("530()()()()()()()()()()()()()()()", paddyPurchase);

    await transaction.commit();

    res
      .status(201)
      .json({ message: "Paddy loading form data submitted successfully" });
  } catch (error) {
    await transaction.rollback();
    console.error("Error in adding paddy loading form data", error);

    // next(
    //   new CustomError(
    //     "An error occurred while addding paddy loading form data",
    //     500
    //   )
    // );
  }
};

exports.paddyLoading = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.query;
  // console.log(id);

  let details;

  if (id) {
    const paddyLoading = await PaddyLoadingEntry.findOne({
      where: { id: id },
      include: [
        {
          model: Company,
          attributes: ["id", "name"],
        },

        {
          model: Season,
          attributes: ["id", "name"],
        },
        {
          model: Factory,
          attributes: ["id", "name"],
        },
      ],
    });

    if (!paddyLoading) {
      return next(new CustomError("Paddy loading not found.", 404));
    }

    // console.log("paddy purchase details", paddyPurchase);

    const createdByUser = await User.findOne({
      where: { id: paddyLoading.createdBy },
      attributes: ["name"],
    });

    const modifiedByUser = await User.findOne({
      where: { id: paddyLoading.lastModifiedBy },
      attributes: ["name"],
    });

    details = {
      id: paddyLoading.id,
      mandiName: paddyLoading.mandiName,
      factoryName: paddyLoading.factory.name,
      seasonName: paddyLoading.season.name,
      vehicleNumber: paddyLoading.vehicleNumber,
      bagsLoaded: paddyLoading.bagsLoaded,
      companyName: paddyLoading.company.name,
      createdBy: createdByUser.name,
      lastModifiedBy: modifiedByUser.name,
      createdAt: format(
        new Date(paddyLoading.createdAt),
        "dd-MM-yyyy HH:mm:ss"
      ),
      updatedAt: format(
        new Date(paddyLoading.updatedAt),
        "dd-MM-yyyy HH:mm:ss"
      ),
    };
  } else {
    const paddyLoading = await PaddyLoadingEntry.findAll({
      where: {
        companyId: req.user.company.id,
      },
      include: [
        {
          model: Company,
          attributes: ["id", "name"],
        },

        {
          model: Season,
          attributes: ["id", "name"],
        },
        {
          model: Factory,
          attributes: ["id", "name"],
        },
      ],
    });

    if (!paddyLoading) {
      return next(new CustomError("Paddy Loading not found", 404));
    }

    details = paddyLoading.map((ele) => {
      const obj = {
        id: ele.id,
        date: format(new Date(ele.createdAt), "dd-MM-yyyy"),
        mandiName: ele.mandiName,
        seasonName: ele.season.name,
        bagsLoaded: ele.bagsLoaded,
      };

      return obj;
    });
  }

  res.status(200).json({
    status: true,
    paddyLoading: details,
    message: "Data Fetched Successfully",
  });
});

exports.updatePaddyLoading = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const { vehicleNumber, bagsLoaded } = req.body;

    const { id } = req.query;

    const userId = req.user.id;

    // Access files by field name
    // const uploadTPCopy = req.files["uploadTPCopy"]
    //   ? req.files["uploadTPCopy"][0]
    //   : null;
    // const uploadVehiclePhoto = req.files["uploadVehiclePhoto"]
    //   ? req.files["uploadVehiclePhoto"][0]
    //   : null;

    if (
      vehicleNumber.trim() === "" ||
      bagsLoaded.trim() === "" ||
      isNaN(bagsLoaded) ||
      +bagsLoaded < 0
    ) {
      return next(new CustomError("Bad Parameter. Invalid Entry !", 400));
    }

    // Decode the service account key from an environment variable
    // const keyContent = Buffer.from(
    //   process.env.GOOGLE_SERVICE_ACCOUNT_KEY,
    //   "base64"
    // ).toString("utf-8");

    // const auth = new google.auth.GoogleAuth({
    //   credentials: JSON.parse(keyContent),
    //   scopes: ["https://www.googleapis.com/auth/drive.file"],
    // });

    // const drive = google.drive({ version: "v3", auth });

    // const files = [uploadTPCopy, uploadVehiclePhoto];
    // // console.log("uploaded files()()()()()()()()()()()()", files);
    // const fileUrls = [];

    // for (const file of files) {
    //   const filePath = file.path;
    //   const fileName = file.originalname;

    //   const fileMetadata = {
    //     name: fileName,
    //     parents: ["1XfXjO9pkNDn30gBir8p4R1l1IG9Jnu5-"], // Ensure this folder ID is correct
    //   };

    //   const media = {
    //     mimeType: file.mimetype,
    //     body: fs.createReadStream(filePath),
    //   };

    //   const driveResponse = await drive.files.create({
    //     requestBody: fileMetadata,
    //     media: media,
    //     fields: "id",
    //   });

    //   const fileId = driveResponse.data.id;

    //   drive.permissions.create({
    //     fileId,
    //     requestBody: {
    //       role: "reader",
    //       type: "anyone",
    //     },
    //   });

    //   const fileUrl = `https://drive.google.com/uc?id=${fileId}`;
    //   fileUrls.push(fileUrl);

    //   // Delete the file from local uploads folder
    //   fs.unlinkSync(filePath);
    // }

    // const oldPaddyLoading = await PaddyLoadingEntry.findOne({
    //   where: { id: id },
    // });

    // console.log("Old Paddy Loading()()()()()()", oldPaddyLoading);

    // if (!oldPaddyLoading) {
    //   return next(new CustomError("Paddy Loading not found", 404));
    // }

    // const oldPaddyPurchase = await PaddyPurchase.findOne({
    //   where: { id: oldPaddyLoading.paddyPurchaseId },
    // });

    // console.log("Old Paddy Purchase()()()()()()", oldPaddyPurchase);

    // if (!oldPaddyPurchase) {
    //   return next(new CustomError("Paddy Purchase not found", 404));
    // }

    const data = await PaddyLoadingEntry.update(
      {
        vehicleNumber: vehicleNumber,
        bagsLoaded: Number(bagsLoaded),
        lastModifiedBy: userId,
      },
      {
        where: { id },
        transaction,
      }
      // );

      // const quantityLoaded =
      //   Number(oldPaddyPurchase.quantityLoaded) -
      //   Number(oldPaddyLoading.transitPassQty_qtls) +
      //   transitPassQty_qtls;

      // const paddyPurchaseUpdate = await PaddyPurchase.update(
      //   { quantityLoaded: quantityLoaded },
      //   { where: { id: oldPaddyLoading.paddyPurchaseId }, transaction }
    );

    await transaction.commit();
    res
      .status(201)
      .json({ message: "Paddy loading data updated successfully" });
  } catch (error) {
    await transaction.rollback();
    console.error("Error in updating paddy loading form data", error);

    // next(
    //   new CustomError(
    //     "An error occurred while updating paddy loading form data",
    //     500
    //   )
    // );
  }
};

exports.addTransitPassEntry = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const {
      companyMandiId,
      companyFactoryId,
      companySeasonId,
      transitPassNumber,
      transitPassBags,
      transitPassQty_qtls,
    } = req.body;
    const companyId = req.user.companyId;
    const userId = req.user.id;

    // console.log(req.body);
    // console.log("upload hisab", req.file);

    const mandi = await Mandi.findOne({
      where: { id: companyMandiId },
    });

    if (!mandi) {
      return next(new CustomError("Mandi not found", 404));
    }

    const factory = await Factory.findOne({
      where: { id: companyFactoryId },
    });

    if (!factory) {
      return next(new CustomError("Factory not found", 404));
    }

    const season = await Season.findOne({
      where: { id: companySeasonId },
    });

    if (!season) {
      return next(new CustomError("Season not found", 404));
    }

    // console.log(mandi, factory);

    // console.log("forms_addMandiPurchaseData", req.body);

    if (
      transitPassNumber.trim() === "" ||
      isNaN(transitPassNumber) ||
      +transitPassNumber < 0 ||
      transitPassBags.trim() === "" ||
      isNaN(transitPassBags) ||
      +transitPassBags < 0 ||
      transitPassQty_qtls.trim() === "" ||
      isNaN(transitPassQty_qtls) ||
      +transitPassQty_qtls < 0 ||
      !req.file
    ) {
      return next(new CustomError("Bad Parameter. Invalid Entry !", 400));
    }
    // Decode the service account key from an environment variable
    const keyContent = Buffer.from(
      process.env.GOOGLE_SERVICE_ACCOUNT_KEY,
      "base64"
    ).toString("utf-8");

    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(keyContent),
      scopes: ["https://www.googleapis.com/auth/drive.file"],
    });

    const drive = google.drive({ version: "v3", auth });

    const filePath = req.file.path;
    const fileName = req.file.originalname;

    // Upload to Google Drive
    const fileMetadata = {
      name: fileName,
      parents: ["1XfXjO9pkNDn30gBir8p4R1l1IG9Jnu5-"],
    };
    const media = {
      mimeType: req.file.mimetype,
      body: fs.createReadStream(filePath),
    };

    const driveResponse = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: "id",
    });

    // Get file URL
    const fileId = driveResponse.data.id;
    drive.permissions.create({
      fileId,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });

    const fileUrl = `https://drive.google.com/uc?id=${fileId}`;

    const oldMasterTarget = await MasterTarget.findOne({
      where: {
        [Op.and]: [
          { mandiId: companyMandiId },
          { seasonId: companySeasonId }, // Add more conditions here
        ],
      },
    });

    if (!oldMasterTarget) {
      return next(
        new CustomError(
          `No master target have been added for  mandi : ${mandi.name}. Please add master target for the mandi for proceeding further.`,
          400
        )
      );
    }

    const data = await TransitPassEntry.create(
      {
        mandiName: mandi.name,
        transitPassNumber: Number(transitPassNumber),
        transitPassBags: Number(transitPassBags),
        transitPassQty_qtls: Number(transitPassQty_qtls),
        uploadTPCopy: fileUrl,
        companyId: companyId,
        factoryId: companyFactoryId,
        mandiId: companyMandiId,
        seasonId: companySeasonId,
        createdBy: userId,
        lastModifiedBy: userId,
      },
      { transaction }
    );

    // Delete the file from local uploads folder
    fs.unlinkSync(filePath);
    await transaction.commit();
    res
      .status(201)
      .json({ message: "Transit Pass Entry form data submitted successfully" });
  } catch (error) {
    await transaction.rollback();
    console.error("Error in adding Transit Pass Entry form data", error);

    // next(
    //   new CustomError(
    //     "An error occurred while addding paddy purchase form data",
    //     500
    //   )
    // );
  }
};

exports.transitPassEntry = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.query;
  // console.log(id);

  let details;

  if (id) {
    const transitPassEntry = await TransitPassEntry.findOne({
      where: { id: id },
      include: [
        {
          model: Company,
          attributes: ["id", "name"],
        },
        {
          model: Factory,
          attributes: ["id", "name"],
        },
        {
          model: Mandi,
          attributes: ["id", "name"],
        },
        {
          model: Season,
          attributes: ["id", "name"],
        },
      ],
    });

    if (!transitPassEntry) {
      return next(new CustomError("Transit Pass Entry not found.", 404));
    }

    // console.log("paddy purchase details", paddyPurchase);

    const createdByUser = await User.findOne({
      where: { id: transitPassEntry.createdBy },
      attributes: ["name"],
    });

    const modifiedByUser = await User.findOne({
      where: { id: transitPassEntry.lastModifiedBy },
      attributes: ["name"],
    });

    details = {
      id: transitPassEntry.id,
      mandiName: transitPassEntry.mandiName,
      factoryName: transitPassEntry.factory.name,
      seasonName: transitPassEntry.season.name,
      transitPassNumber: transitPassEntry.transitPassNumber,
      transitPassBags: transitPassEntry.transitPassBags,
      transitPassQty_qtls: transitPassEntry.transitPassQty_qtls,
      uploadTPCopy: transitPassEntry.uploadTPCopy,
      companyName: transitPassEntry.company.name,
      createdBy: createdByUser.name,
      lastModifiedBy: modifiedByUser.name,
      createdAt: format(
        new Date(transitPassEntry.createdAt),
        "dd-MM-yyyy HH:mm:ss"
      ),
      updatedAt: format(
        new Date(transitPassEntry.updatedAt),
        "dd-MM-yyyy HH:mm:ss"
      ),
    };
  } else {
    const transitPassEntry = await TransitPassEntry.findAll({
      where: {
        companyId: req.user.company.id,
      },
      include: [
        {
          model: Company,
          attributes: ["id", "name"],
        },
        {
          model: Factory,
          attributes: ["id", "name"],
        },
        {
          model: Mandi,
          attributes: ["id", "name"],
        },
        {
          model: Season,
          attributes: ["id", "name"],
        },
      ],
    });

    if (!transitPassEntry) {
      return next(new CustomError("Paddy Purchase not found", 404));
    }

    details = transitPassEntry.map((ele) => {
      const obj = {
        id: ele.id,
        date: format(new Date(ele.createdAt), "dd-MM-yyyy"),
        mandiName: ele.mandiName,
        seasonName: ele.season.name,
        factoryName: ele.factory.name,
        transitPassQty_qtls: ele.transitPassQty_qtls,
      };

      return obj;
    });
  }

  res.status(200).json({
    status: true,
    transitPassEntry: details,
    message: "Data Fetched Successfully",
  });
});

exports.updateTransitPassEntry = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const { transitPassNumber, transitPassBags, transitPassQty_qtls } =
      req.body;

    const { id } = req.query;

    if (
      transitPassNumber.trim() === "" ||
      isNaN(transitPassNumber) ||
      +transitPassNumber < 0 ||
      transitPassBags.trim() === "" ||
      isNaN(transitPassBags) ||
      +transitPassBags < 0 ||
      transitPassQty_qtls.trim() === "" ||
      isNaN(transitPassQty_qtls) ||
      +transitPassQty_qtls < 0 ||
      !req.file
    ) {
      return next(
        new CustomError(
          "Bad Parameter. Invalid Entry. Please check the data entered carefully !",
          400
        )
      );
    }
    // Decode the service account key from an environment variable
    const keyContent = Buffer.from(
      process.env.GOOGLE_SERVICE_ACCOUNT_KEY,
      "base64"
    ).toString("utf-8");

    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(keyContent),
      scopes: ["https://www.googleapis.com/auth/drive.file"],
    });

    const drive = google.drive({ version: "v3", auth });

    const filePath = req.file.path;
    const fileName = req.file.originalname;

    // Upload to Google Drive
    const fileMetadata = {
      name: fileName,
      parents: ["1XfXjO9pkNDn30gBir8p4R1l1IG9Jnu5-"],
    };
    const media = {
      mimeType: req.file.mimetype,
      body: fs.createReadStream(filePath),
    };

    const driveResponse = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: "id",
    });

    // Get file URL
    const fileId = driveResponse.data.id;
    drive.permissions.create({
      fileId,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });

    const fileUrl = `https://drive.google.com/uc?id=${fileId}`;

    const data = await TransitPassEntry.update(
      {
        transitPassNumber: Number(transitPassNumber),
        transitPassBags: Number(transitPassBags),
        transitPassQty_qtls: Number(transitPassQty_qtls),
        uploadTPCopy: fileUrl,
        lastModifiedBy: req.user.id,
      },
      {
        where: { id },
        transaction,
      }
    );

    // Delete the file from local uploads folder
    fs.unlinkSync(filePath);
    await transaction.commit();
    res
      .status(201)
      .json({ message: "Transit Pass Entry data updated successfully" });
  } catch (error) {
    await transaction.rollback();
    console.error("Error in adding paddy purchase form data", error);
  }
};

exports.paddyUnloading = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.query;
  // console.log(id);

  let details;

  if (id) {
    const paddyUnloading = await PaddyUnloadingEntry.findOne({
      where: { id: id },
      include: [
        {
          model: Company,
          attributes: ["id", "name"],
        },
        {
          model: Mandi,
          attributes: ["id", "name"],
        },
        {
          model: Season,
          attributes: ["id", "name"],
        },
        {
          model: Factory,
          attributes: ["id", "name"],
        },
        {
          model: Godown,
          attributes: ["id", "name"],
        },
      ],
    });

    if (!paddyUnloading) {
      return next(new CustomError("Paddy unloading not found.", 404));
    }

    // console.log("paddy purchase details", paddyPurchase);

    const createdByUser = await User.findOne({
      where: { id: paddyUnloading.createdBy },
      attributes: ["name"],
    });

    const modifiedByUser = await User.findOne({
      where: { id: paddyUnloading.lastModifiedBy },
      attributes: ["name"],
    });

    details = {
      id: paddyUnloading.id,
      mandiName: paddyUnloading.mandi.name,
      factoryName: paddyUnloading.factory.name,
      seasonName: paddyUnloading.season.name,
      godownName: paddyUnloading.godown.name,
      vehicleNumber: paddyUnloading.vehicleNumber,
      rstNumber: paddyUnloading.rstNumber,
      gunnyBags: paddyUnloading.gunnyBags,
      ppBags: paddyUnloading.ppBags,
      totalBags: paddyUnloading.totalBags,
      qtlsGross: paddyUnloading.qtlsGross,
      tare: paddyUnloading.tare,
      notes: paddyUnloading.notes,
      nettUnloadedQty_qtls: paddyUnloading.nettUnloadedQty_qtls,
      companyName: paddyUnloading.company.name,
      createdBy: createdByUser.name,
      lastModifiedBy: modifiedByUser.name,
      createdAt: format(
        new Date(paddyUnloading.createdAt),
        "dd-MM-yyyy HH:mm:ss"
      ),
      updatedAt: format(
        new Date(paddyUnloading.updatedAt),
        "dd-MM-yyyy HH:mm:ss"
      ),
    };
  } else {
    const paddyUnloading = await PaddyUnloadingEntry.findAll({
      where: {
        companyId: req.user.company.id,
      },
      include: [
        {
          model: Company,
          attributes: ["id", "name"],
        },
        {
          model: Mandi,
          attributes: ["id", "name"],
        },
        {
          model: Season,
          attributes: ["id", "name"],
        },
        {
          model: Factory,
          attributes: ["id", "name"],
        },
        {
          model: Godown,
          attributes: ["id", "name"],
        },
      ],
    });

    if (!paddyUnloading) {
      return next(new CustomError("Paddy unloading not found", 404));
    }

    details = paddyUnloading.map((ele) => {
      const obj = {
        id: ele.id,
        date: format(new Date(ele.createdAt), "dd-MM-yyyy"),
        mandiName: ele.mandi.name,
        factoryName: ele.factory.name,
        seasonName: ele.season.name,
        godownName: ele.godown.name,
        vehicleNumber: ele.vehicleNumber,
        unloadedQty_qtls: ele.nettUnloadedQty_qtls,
      };

      return obj;
    });
  }

  res.status(200).json({
    status: true,
    paddyUnloading: details,
    message: "Data Fetched Successfully",
  });
});

exports.addPaddyUnloading = asyncErrorHandler(
  async (req, res, next, transaction) => {
    let {
      companyMandiId,
      companySeasonId,
      companyFactoryId,
      companyGodownId,
      vehicleNumber,
      rstNumber,
      gunnyBags,
      ppBags,
      qtlsGross,
      tare,
      notes,
    } = req.body;
    const companyId = req.user.companyId;
    const userId = req.user.id;

    const mandi = await Mandi.findOne({
      where: { id: companyMandiId },
    });

    if (!mandi) {
      return next(new CustomError("Mandi not found", 404));
    }

    const factory = await Factory.findOne({
      where: { id: companyFactoryId },
    });

    if (!factory) {
      return next(new CustomError("Factory not found", 404));
    }

    const season = await Season.findOne({
      where: { id: companySeasonId },
    });

    if (!season) {
      return next(new CustomError("Season not found", 404));
    }

    const godown = await Godown.findOne({
      where: { id: companyGodownId },
    });

    if (!godown) {
      return next(new CustomError("Godown not found", 404));
    }

    if (
      vehicleNumber.trim() === "" ||
      rstNumber.trim() === "" ||
      isNaN(gunnyBags) ||
      gunnyBags === "" ||
      isNaN(ppBags) ||
      ppBags === "" ||
      isNaN(qtlsGross) ||
      qtlsGross === "" ||
      isNaN(tare) ||
      tare === ""
    ) {
      return next(new CustomError("Invalid Quantity", 404));
    }

    const oldMasterTarget = await MasterTarget.findOne({
      where: {
        [Op.and]: [{ mandiId: companyMandiId }, { seasonId: companySeasonId }],
      },
    });

    if (!oldMasterTarget) {
      return next(
        new CustomError(
          `No master target have been added for  mandi : ${mandi.name}. Please add master target for the mandi for proceeding further.`,
          400
        )
      );
    }

    const oldPaddyPurchase = await PaddyPurchase.findOne({
      where: {
        [Op.and]: [
          { mandiId: companyMandiId },
          { seasonId: companySeasonId },
          { factoryId: companyFactoryId },
        ],
      },
    });

    if (!oldPaddyPurchase) {
      return next(
        new CustomError(
          `No paddy purchase have been added for  mandi : ${mandi.name} for the factory : ${factory.name}. Please add paddy purchase data for the mandi and factory for proceeding further.`,
          400
        )
      );
    }

    const paddyUnloading = await PaddyUnloadingEntry.create(
      {
        mandiName: mandi.name,
        vehicleNumber: vehicleNumber,
        rstNumber: rstNumber,
        gunnyBags: gunnyBags,
        ppBags: ppBags,
        totalBags: Number(ppBags) + Number(gunnyBags),
        qtlsGross: qtlsGross,
        tare: tare,
        nettUnloadedQty_qtls: Number(qtlsGross) - Number(tare),
        notes: notes,
        godownId: companyGodownId,
        seasonId: companySeasonId,
        factoryId: companyFactoryId,
        mandiId: companyMandiId,
        companyId: companyId,
        createdBy: userId,
        lastModifiedBy: userId,
      },
      { transaction }
    );

    res
      .status(200)
      .json({ message: "Paddy unloading data added  successfully." });
  },
  true
);

exports.updatePaddyUnloading = asyncErrorHandler(
  async (req, res, next, transaction) => {
    let {
      vehicleNumber,
      rstNumber,
      gunnyBags,
      ppBags,
      qtlsGross,
      tare,
      notes,
    } = req.body;
    const { id } = req.query;
    const userId = req.user.id;

    if (
      vehicleNumber.trim() === "" ||
      rstNumber.trim() === "" ||
      isNaN(gunnyBags) ||
      gunnyBags === "" ||
      isNaN(ppBags) ||
      ppBags === "" ||
      isNaN(qtlsGross) ||
      qtlsGross === "" ||
      isNaN(tare) ||
      tare === ""
    ) {
      return next(new CustomError("Invalid Quantity", 404));
    }

    const paddyUnloading = await PaddyUnloadingEntry.update(
      {
        vehicleNumber: vehicleNumber,
        rstNumber: rstNumber,
        gunnyBags: gunnyBags,
        ppBags: ppBags,
        totalBags: Number(ppBags) + Number(gunnyBags),
        qtlsGross: qtlsGross,
        tare: tare,
        nettUnloadedQty_qtls: Number(qtlsGross) - Number(tare),
        notes: notes,
        lastModifiedBy: userId,
      },
      {
        where: { id },
        transaction,
      }
    );

    res
      .status(200)
      .json({ message: "Paddy Unloading data updated successfully." });
  },
  true
);

exports.traderPaddyAdvance = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.query;
  // console.log(id);

  let details;

  if (id) {
    const traderPaddyAdvance = await TraderPaddyAdvance.findOne({
      where: { id: id },
      include: [
        {
          model: Company,
          attributes: ["id", "name"],
        },
        {
          model: Trader,
          attributes: ["id", "name"],
        },
        {
          model: Season,
          attributes: ["id", "name"],
        },
        {
          model: Factory,
          attributes: ["id", "name"],
        },
        {
          model: Godown,
          attributes: ["id", "name"],
        },
      ],
    });

    if (!traderPaddyAdvance) {
      return next(new CustomError("Trader paddy advance not found.", 404));
    }

    // console.log("paddy purchase details", paddyPurchase);

    const createdByUser = await User.findOne({
      where: { id: traderPaddyAdvance.createdBy },
      attributes: ["name"],
    });

    const modifiedByUser = await User.findOne({
      where: { id: traderPaddyAdvance.lastModifiedBy },
      attributes: ["name"],
    });

    details = {
      id: traderPaddyAdvance.id,
      traderName: traderPaddyAdvance.trader.name,
      factoryName: traderPaddyAdvance.factory.name,
      seasonName: traderPaddyAdvance.season.name,
      godownName: traderPaddyAdvance.godown.name,
      inBags: traderPaddyAdvance.inBags,
      gross: traderPaddyAdvance.gross,
      bagWeightInKg: traderPaddyAdvance.bagWeightInKg,
      faqPercentage: traderPaddyAdvance.faqPercentage,
      specialCuttingInKg: traderPaddyAdvance.specialCuttingInKg,
      faq: traderPaddyAdvance.faq,
      nettIn: traderPaddyAdvance.nettIn,
      companyName: traderPaddyAdvance.company.name,
      createdBy: createdByUser.name,
      lastModifiedBy: modifiedByUser.name,
      createdAt: format(
        new Date(traderPaddyAdvance.createdAt),
        "dd-MM-yyyy HH:mm:ss"
      ),
      updatedAt: format(
        new Date(traderPaddyAdvance.updatedAt),
        "dd-MM-yyyy HH:mm:ss"
      ),
    };
  } else {
    const traderPaddyAdvance = await TraderPaddyAdvance.findAll({
      where: {
        companyId: req.user.company.id,
      },
      include: [
        {
          model: Company,
          attributes: ["id", "name"],
        },
        {
          model: Trader,
          attributes: ["id", "name"],
        },
        {
          model: Season,
          attributes: ["id", "name"],
        },
        {
          model: Factory,
          attributes: ["id", "name"],
        },
        {
          model: Godown,
          attributes: ["id", "name"],
        },
      ],
    });

    if (!traderPaddyAdvance) {
      return next(new CustomError("Trader paddy advance not found", 404));
    }

    details = traderPaddyAdvance.map((ele) => {
      const obj = {
        id: ele.id,
        date: format(new Date(ele.createdAt), "dd-MM-yyyy"),
        traderName: ele.trader.name,
        factoryName: ele.factory.name,
        seasonName: ele.season.name,
        godownName: ele.godown.name,
        nettIn: ele.nettIn,
      };

      return obj;
    });
  }

  res.status(200).json({
    status: true,
    traderPaddyAdvance: details,
    message: "Data Fetched Successfully",
  });
});

exports.addTraderPaddyAdvance = asyncErrorHandler(
  async (req, res, next, transaction) => {
    let {
      companyTraderId,
      companySeasonId,
      companyFactoryId,
      companyGodownId,
      inBags,
      gross,
      bagWeightInKg,
      faqPercentage,
      specialCuttingInKg,
    } = req.body;
    const companyId = req.user.companyId;
    const userId = req.user.id;

    console.log("****Trader id****", companyTraderId);

    const trader = await Trader.findOne({
      where: { id: companyTraderId },
    });

    if (!trader) {
      return next(new CustomError("Trader not found", 404));
    }

    const factory = await Factory.findOne({
      where: { id: companyFactoryId },
    });

    if (!factory) {
      return next(new CustomError("Factory not found", 404));
    }

    const season = await Season.findOne({
      where: { id: companySeasonId },
    });

    if (!season) {
      return next(new CustomError("Season not found", 404));
    }

    const godown = await Godown.findOne({
      where: { id: companyGodownId },
    });

    if (!godown) {
      return next(new CustomError("Godown not found", 404));
    }

    if (
      isNaN(inBags) ||
      inBags === "" ||
      isNaN(gross) ||
      gross === "" ||
      isNaN(bagWeightInKg) ||
      bagWeightInKg === "" ||
      isNaN(faqPercentage) ||
      faqPercentage === "" ||
      isNaN(specialCuttingInKg) ||
      specialCuttingInKg === ""
    ) {
      return next(new CustomError("Invalid Data", 404));
    }

    let faq =
      ((Number(gross) - Number(bagWeightInKg)) * Number(faqPercentage)) / 100;

    let nettIn =
      Number(gross) -
      Number(bagWeightInKg) -
      Number(faq) -
      Number(specialCuttingInKg);

    const traderPaddyAdvance = await TraderPaddyAdvance.create(
      {
        traderName: trader.name,
        inBags: inBags,
        gross: gross,
        bagWeightInKg: bagWeightInKg,
        faqPercentage: faqPercentage,
        specialCuttingInKg: specialCuttingInKg,
        faq: faq,
        nettIn: nettIn,
        godownId: companyGodownId,
        seasonId: companySeasonId,
        factoryId: companyFactoryId,
        traderId: companyTraderId,
        companyId: companyId,
        createdBy: userId,
        lastModifiedBy: userId,
      },
      { transaction }
    );

    res
      .status(200)
      .json({ message: "Trader Paddy advance data added  successfully." });
  },
  true
);

exports.updateTraderPaddyAdvance = asyncErrorHandler(
  async (req, res, next, transaction) => {
    let { inBags, gross, bagWeightInKg, faqPercentage, specialCuttingInKg } =
      req.body;
    const { id } = req.query;
    const userId = req.user.id;

    if (
      isNaN(inBags) ||
      inBags === "" ||
      isNaN(gross) ||
      gross === "" ||
      isNaN(bagWeightInKg) ||
      bagWeightInKg === "" ||
      isNaN(faqPercentage) ||
      faqPercentage === "" ||
      isNaN(specialCuttingInKg) ||
      specialCuttingInKg === ""
    ) {
      return next(new CustomError("Invalid data", 404));
    }

    let faq =
      ((Number(gross) - Number(bagWeightInKg)) * Number(faqPercentage)) / 100;

    let nettIn =
      Number(gross) -
      Number(bagWeightInKg) -
      Number(faq) -
      Number(specialCuttingInKg);

    const traderPaddyAdvance = await TraderPaddyAdvance.update(
      {
        inBags: inBags,
        gross: gross,
        bagWeightInKg: bagWeightInKg,
        faqPercentage: faqPercentage,
        specialCuttingInKg: specialCuttingInKg,
        faq: faq,
        nettIn: nettIn,
        lastModifiedBy: userId,
      },
      {
        where: { id },
        transaction,
      }
    );

    res
      .status(200)
      .json({ message: "Trader paddy advance data updated successfully." });
  },
  true
);

exports.traderPaddyRelease = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.query;
  // console.log(id);

  let details;

  if (id) {
    const traderPaddyRelease = await TraderPaddyRelease.findOne({
      where: { id: id },
      include: [
        {
          model: Company,
          attributes: ["id", "name"],
        },
        {
          model: Trader,
          attributes: ["id", "name"],
        },
        {
          model: Season,
          attributes: ["id", "name"],
        },
        {
          model: Mandi,
          attributes: ["id", "name"],
        },
      ],
    });

    if (!traderPaddyRelease) {
      return next(new CustomError("Trader paddy release not found.", 404));
    }

    // console.log("paddy purchase details", paddyPurchase);

    const createdByUser = await User.findOne({
      where: { id: traderPaddyRelease.createdBy },
      attributes: ["name"],
    });

    const modifiedByUser = await User.findOne({
      where: { id: traderPaddyRelease.lastModifiedBy },
      attributes: ["name"],
    });

    details = {
      id: traderPaddyRelease.id,
      traderName: traderPaddyRelease.trader.name,
      mandiName: traderPaddyRelease.mandi.name,
      seasonName: traderPaddyRelease.season.name,
      releaseQtls: traderPaddyRelease.releaseQtls,
      releaseBags: traderPaddyRelease.releaseBags,

      companyName: traderPaddyRelease.company.name,
      createdBy: createdByUser.name,
      lastModifiedBy: modifiedByUser.name,
      createdAt: format(
        new Date(traderPaddyRelease.createdAt),
        "dd-MM-yyyy HH:mm:ss"
      ),
      updatedAt: format(
        new Date(traderPaddyRelease.updatedAt),
        "dd-MM-yyyy HH:mm:ss"
      ),
    };
  } else {
    const traderPaddyRelease = await TraderPaddyRelease.findAll({
      where: {
        companyId: req.user.company.id,
      },
      include: [
        {
          model: Company,
          attributes: ["id", "name"],
        },
        {
          model: Trader,
          attributes: ["id", "name"],
        },
        {
          model: Season,
          attributes: ["id", "name"],
        },
        {
          model: Mandi,
          attributes: ["id", "name"],
        },
      ],
    });

    if (!traderPaddyRelease) {
      return next(new CustomError("Trader paddy release not found", 404));
    }

    details = traderPaddyRelease.map((ele) => {
      const obj = {
        id: ele.id,
        date: format(new Date(ele.createdAt), "dd-MM-yyyy"),
        traderName: ele.trader.name,
        mandiName: ele.mandi.name,
        seasonName: ele.season.name,
        releaseQtls: ele.releaseQtls,
        releaseBags: ele.releaseBags,
      };

      return obj;
    });
  }

  res.status(200).json({
    status: true,
    traderPaddyRelease: details,
    message: "Data Fetched Successfully",
  });
});

exports.addTraderPaddyRelease = asyncErrorHandler(
  async (req, res, next, transaction) => {
    let {
      companyTraderId,
      companySeasonId,
      companyMandiId,
      releaseQtls,
      releaseBags,
    } = req.body;
    const companyId = req.user.companyId;
    const userId = req.user.id;

    console.log("****Trader id****", companyTraderId);

    const trader = await Trader.findOne({
      where: { id: companyTraderId },
    });

    if (!trader) {
      return next(new CustomError("Trader not found", 404));
    }

    const mandi = await Mandi.findOne({
      where: { id: companyMandiId },
    });

    if (!mandi) {
      return next(new CustomError("Mandi not found", 404));
    }

    const season = await Season.findOne({
      where: { id: companySeasonId },
    });

    if (!season) {
      return next(new CustomError("Season not found", 404));
    }

    if (
      isNaN(releaseBags) ||
      releaseBags === "" ||
      isNaN(releaseQtls) ||
      releaseQtls === ""
    ) {
      return next(new CustomError("Invalid Data", 404));
    }

    const traderPaddyRelease = await TraderPaddyRelease.create(
      {
        traderName: trader.name,
        mandiName: mandi.name,
        releaseQtls: releaseQtls,
        releaseBags: releaseBags,
        seasonId: companySeasonId,
        mandiId: companyMandiId,
        traderId: companyTraderId,
        companyId: companyId,
        createdBy: userId,
        lastModifiedBy: userId,
      },
      { transaction }
    );

    res
      .status(200)
      .json({ message: "Trader Paddy release data added  successfully." });
  },
  true
);

exports.updateTraderPaddyRelease = asyncErrorHandler(
  async (req, res, next, transaction) => {
    let { releaseQtls, releaseBags } = req.body;
    const { id } = req.query;
    const userId = req.user.id;

    if (
      isNaN(releaseBags) ||
      releaseBags === "" ||
      isNaN(releaseQtls) ||
      releaseQtls === ""
    ) {
      return next(new CustomError("Invalid Data", 404));
    }

    const traderPaddyRelease = await TraderPaddyRelease.update(
      {
        releaseBags: releaseBags,
        releaseQtls: releaseQtls,
        lastModifiedBy: userId,
      },
      {
        where: { id },
        transaction,
      }
    );

    res
      .status(200)
      .json({ message: "Trader paddy release data updated successfully." });
  },
  true
);

exports.deliveryCertificate = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.query;
  // console.log(id);

  let details;

  if (id) {
    const deliveryCertificate = await DeliveryCertificate.findOne({
      where: { id: id },
      include: [
        {
          model: Company,
          attributes: ["id", "name"],
        },
        {
          model: Factory,
          attributes: ["id", "name"],
        },
        {
          model: Season,
          attributes: ["id", "name"],
        },
        {
          model: Depot,
          attributes: ["id", "name"],
        },
      ],
    });

    if (!deliveryCertificate) {
      return next(new CustomError("Delivery certificate not found.", 404));
    }

    // console.log("paddy purchase details", paddyPurchase);

    const createdByUser = await User.findOne({
      where: { id: deliveryCertificate.createdBy },
      attributes: ["name"],
    });

    const modifiedByUser = await User.findOne({
      where: { id: deliveryCertificate.lastModifiedBy },
      attributes: ["name"],
    });

    details = {
      id: deliveryCertificate.id,
      depotName: deliveryCertificate.depot.name,
      factoryName: deliveryCertificate.factory.name,
      seasonName: deliveryCertificate.season.name,
      dcNumber: deliveryCertificate.dcNumber,
      qtyQtls: deliveryCertificate.qtyQtls,
      dcBalance: deliveryCertificate.dcBalance,
      isActive: deliveryCertificate.isActive,
      companyName: deliveryCertificate.company.name,
      createdBy: createdByUser.name,
      lastModifiedBy: modifiedByUser.name,
      createdAt: format(
        new Date(deliveryCertificate.createdAt),
        "dd-MM-yyyy HH:mm:ss"
      ),
      updatedAt: format(
        new Date(deliveryCertificate.updatedAt),
        "dd-MM-yyyy HH:mm:ss"
      ),
    };
  } else {
    const deliveryCertificate = await DeliveryCertificate.findAll({
      where: {
        companyId: req.user.company.id,
      },
      include: [
        {
          model: Company,
          attributes: ["id", "name"],
        },
        {
          model: Season,
          attributes: ["id", "name"],
        },
        {
          model: Depot,
          attributes: ["id", "name"],
        },
        {
          model: Factory,
          attributes: ["id", "name"],
        },
      ],
    });

    if (!deliveryCertificate) {
      return next(new CustomError("Delivery certificate not found", 404));
    }

    details = deliveryCertificate.map((ele) => {
      const obj = {
        id: ele.id,
        date: format(new Date(ele.createdAt), "dd-MM-yyyy"),
        seasonName: ele.season.name,
        depotName: ele.depot.name,
        factoryName: ele.factory.name,
        dcNumber: ele.dcNumber,
        qtyQtls: ele.qtyQtls,
      };

      return obj;
    });
  }

  res.status(200).json({
    status: true,
    deliveryCertificate: details,
    message: "Data Fetched Successfully",
  });
});

exports.addDeliveryCertificate = asyncErrorHandler(
  async (req, res, next, transaction) => {
    let {
      companySeasonId,
      companyDepotId,
      companyFactoryId,
      dcNumber,
      qtyQtls,
    } = req.body;
    const companyId = req.user.companyId;
    const userId = req.user.id;

    const season = await Season.findOne({
      where: { id: companySeasonId },
    });

    if (!season) {
      return next(new CustomError("Season not found", 404));
    }

    const depot = await Depot.findOne({
      where: { id: companyDepotId },
    });

    if (!depot) {
      return next(new CustomError("Depot not found", 404));
    }

    const factory = await Factory.findOne({
      where: { id: companyFactoryId },
    });

    if (!factory) {
      return next(new CustomError("Factory not found", 404));
    }

    if (isNaN(qtyQtls) || qtyQtls === "" || dcNumber === "") {
      return next(new CustomError("Invalid Data", 404));
    }

    const deliveryCertificate = await DeliveryCertificate.create(
      {
        dcNumber: dcNumber,
        depotName: depot.name,
        qtyQtls: qtyQtls,
        dcBalance: qtyQtls,
        seasonId: companySeasonId,
        factoryId: companyFactoryId,
        depotId: companyDepotId,
        companyId: companyId,
        createdBy: userId,
        lastModifiedBy: userId,
      },
      { transaction }
    );

    res
      .status(200)
      .json({ message: "Delivery Certificate data added  successfully." });
  },
  true
);

exports.updateDeliveryCertificate = asyncErrorHandler(
  async (req, res, next, transaction) => {
    let { dcNumber, qtyQtls } = req.body;
    const { id } = req.query;
    const userId = req.user.id;

    if (isNaN(qtyQtls) || qtyQtls === "" || dcNumber === "") {
      return next(new CustomError("Invalid Data", 404));
    }

    const oldDeliveryCertificate = await DeliveryCertificate.findOne({
      where: { id: id },
      attributes: ["id", "qtyQtls"],
    });

    if (!oldDeliveryCertificate) {
      return next(new CustomError("Delivery certificate not found.", 404));
    }

    if (oldDeliveryCertificate.qtyQtls > qtyQtls) {
      return next(
        new CustomError(
          "New Qty Qtls cannot be less than current Qtt Qtls",
          400
        )
      );
    }

    const increaseInQtyQtls = qtyQtls - oldDeliveryCertificate.qtyQtls;

    const deliveryCertificate = await DeliveryCertificate.update(
      {
        qtyQtls: qtyQtls,
        dcBalance:
          Number(oldDeliveryCertificate.dcBalance) + Number(increaseInQtyQtls),
        dcNumber: dcNumber,
        lastModifiedBy: userId,
      },
      {
        where: { id },
        transaction,
      }
    );

    res
      .status(200)
      .json({ message: "Delivery certificate data updated successfully." });
  },
  true
);

exports.currentDeliveryCertificate = asyncErrorHandler(
  async (req, res, next) => {
    const { id } = req.query;
    // console.log(id);

    let details;

    const deliveryCertificate = await DeliveryCertificate.findAll({
      where: {
        [Op.and]: [{ companyId: req.user.company.id }, { seasonId: id }],
      },
      attributes: ["id", "dcNumber", "dcBalance", "isActive"],
    });

    if (!deliveryCertificate) {
      return next(new CustomError("Delivery certificate not found", 404));
    }

    details = deliveryCertificate.map((ele) => {
      const obj = {
        id: ele.id,
        dcNumber: ele.dcNumber,
        dcBalance: ele.dcBalance,
        qtyQtls: ele.qtyQtls,
        isActive: ele.isActive,
      };

      return obj;
    });

    res.status(200).json({
      status: true,
      deliveryCertificate: details,
      message: "Data Fetched Successfully",
    });
  }
);

exports.factoryRiceLoading = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.query;
  // console.log(id);

  let details;

  if (id) {
    const factoryRiceLoading = await FactoryRiceLoading.findOne({
      where: { id: id },
      include: [
        {
          model: Company,
          attributes: ["id", "name"],
        },
        {
          model: Factory,
          attributes: ["id", "name"],
        },
        {
          model: Season,
          attributes: ["id", "name"],
        },
        {
          model: Depot,
          attributes: ["id", "name"],
        },
        {
          model: DeliveryCertificate,
          attributes: ["id", "dcNumber"],
        },
      ],
    });

    if (!factoryRiceLoading) {
      return next(new CustomError("Factory rice loading not found.", 404));
    }

    // console.log("paddy purchase details", paddyPurchase);

    const createdByUser = await User.findOne({
      where: { id: factoryRiceLoading.createdBy },
      attributes: ["name"],
    });

    const modifiedByUser = await User.findOne({
      where: { id: factoryRiceLoading.lastModifiedBy },
      attributes: ["name"],
    });

    details = {
      id: factoryRiceLoading.id,
      depotName: factoryRiceLoading.depot.name,
      factoryName: factoryRiceLoading.factory.name,
      seasonName: factoryRiceLoading.season.name,
      dcNumber: factoryRiceLoading.delivery_certificate.dcNumber,
      vehicleNumber: factoryRiceLoading.vehicleNumber,
      qtyBags: factoryRiceLoading.qtyBags,
      qtyQtls: factoryRiceLoading.qtyQtls,
      companyName: factoryRiceLoading.company.name,
      createdBy: createdByUser.name,
      lastModifiedBy: modifiedByUser.name,
      createdAt: format(
        new Date(factoryRiceLoading.createdAt),
        "dd-MM-yyyy HH:mm:ss"
      ),
      updatedAt: format(
        new Date(factoryRiceLoading.updatedAt),
        "dd-MM-yyyy HH:mm:ss"
      ),
    };
  } else {
    const factoryRiceLoading = await FactoryRiceLoading.findAll({
      where: {
        companyId: req.user.company.id,
      },
      include: [
        {
          model: DeliveryCertificate,
          attributes: ["id", "dcNumber"],
        },
        {
          model: Season,
          attributes: ["id", "name"],
        },
        {
          model: Depot,
          attributes: ["id", "name"],
        },
        {
          model: Factory,
          attributes: ["id", "name"],
        },
      ],
    });

    if (!factoryRiceLoading) {
      return next(new CustomError("Factory rice loading not found", 404));
    }

    details = factoryRiceLoading.map((ele) => {
      const obj = {
        id: ele.id,
        date: format(new Date(ele.createdAt), "dd-MM-yyyy"),
        seasonName: ele.season.name,
        depotName: ele.depot.name,
        factoryName: ele.factory.name,
        dcNumber: ele.delivery_certificate.dcNumber,
        vehicleNumber: ele.vehicleNumber,
        qtyQtls: ele.qtyQtls,
      };

      return obj;
    });
  }

  res.status(200).json({
    status: true,
    factoryRiceLoading: details,
    message: "Data Fetched Successfully",
  });
});

exports.addFactoryRiceLoading = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    let {
      seasonId,
      companyDepotId,
      companyFactoryId,
      deliveryCertificateId,
      vehicleNumber,
      qtyBags,
      qtyQtls,
    } = req.body;
    const companyId = req.user.companyId;
    const userId = req.user.id;

    const season = await Season.findOne({
      where: { id: seasonId },
    });

    if (!season) {
      return next(new CustomError("Season not found", 404));
    }

    const depot = await Depot.findOne({
      where: { id: companyDepotId },
    });

    if (!depot) {
      return next(new CustomError("Depot not found", 404));
    }

    const factory = await Factory.findOne({
      where: { id: companyFactoryId },
    });

    if (!factory) {
      return next(new CustomError("Factory not found", 404));
    }

    const deliveryCertificate = await DeliveryCertificate.findOne({
      where: { id: deliveryCertificateId },
    });

    if (!deliveryCertificate) {
      return next(new CustomError("Delivery certificate not found", 404));
    }

    if (
      isNaN(qtyQtls) ||
      qtyQtls === "" ||
      isNaN(qtyBags) ||
      qtyBags === "" ||
      vehicleNumber === ""
    ) {
      return next(new CustomError("Invalid Data", 404));
    }

    const oldDeliveryCertificate = await DeliveryCertificate.findOne({
      where: { id: deliveryCertificateId },
    });

    const newDeliveryCertificate = await DeliveryCertificate.update(
      {
        dcBalance: Number(oldDeliveryCertificate.dcBalance) - Number(qtyQtls),
      },
      {
        where: { id: deliveryCertificateId },
        transaction,
      }
    );

    const factoryRiceLoading = await FactoryRiceLoading.create(
      {
        vehicleNumber: vehicleNumber,
        qtyBags: qtyBags,
        qtyQtls: qtyQtls,
        dcId: deliveryCertificateId,
        seasonId: seasonId,
        factoryId: companyFactoryId,
        depotId: companyDepotId,
        companyId: companyId,
        createdBy: userId,
        lastModifiedBy: userId,
      },
      { transaction }
    );

    await transaction.commit();

    res
      .status(200)
      .json({ message: "Factory rice loading data added  successfully." });
  } catch (error) {
    await transaction.rollback();
    console.error("Error in adding factory rice loading form data", error);
  }
};

exports.updateFactoryRiceLoading = async (req, res, next) => {
  const transaction = await sequelize.transaction();

  try {
    let { vehicleNumber, qtyQtls, qtyBags } = req.body;
    const { id } = req.query;
    const userId = req.user.id;

    if (
      isNaN(qtyQtls) ||
      qtyQtls === "" ||
      isNaN(qtyBags) ||
      qtyBags === "" ||
      vehicleNumber === ""
    ) {
      return next(new CustomError("Invalid Data", 404));
    }

    const oldFactoryRiceLoading = await FactoryRiceLoading.findOne({
      where: { id: id },
      attributes: ["id", "qtyQtls", "dcId"],
    });

    const oldDeliveryCertificate = await DeliveryCertificate.findOne({
      where: { id: oldFactoryRiceLoading.dcId },
      attributes: ["id", "dcBalance"],
    });

    if (!oldDeliveryCertificate) {
      return next(new CustomError("Delivery certificate not found.", 404));
    }

    const newBalance =
      Number(oldDeliveryCertificate.dcBalance) +
      Number(oldFactoryRiceLoading.qtyQtls) -
      Number(qtyQtls);

    const deliveryCertificateUpdate = await DeliveryCertificate.update(
      {
        dcBalance: Number(newBalance),
        lastModifiedBy: userId,
      },
      {
        where: { id: oldFactoryRiceLoading.dcId },
        transaction,
      }
    );

    const factoryRiceLoadingUpdate = await FactoryRiceLoading.update(
      {
        vehicleNumber: vehicleNumber,
        qtyQtls: qtyQtls,
        qtyBags: qtyBags,
        lastModifiedBy: userId,
      },
      {
        where: { id: id },
        transaction,
      }
    );
    await transaction.commit();

    res
      .status(200)
      .json({ message: "Factory rice loading updated successfully." });
  } catch (error) {
    await transaction.rollback();
    console.error("Error in updating factory rice loading form data", error);
  }
};

exports.riceAcNote = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.query;
  // console.log(id);

  let details;

  if (id) {
    const riceAcNote = await RiceAcNote.findOne({
      where: { id: id },
      include: [
        {
          model: Company,
          attributes: ["id", "name"],
        },
        {
          model: Factory,
          attributes: ["id", "name"],
        },
        {
          model: Season,
          attributes: ["id", "name"],
        },
        {
          model: Depot,
          attributes: ["id", "name"],
        },
      ],
    });

    if (!riceAcNote) {
      return next(new CustomError("Rice AcNote not found.", 404));
    }

    // console.log("paddy purchase details", paddyPurchase);

    const createdByUser = await User.findOne({
      where: { id: riceAcNote.createdBy },
      attributes: ["name"],
    });

    const modifiedByUser = await User.findOne({
      where: { id: riceAcNote.lastModifiedBy },
      attributes: ["name"],
    });

    details = {
      id: riceAcNote.id,
      depotName: riceAcNote.depot.name,
      factoryName: riceAcNote.factory.name,
      seasonName: riceAcNote.season.name,
      acNoteNumber: riceAcNote.acNoteNumber,
      qtyQtls: riceAcNote.qtyQtls,
      qtyBags: riceAcNote.qtyBags,
      note: riceAcNote.note,
      companyName: riceAcNote.company.name,
      createdBy: createdByUser.name,
      lastModifiedBy: modifiedByUser.name,
      createdAt: format(new Date(riceAcNote.createdAt), "dd-MM-yyyy HH:mm:ss"),
      updatedAt: format(new Date(riceAcNote.updatedAt), "dd-MM-yyyy HH:mm:ss"),
    };
  } else {
    const riceAcNote = await RiceAcNote.findAll({
      where: {
        companyId: req.user.company.id,
      },
      include: [
        {
          model: Company,
          attributes: ["id", "name"],
        },
        {
          model: Season,
          attributes: ["id", "name"],
        },
        {
          model: Depot,
          attributes: ["id", "name"],
        },
        {
          model: Factory,
          attributes: ["id", "name"],
        },
      ],
    });

    if (!riceAcNote) {
      return next(new CustomError("Rice AcNote not found", 404));
    }

    details = riceAcNote.map((ele) => {
      const obj = {
        id: ele.id,
        date: format(new Date(ele.createdAt), "dd-MM-yyyy"),
        seasonName: ele.season.name,
        depotName: ele.depot.name,
        factoryName: ele.factory.name,
        acNoteNumber: ele.acNoteNumber,
        qtyQtls: ele.qtyQtls,
        qtyBags: ele.qtyBags,
        note: ele.note,
      };

      return obj;
    });
  }

  res.status(200).json({
    status: true,
    riceAcNote: details,
    message: "Data Fetched Successfully",
  });
});

exports.addRiceAcNote = asyncErrorHandler(
  async (req, res, next, transaction) => {
    let {
      companySeasonId,
      companyDepotId,
      companyFactoryId,
      acNoteNumber,
      qtyQtls,
      qtyBags,
      note,
    } = req.body;
    const companyId = req.user.companyId;
    const userId = req.user.id;

    const season = await Season.findOne({
      where: { id: companySeasonId },
    });

    if (!season) {
      return next(new CustomError("Season not found", 404));
    }

    const depot = await Depot.findOne({
      where: { id: companyDepotId },
    });

    if (!depot) {
      return next(new CustomError("Depot not found", 404));
    }

    const factory = await Factory.findOne({
      where: { id: companyFactoryId },
    });

    if (!factory) {
      return next(new CustomError("Factory not found", 404));
    }

    if (
      isNaN(qtyQtls) ||
      qtyQtls === "" ||
      isNaN(qtyBags) ||
      qtyBags === "" ||
      acNoteNumber === ""
    ) {
      return next(new CustomError("Invalid Data", 404));
    }

    const riceAcNote = await RiceAcNote.create(
      {
        acNoteNumber: acNoteNumber,
        qtyQtls: qtyQtls,
        qtyBags: qtyBags,
        note: note,
        seasonId: companySeasonId,
        factoryId: companyFactoryId,
        depotId: companyDepotId,
        companyId: companyId,
        createdBy: userId,
        lastModifiedBy: userId,
      },
      { transaction }
    );

    res.status(200).json({ message: "Rice AcNote data added  successfully." });
  },
  true
);

exports.updateRiceAcNote = asyncErrorHandler(
  async (req, res, next, transaction) => {
    let { acNoteNumber, qtyQtls, qtyBags, note } = req.body;
    const { id } = req.query;
    const userId = req.user.id;

    if (
      isNaN(qtyQtls) ||
      qtyQtls === "" ||
      isNaN(qtyBags) ||
      qtyBags === "" ||
      acNoteNumber === ""
    ) {
      return next(new CustomError("Invalid Data", 404));
    }

    const riceAcNote = await RiceAcNote.update(
      {
        acNoteNumber: acNoteNumber,
        qtyQtls: qtyQtls,
        qtyBags: qtyBags,
        note: note,
        lastModifiedBy: userId,
      },
      {
        where: { id },
        transaction,
      }
    );

    res.status(200).json({ message: "Rice AcNote data updated successfully." });
  },
  true
);
