const path = require("path");
const { google } = require("googleapis");
const fs = require("fs");
const { format } = require("date-fns");

const sequelize = require("../util/database.js");
const Admin = require("../models/Admin");
const AdminForgetPassword = require("../models/AdminForgotPassword");
const Company = require("../models/Company");
const CompanyLocation = require("../models/CompanyLocation");
const CompanyDistrict = require("../models/CompanyDistrict.js");
const DeliveryCertificate = require("../models/DeliveryCertificate");
const Depot = require("../models/Depot");
const DirectTrader = require("../models/DirectTrader");
const District = require("../models/District");
const Factory = require("../models/Factory");
const FactoryLoading = require("../models/FactoryLoading");
const ForgotPassword = require("../models/ForgotPassword");
const License = require("../models/License");
const Mandi = require("../models/Mandi");
const MasterTarget = require("../models/MasterTarget");
const PaddyAdvance = require("../models/PaddyAdvance");
const PaddyLoadingEntry = require("../models/PaddyLoadingEntry");
const PaddyPurchase = require("../models/PaddyPurchase");
const PaddyRelease = require("../models/PaddyRelease");
const PaddyUnloadingEntry = require("../models/PaddyUnloadingEntry");
const Permission = require("../models/Permission");
const RiceAcNote = require("../models/RiceAcNote");
const Role = require("../models/Role");
const RolePermission = require("../models/RolePermission");
const State = require("../models/State");
const Trader = require("../models/Trader");
const User = require("../models/User");
const UserFactory = require("../models/UserFactory");

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

exports.home = (req, res, next) => {
  res.sendFile(path.join(__dirname, "..", "views", "user", "home.html"));
};

exports.manageAccount = (req, res, next) => {
  res.sendFile(
    path.join(__dirname, "..", "views", "user", "manageAccount.html")
  );
};

exports.viewMenuItemDetails = (req, res, next) => {
  res.sendFile(
    path.join(__dirname, "..", "views", "user", "userViewMenuItem.html")
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

exports.companyFactory = asyncErrorHandler(async (req, res, next) => {
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
