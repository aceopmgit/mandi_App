const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { createTransport } = require("nodemailer");
const uuid = require("uuid");
const { format } = require("date-fns");
require("dotenv").config();

const sequelize = require("../util/database.js");
const Admin = require("../models/Admin.js");
const State = require("../models/State.js");
const District = require("../models/District");
const Depot = require("../models/Depot");
const Mandi = require("../models/Mandi.js");
const Role = require("../models/Role");
const Permission = require("../models/Permission");
const RolePermission = require("../models/RolePermission");
const License = require("../models/License");
const Company = require("../models/Company");
const User = require("../models/User");
const fPassword = require("../models/AdminForgotPassword.js");

function isStringInvalid(string) {
  if (string === undefined || string.length === 0) {
    return true;
  } else {
    return false;
  }
}

function generateAccessToken(id, name) {
  return jwt.sign({ userId: id, name: name }, process.env.ADMIN_TOKEN_SECRET, {
    expiresIn: "24h",
  });
}
// function generateRefreshAccessToken(id, name) {
//   return jwt.sign({ userId: id, name: name }, process.env.TOKEN_SECRET, {
//     expiresIn: process.env.REFRESH_TOKEN_SECRET_EXPIRE,
//   });
// }

async function masterUser() {
  const t = await sequelize.transaction(); // Start a transaction
  try {
    // Check if master admin exists
    const master = await Admin.findAll({
      where: { email: process.env.MASTER_EMAIL },
      transaction: t, // Include transaction here
    });

    if (master.length < 1) {
      const hashedPassword = bcrypt.hash(process.env.MASTER_PSW, 10);

      // Create the master admin
      await Admin.create(
        {
          name: process.env.MASTER_NAME,
          email: process.env.MASTER_EMAIL,
          password: hashedPassword,
        },
        { transaction: t } // Pass transaction
      );
      await t.commit();
    }
  } catch (err) {
    console.error(err);
    await t.rollback();
    res.status(500).json({
      Error: err,
    });
  }
}

async function addState() {
  const t = await sequelize.transaction();
  try {
    const statesDetails = await State.findAll({ transaction: t });
    if (statesDetails.length < 1) {
      const statesList = [
        "Odisha",
        "Punjab",
        "Haryana",
        "Andhra Pradesh",
        "Telangana",
        "Maharashtra",
      ];

      const stateObjects = statesList.map((state) => ({ name: state }));

      // Insert states in bulk
      await State.bulkCreate(stateObjects, { transaction: t });
      await t.commit();
    }
  } catch (error) {
    console.log(error);
    await t.rollback();

    res.status(500).json({
      Error: err,
    });
  }
}

exports.adminIndex = async (req, res, next) => {
  masterUser();
  addState();
  res
    .status(200)
    .sendFile(path.join(__dirname, "..", "views", "admin", "adminIndex.html"));
};

exports.adminHome = async (req, res, next) => {
  res
    .status(200)
    .sendFile(path.join(__dirname, "..", "views", "admin", "adminHome.html"));
};

exports.adminMandiDetails = async (req, res, next) => {
  res
    .status(200)
    .sendFile(
      path.join(__dirname, "..", "views", "admin", "adminMandiDetails.html")
    );
};

exports.rolesAndPermission = async (req, res, next) => {
  res
    .status(200)
    .sendFile(
      path.join(
        __dirname,
        "..",
        "views",
        "admin",
        "adminRolesAndPermission.html"
      )
    );
};

exports.license = async (req, res, next) => {
  res
    .status(200)
    .sendFile(
      path.join(__dirname, "..", "views", "admin", "adminLicense.html")
    );
};

exports.loginCheck = async (req, res, next) => {
  try {
    const email = req.body.Email;
    const password = req.body.Password;

    if (isStringInvalid(email) || isStringInvalid(password)) {
      return res.status(400).json({
        status: false,
        message: "Bad Parameter. Something is Misssing !",
      });
    }

    const loginDetail = await Admin.findAll({ where: { email: email } });
    console.log("1000000000000", loginDetail, email, password);
    if (loginDetail.length > 0) {
      console.log("11111111111111111111111111111111111");
      bcrypt.compare(password, loginDetail[0].password, (err, result) => {
        if (result === true) {
          const accessToken = generateAccessToken(
            loginDetail[0].id,
            loginDetail[0].Name
          );
          //   const refreshToken = generateRefreshAccessToken(
          //     loginDetail[0].id,
          //     loginDetail[0].Name
          //   );
          res
            .status(200)
            // .cookie("refreshToken", refreshToken, {
            //   httpOnly: true, // Prevents access to the cookie via JavaScript
            //   secure: true, // Use secure cookies in production (only works over HTTPS)
            //   maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            // })
            .json({
              success: true,
              message: "User Logged in Successfully !",
              token: accessToken,
            });
        } else {
          res
            .status(400)
            .json({ success: false, message: "Incorrect Password !" });
        }
      });
    } else {
      res.status(404).json({ success: false, message: "User not Found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: err,
    });
  }
};

exports.logout = async (req, res, next) => {
  res
    .status(200)
    // .clearCookie("refreshToken", {
    //   httpOnly: true,
    //   secure: true,
    // })
    .json({ message: "Logged out successfully" });
};

// exports.refreshAccessToken = async (req, res, next) => {
//   const refreshToken = req.cookies.refreshToken;

//   if (!refreshToken) {
//     return res.status(401).json({ message: "No refresh token provided" });
//   }

//   try {
//     // Verify the refresh token
//     const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

//     // You can also verify if the user still exists in the database if needed
//     const user = await User.findByPk(decoded.userId);
//     if (!user) {
//       return res.status(403).json({ message: "User not found" });
//     }

//     // Generate a new access token
//     const accessToken = generateAccessToken(user.id, user.name);

//     res.status(200).json({
//       success: true,
//       message: "Access Token Refreshedy",
//       token: accessToken,
//     });
//   } catch (err) {
//     console.error(err);
//     return res.status(403).json({ message: "Invalid refresh token" });
//   }
// };

exports.forgotpassword = async (req, res, next) => {
  res.sendFile(
    path.join(__dirname, "..", "views", "admin", "adminForgotPassword.html")
  );
};

exports.resetEmail = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const user = await Admin.findOne({
      where: { Email: req.body.email },
      attributes: ["id", "Name"],
    });

    if (user) {
      const id = uuid.v4();
      await fPassword.create(
        { id, isActive: true, userId: user.id },
        { transaction: t }
      );

      const transporter = createTransport({
        host: "smtp-relay.sendinblue.com",
        port: 587,
        auth: {
          user: "mis@lakshmifoods.org",
          pass: process.env.EMAIL_API_KEY,
        },
      });
      const mailOptions = {
        from: "mis@lakshmifoods.org",
        to: req.body.email,
        subject: "Reset Password",
        html: `<P>Here is your reset link</P>
                <a href="${process.env.WEBSITE}/admin/password/resetpassword/${id}">Reset password</a>`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
        } else {
          res.status(201).json({
            message: "Link to reset password sent to your mail ",
            sucess: true,
          });
          console.log("Email Sent" + info.response);
        }
      });
      await t.commit();
    } else {
      throw new Error("User not Found !");
    }
  } catch (err) {
    await t.rollback();
    console.log(
      "*********************************************************" + err
    );
    res.status(404).json({ message: `${err}`, sucess: false });
  }
};

exports.resetpassword = async (req, res, next) => {
  try {
    const id = req.params.id;
    const rPassword = await fPassword.findOne({ where: { id } });
    console.log("******************************", rPassword);
    if (rPassword && rPassword.isActive === true) {
      rPassword.update({ isActive: false });
      res.status(200).send(`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Reset Password</title>
    <link rel="stylesheet" href="style.css" />
    <script
      src="https://kit.fontawesome.com/7a4b62b0a4.js"
      crossorigin="anonymous"
    ></script>
    <style>
      @import url("https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap");
      * {
        padding: 0;
        margin: 0;
        box-sizing: border-box;
      }
      html {
        font-size: 62.5%;
      }
      html,
      body {
        font-family: "Roboto", sans-serif;
        font-weight: 300;
        line-height: 1.4;
        scroll-behavior: smooth;
      }
      .container {
        max-width: 80vw;
        margin: 0 auto;
      }
      button {
        padding: 10px 15px;
        border: none;
        transition: 0.2s ease-in-out;
        border-radius: 4px;
      }
      button:hover {
        opacity: 0.8;
        transition: 0.2s ease-in-out;
        cursor: pointer;
      }
      a {
        text-decoration: none;
      }
      header {
        /* background-color: var(--purple300); */
        position: sticky;
        top: 0;
        z-index: 100;
        box-shadow: 5px 5px 5px rgba(1, 1, 1, 0.5);
        background-color: white;
      }
      .navbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 50px;
      }
      .logo {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5em;
      }
      .logo img {
        height: 5vh;
      }
      .logo_text {
        font-size: 3rem;
        color: black;
      }

      .nav_menu {
        display: flex;
        gap: 2em;
      }
      .login_button,
      .signup_button {
        display: flex;
        gap: 0.5em;
        border: rgb(254, 12, 12) 1px solid;
        background-color: white;
        font-size: 1.6rem;
        font-weight: 600;
        color: #f60014;
      }

      .login_button:hover,
      .signup_button:hover {
        background-color: #f60014;
        color: white;
      }

      /* hero section */

      .hero_section {
        background-color: rgb(221 227 229);
      }

      .hero_section .container {
        display: flex;
        min-height: calc(100vh - 120px);
        align-items: center;
        justify-content: center;
      }
      .hero_section .container form {
        padding: 20px;
        margin-top: -80px;
        background: white;
        min-width: 50%;
      }

      form p {
        font-size: 2rem;
        font-weight: 400;
        padding-bottom: 1.5rem;
      }

      .form_control {
        display: flex;
        flex-direction: column;
        width: 100%;
      }
      label {
        font-size: 2rem;
        font-weight: 500;
      }

      input {
        padding: 6px 10px;
        border: 1px solid #ccc;
        font-size: 15px;
        border-radius: 4px;
        height: 45px;
        margin-bottom: 1.5rem;
      }

      form button {
        width: 100%;
        padding: 10px 40px 10px 30px;
        font-size: 14px;
        border-radius: 2px;
        background: #f60014;
        border-radius: 2px;
        color: #fff;
      }

      /* footer section */

      footer {
        text-align: center;
        text-transform: uppercase;
        background: #000;
        color: white;
        padding: 20px;
        font-size: 2rem;
      }

      /* media queries */

      @media (max-width: 1200px) {
        html {
          font-size: 45%;
        }
      }
    </style>
  </head>
  <body>
    <header>
      <nav class="navbar">
        <a href="/">
          <div class="logo">
            <img src="images/newLogo.png" alt="logo" />
            <h2 class="logo_text">Mandi Management</h2>
          </div>
        </a>
      </nav>
    </header>

    <main>
      <div class="hero_section">
        <div class="container">
          <form id="resetForm">
            <p>Password Reset</p>
            <div class="form_control">
              <input
                type="password"
                id="newpassword"
                name="newpassword"
                placeholder="Enter New Password"
                required
              />
              <br />
            </div>

            <button
              class="btn btn-primary float-right"
              id="reset"
              type="submit"
              form="resetForm"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </main>
    <footer>Copyright © A 2024 Company</footer>
    <script>
      const resetPassword = document.getElementById("resetForm");
      resetPassword.addEventListener("submit", reset);

      async function reset(e) {
        try {
          e.preventDefault();
          let newpassword = document.getElementById("newpassword").value;

          const details = {
            newpassword,
          };

          const res = await axios.post(
            "/admin/password/updatepassword/${id}",
            details
          );
          alert(res.data.message);
          window.location.href = "/";
        } catch (err) {
          console.log(err);
          //alert(err)
        }
      }
    </script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/axios/1.5.0/axios.min.js"></script>
  </body>
</html>
`);
      res.end();
    } else {
      throw new Error("Invalid Request !");
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: `${err}`, sucess: false });
  }
};

exports.updatepassword = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { newpassword } = req.body;

    const { resetPasswordId } = req.params;

    const reset = await fPassword.findOne({ where: { id: resetPasswordId } });

    const user = await Admin.findOne({ where: { id: reset.userId } });
    if (user) {
      bcrypt.hash(newpassword, 10, async (err, hash) => {
        if (err) {
          //console.log('*************************************************', newPassword, salt)
          console.log(err);
          throw new Error(err);
        }

        await user.update(
          {
            Password: hash,
          },
          { transaction: t }
        );

        await t.commit();
        res
          .status(201)
          .json({ status: true, message: "User Password reset successfull" });
      });
    } else {
      return res.status(404).json({ error: "No user Exists", success: false });
    }
  } catch (err) {
    await t.rollback();
    console.log(err);
    return res.status(403).json({ err, success: false });
  }
};

//admin view, edit, add item handling
// exports.getViewMenuItemDetails = (req, res) => {
//   const { menu } = req.query; // 'state', 'district', 'mandi', etc.

//   // Logic for fetching menu details
//   let details;
//   switch (menu) {
//     case "state":
//       details = { method: "view", tab: "mandiDetails", menu: "states" };
//       break;
//     case "district":
//       details = { method: "view", tab: "mandiDetails", menu: "districts" };
//       break;
//     case "mandi":
//       details = { method: "view", tab: "mandiDetails", menu: "mandis" };
//       break;
//     case "depot":
//       details = { method: "view", tab: "mandiDetails", menu: "depots" };
//       break;
//     default:
//       return res.status(400).json({ error: "Invalid menu" });
//   }

//   res.status(200).json({
//     details: details,
//     message: "Data Fetched Successfully",
//   });
// };

exports.viewMenuItemDetails = async (req, res, next) => {
  res
    .status(200)
    .sendFile(
      path.join(__dirname, "..", "views", "admin", "adminViewMenuItem.html")
    );
};

// admin data handling

// state data handling
exports.getStates = async (req, res, next) => {
  try {
    const id = req.params.Id;
    console.log(id);

    let details;

    if (id) {
      // Fetch state details by ID
      const state = await State.findOne({
        where: { id }, // Match the provided ID
      });
      if (!state) {
        return res.status(404).json({
          status: false,
          message: "State not found.",
        });
      }
      // console.log("state********", states);
      details = {
        name: state.name,
        createdAt: format(new Date(state.createdAt), "dd-MM-yyyy HH:mm:ss"),
        updatedAt: format(new Date(state.updatedAt), "dd-MM-yyyy HH:mm:ss"),
      };
    } else {
      // Fetch all state details
      const states = await State.findAll({
        order: [["name", "ASC"]],
      });
      details = states.map((ele) => {
        const obj = {
          id: ele.id,
          name: ele.name,
          createdAt: format(new Date(ele.createdAt), "dd-MM-yyyy"),
        };

        return obj;
      });
      // console.log("00000000000000000", details);
    }

    res.status(200).json({
      status: true,
      stateDetails: details,
      message: "Data Fetched Successfully",
    });
  } catch (err) {
    // Log and handle errors
    console.error("Error fetching states:", err);
    res.status(500).json({
      status: false,
      message: "An error occurred while fetching state details.",
      error: err.message || err.toString(),
    });
  }
};

exports.addState = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    // console.log("*************add state form data********", req.body);
    const { stateName } = req.body;

    if (
      !stateName ||
      typeof stateName !== "string" ||
      stateName.trim() === ""
    ) {
      await t.rollback();
      return res.status(400).json({
        status: false,
        message: "Invalid state name!",
      });
    }

    const data = await State.create(
      {
        name: stateName.trim(),
      },
      { transaction: t }
    );

    await t.commit();

    console.log("State created:", data);

    res.status(201).json({
      status: true,
      message: "State added successfully",
    });
  } catch (err) {
    await t.rollback();
    console.error("Error while adding state:", err);
    res.status(500).json({
      status: false,
      message: "An error occurred while adding the state.",
      error: err.message || err.toString(),
    });
  }
};

exports.updateStateDetails = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    console.log("Received edit state form data:", req.body);

    const id = req.params.Id;
    const { stateName } = req.body;

    // Validation for empty or missing `stateName`
    if (
      !stateName ||
      typeof stateName !== "string" ||
      stateName.trim() === ""
    ) {
      await t.rollback();
      return res.status(400).json({
        status: false,
        message: "State name cannot be empty or invalid.",
      });
    }

    // Update state details
    const [updatedRows] = await State.update(
      { name: stateName.trim() },
      {
        where: { id },
        transaction: t,
      }
    );

    // Check if the state was found and updated
    if (updatedRows === 0) {
      await t.rollback();
      return res.status(404).json({
        status: false,
        message: "State not found or no changes made.",
      });
    }

    await t.commit();

    console.log("Updated state details:", updatedRows);

    res.status(200).json({
      status: true,
      message: "State details updated successfully.",
    });
  } catch (err) {
    await t.rollback(); // Rollback transaction on error
    console.error("Error updating state details:", err);
    res.status(500).json({
      status: false,
      message: "An error occurred while updating state details.",
      error: err.message || err.toString(),
    });
  }
};

exports.deleteState = async (req, res, next) => {
  const stateId = req.params.Id;
  try {
    // Find and delete the state
    const state = await State.destroy({
      where: { id: stateId },
    });

    if (state === 0) {
      return res.status(404).json({ message: "State not found" });
    }

    res.status(200).json({ message: "State deleted successfully" });
  } catch (err) {
    console.error("Error deleting state:", err);
    res.status(500).json({
      status: false,
      message: "An error occurred while deleting a state",
      error: err.message,
    });
  }
};

// district data handling
exports.getDistricts = async (req, res, next) => {
  try {
    const { stateId, id } = req.query;
    let details;
    if (stateId) {
      const districts = await District.findAll({
        where: { stateId },
        order: [["name", "ASC"]],
        include: [
          {
            model: State,
            attributes: ["name"],
          },
        ],
      });

      details = districts.map((ele) => {
        const obj = {
          id: ele.id,
          name: ele.name,
          createdAt: format(new Date(ele.createdAt), "dd-MM-yyyy"),
          state: ele.state,
        };

        return obj;
      });
    } else if (id) {
      district = await District.findOne({
        where: { id },
        include: [
          {
            model: State,
            attributes: ["name"],
          },
        ],
      });
      if (!district) {
        return res.status(404).json({
          status: false,
          message: "District not found.",
        });
      }
      details = {
        name: district.name,
        stateName: district.state.name,
        createdAt: format(new Date(district.createdAt), "dd-MM-yyyy HH:mm:ss"),
        updatedAt: format(new Date(district.updatedAt), "dd-MM-yyyy HH:mm:ss"),
      };
    }

    res.status(200).json({
      status: true,
      districtDetails: details,
      message: "Data Fetched Successfully",
    });
  } catch (err) {
    console.error("Error fetching districts:", err);
    res.status(500).json({
      status: false,
      message: "An error occurred while fetching district data.",
      error: err.message || err.toString(),
    });
  }
};

exports.addDistrict = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    // console.log("Received data for adding district:", req.body);

    const { districtName, stateId } = req.body;

    if (!districtName || districtName.trim() === "") {
      return res.status(400).json({
        status: false,
        message: "District name cannot be empty.",
      });
    }

    const data = await District.create(
      {
        name: districtName,
        stateId: stateId,
      },
      { transaction: t }
    );

    await t.commit();

    // console.log("District added successfully:", data);

    res.status(201).json({
      status: true,
      message: "District added successfully to the state",
    });
  } catch (err) {
    await t.rollback();
    res.status(500).json({
      status: false,
      message: "An error occurred while adding the district.",
      error: err.message || err.toString(),
    });
  }
};

exports.updateDistrictDetails = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    console.log("*************edit district form data********", req.body);

    const id = req.params.Id;
    const { districtName } = req.body;

    // Validation for empty or missing `stateName`
    if (!districtName || districtName.trim() === "") {
      await t.rollback();
      return res.status(400).json({
        status: false,
        message: "Invalid data! District name cannot be empty.",
      });
    }

    // Update state details
    const [updatedRows] = await District.update(
      { name: districtName.trim() }, // Data to update
      {
        where: { id }, // Condition to find the record
        transaction: t, // Transaction
      }
    );

    // Check if the state was found and updated
    if (updatedRows === 0) {
      await t.rollback();
      return res.status(404).json({
        status: false,
        message: "District not found or no changes made.",
      });
    }

    await t.commit();

    console.log("Updated district details:", updatedRows);

    res.status(200).json({
      status: true,
      message: "District details updated successfully.",
    });
  } catch (err) {
    await t.rollback(); // Rollback transaction on error
    console.error("Error updating district:", err);
    res.status(500).json({
      status: false,
      message: "An error occurred while updating district details.",
      error: err.message,
    });
  }
};

exports.deleteDistrict = async (req, res, next) => {
  const districtId = req.params.Id;
  try {
    // Find and delete the state
    const district = await District.destroy({
      where: { id: districtId },
    });

    if (district === 0) {
      return res.status(404).json({ message: "State not found" });
    }

    res.status(200).json({
      status: true,
      message: "District deleted successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: false,
      message: "An error occurred while deleting a district",
      error: err.message,
    });
  }
};

// mandi data handling
exports.getMandis = async (req, res, next) => {
  try {
    const { districtId, id } = req.query;
    let details;
    if (districtId) {
      const mandis = await Mandi.findAll({
        where: { districtId },
        order: [["name", "ASC"]],
        include: [
          {
            model: District,
            attributes: ["name"], // Fetch District name
            include: [
              {
                model: State,
                attributes: ["name"], // Fetch State name
              },
            ],
          },
        ],
      });

      details = mandis.map((ele) => {
        const obj = {
          id: ele.id,
          name: ele.name,
          district: ele.district.name,
          state: ele.district.state.name,
          createdAt: format(new Date(ele.createdAt), "dd-MM-yyyy"),
        };

        return obj;
      });
    } else if (id) {
      const mandi = await Mandi.findOne({
        where: { id },
        include: [
          {
            model: District,
            attributes: ["name"], // Fetch District name
            include: [
              {
                model: State,
                attributes: ["name"], // Fetch State name
              },
            ],
          },
        ],
      });

      // If mandi not found
      if (!mandi) {
        return res.status(404).json({
          status: false,
          message: "Mandi not found.",
        });
      }

      details = {
        name: mandi.name,
        district: mandi.district.name,
        state: mandi.district.state.name,
        createdAt: format(new Date(mandi.createdAt), "dd-MM-yyyy HH:mm:ss"),
        updatedAt: format(new Date(mandi.updatedAt), "dd-MM-yyyy HH:mm:ss"),
      };
    }

    console.log("*****mandi details*******", details);

    res.status(200).json({
      status: true,
      mandiDetails: details,
      message: "Data Fetched Successfully",
    });
  } catch (err) {
    console.error("Error fetching mandis:", err);

    res.status(500).json({
      status: false,
      message: "An error occurred while fetching mandi data.",
      error: err.message || err.toString(),
    });
  }
};

exports.addMandi = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    console.log("Received data for adding mandi:", req.body);

    const { mandiName, districtId } = req.body;
    // console.log("**********addDistrict******", req.body);
    if (!mandiName || mandiName.trim() === "") {
      return res.status(400).json({
        status: false,
        message: "Mandi name cannot be empty.",
      });
    }

    const data = await Mandi.create(
      {
        name: mandiName,
        districtId: districtId,
      },
      { transaction: t }
    );

    await t.commit();

    console.log("Mandi added successfully:", data);

    res.status(201).json({
      status: true,
      message: "Mandi added successfully to the district",
    });
  } catch (err) {
    await t.rollback();
    console.error("Error adding mandi:", err);

    // Error response
    res.status(500).json({
      status: false,
      message: "An error occurred while adding the mandi.",
      error: err.message || err.toString(),
    });
  }
};

exports.updateMandiDetails = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    // console.log("*************edit district form data********", req.body);

    const id = req.params.Id;
    const { mandiName } = req.body;

    // Validation for empty or missing `stateName`
    if (!mandiName || mandiName.trim() === "") {
      await t.rollback();
      return res.status(400).json({
        status: false,
        message: "Invalid data! Mandi name cannot be empty.",
      });
    }

    // Update state details
    const [updatedRows] = await Mandi.update(
      { name: mandiName.trim() }, // Data to update
      {
        where: { id }, // Condition to find the record
        transaction: t, // Transaction
      }
    );

    // Check if the state was found and updated
    if (updatedRows === 0) {
      await t.rollback();
      return res.status(404).json({
        status: false,
        message: "Mandi not found or no changes made",
      });
    }

    await t.commit();

    console.log("Updated mandi details:", updatedRows);

    res.status(200).json({
      status: true,
      message: "Mandi details updated successfully.",
    });
  } catch (err) {
    await t.rollback(); // Rollback transaction on error

    console.error("Error updating mandi:", err);

    res.status(500).json({
      status: false,
      message: "An error occurred while updating mandi details.",
      error: err.message,
    });
  }
};

exports.deleteMandi = async (req, res, next) => {
  const mandiId = req.params.Id;
  try {
    // Find and delete the state
    const mandi = await Mandi.destroy({
      where: { id: mandiId },
    });

    if (mandi === 0) {
      return res.status(404).json({ message: "Mandi not found" });
    }

    res.status(200).json({ message: "Mandi deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: false,
      message: "An error occurred while deleting a mandi",
      error: err.message,
    });
  }
};

// depot data handling
exports.getDepots = async (req, res, next) => {
  try {
    const { districtId, id } = req.query;

    let details;

    if (districtId) {
      const depot = await Depot.findAll({
        where: { districtId },
        order: [["name", "ASC"]],
        include: [
          {
            model: District,
            attributes: ["name"], // Fetch District name
            include: [
              {
                model: State,
                attributes: ["name"], // Fetch State name
              },
            ],
          },
        ],
      });

      details = depot.map((ele) => {
        const obj = {
          id: ele.id,
          name: ele.name,
          district: ele.district.name,
          state: ele.district.state.name,
          createdAt: format(new Date(ele.createdAt), "dd-MM-yyyy"),
        };

        return obj;
      });
    } else if (id) {
      depot = await Depot.findOne({
        where: { id },
        include: [
          {
            model: District,
            attributes: ["name"], // Fetch District name
            include: [
              {
                model: State,
                attributes: ["name"], // Fetch State name
              },
            ],
          },
        ],
      });

      if (!depot) {
        return res.status(404).json({
          message: "Depot not found",
        });
      }

      // console.log("state********", states);
      details = {
        name: depot.name,
        district: depot.district.name,
        state: depot.district.state.name,
        createdAt: format(new Date(depot.createdAt), "dd-MM-yyyy HH:mm:ss"),
        updatedAt: format(new Date(depot.updatedAt), "dd-MM-yyyy HH:mm:ss"),
      };
    }

    res.status(200).json({
      status: true,
      depotDetails: details,
      message: "Data Fetched Successfully",
    });
  } catch (err) {
    console.error("Error fetching depots:", err);

    res.status(500).json({
      message: "An error occurred while fetching depot details.",
      error: err.message || err.toString(),
    });
  }
};

exports.addDepot = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { depotName, districtId } = req.body;

    if (!depotName || depotName.trim() === "") {
      return res.status(400).json({
        status: false,
        message: "Depot name cannot be empty.",
      });
    }

    const data = await Depot.create(
      {
        name: depotName,
        districtId: districtId,
      },
      { transaction: t }
    );

    await t.commit();

    console.log("Depot created successfully:", data);

    res.status(201).json({
      status: true,
      message: "Depot added successfully to the district",
    });
  } catch (err) {
    await t.rollback();

    console.error("Error adding depot:", err);

    res.status(500).json({
      status: false,
      message: "An error occurred while adding the depot.",
      error: err.message || err.toString(),
    });
  }
};

exports.updateDepotDetails = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    // console.log("*************edit district form data********", req.body);

    const id = req.params.Id;
    const { depotName } = req.body;

    // Validation for empty or missing `stateName`
    if (!depotName || depotName.trim() === "") {
      await t.rollback();
      return res.status(400).json({
        status: false,
        message: "Invalid data! Depot name cannot be empty.",
      });
    }

    // Update state details
    const [updatedRows] = await Depot.update(
      { name: depotName.trim() }, // Data to update
      {
        where: { id }, // Condition to find the record
        transaction: t, // Transaction
      }
    );

    // Check if the state was found and updated
    if (updatedRows === 0) {
      await t.rollback();
      return res.status(404).json({
        status: false,
        message: "Depot not found or no changes made",
      });
    }

    await t.commit();

    console.log("Updated depot details:", updatedRows);

    res.status(200).json({
      status: true,
      message: "Depot details updated successfully",
    });
  } catch (err) {
    await t.rollback(); // Rollback transaction on error
    console.error("Error updating depot:", err);
    res.status(500).json({
      status: false,
      message: "An error occurred while updating depot details.",
      error: err.message,
    });
  }
};

exports.deleteDepot = async (req, res, next) => {
  const depotId = req.params.Id;
  try {
    // Find and delete the state
    const depot = await Depot.destroy({
      where: { id: depotId },
    });

    if (depot === 0) {
      return res.status(404).json({ message: "Depot not found" });
    }

    res.status(200).json({ message: "Depot deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: false,
      message: "An error occurred while deleting the depot",
      error: err.message,
    });
  }
};

// roles data handling
exports.getRoles = async (req, res, next) => {
  try {
    const { id } = req.query;
    console.log(id);

    let details;

    if (id) {
      const role = await Role.findOne({
        where: { id }, // Match the provided ID
        include: [
          {
            model: Permission,
            through: { attributes: [] }, // Exclude the join table attributes
            attributes: ["id", "name"], // Get the id and name of permissions
          },
        ],
      });

      if (!role) {
        return res.status(404).json({
          status: false,
          message: "Role not found.",
        });
      }

      console.log("Role details", role.permissions);

      details = {
        name: role.name,
        createdAt: format(new Date(role.createdAt), "dd-MM-yyyy HH:mm:ss"),
        updatedAt: format(new Date(role.updatedAt), "dd-MM-yyyy HH:mm:ss"),
        permissions: role.permissions.map((ele) => ({
          id: ele.id,
          name: ele.name,
        })),
      };
    } else {
      // Fetch all roles without permissions
      const roles = await Role.findAll({
        order: [["name", "ASC"]],
      });

      details = roles.map((ele) => {
        return {
          id: ele.id,
          name: ele.name,
          createdAt: format(new Date(ele.createdAt), "dd-MM-yyyy"),
        };
      });
    }

    res.status(200).json({
      status: true,
      roleDetails: details,
      message: "Data Fetched Successfully",
    });
  } catch (err) {
    // Log and handle errors
    console.error("Error fetching roles:", err);
    res.status(500).json({
      status: false,
      message: "An error occurred while fetching roles details.",
      error: err.message || err.toString(),
    });
  }
};

exports.addRole = async (req, res, next) => {
  const t = await sequelize.transaction(); // Start transaction
  try {
    console.log("*************add permission form data********", req.body);
    const { roleName, permissions } = req.body;

    // Validate role name
    if (!roleName || typeof roleName !== "string" || roleName.trim() === "") {
      // Return error early without proceeding to transaction
      return res.status(400).json({
        status: false,
        message: "Invalid role name!",
      });
    }

    // Validate permissions array
    const validPermissions = await Permission.findAll({
      where: { id: permissions },
    });

    if (validPermissions.length !== permissions.length) {
      // Return error if some permission IDs are invalid
      return res.status(400).json({
        status: false,
        message: "One or more permission IDs are invalid!",
      });
    }

    // Create the role
    const role = await Role.create(
      { name: roleName.trim() },
      { transaction: t }
    );

    // Associate permissions with the role
    await role.setPermissions(permissions, { transaction: t });

    // Commit the transaction if everything is successful
    await t.commit();

    console.log("Role created:", role);

    res.status(201).json({
      status: true,
      message: "Role added successfully",
    });
  } catch (err) {
    // Only rollback the transaction if an error occurs
    await t.rollback();

    console.error("Error while adding role:", err);

    res.status(500).json({
      status: false,
      message: "An error occurred while adding the role.",
      error: err.message || err.toString(),
    });
  }
};

exports.updateRoleDetails = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    console.log("Received edit role form data:", req.body);

    const id = req.params.Id;
    const { roleName, permissions } = req.body;

    // Validation for empty or missing `roleName`
    if (!roleName || typeof roleName !== "string" || roleName.trim() === "") {
      await t.rollback();
      return res.status(400).json({
        status: false,
        message: "Role name cannot be empty or invalid.",
      });
    }

    // Validate permissions array
    const validPermissions = await Permission.findAll({
      where: { id: permissions },
    });

    if (validPermissions.length !== permissions.length) {
      await t.rollback(); // Rollback before returning error
      return res.status(400).json({
        status: false,
        message: "One or more permission IDs are invalid!",
      });
    }

    // Find the role
    const role = await Role.findByPk(id, { transaction: t });

    if (!role) {
      await t.rollback(); // Rollback before returning error
      return res.status(404).json({
        status: false,
        message: "Role not found.",
      });
    }

    // Update role name if needed
    await role.update({ name: roleName.trim() }, { transaction: t });

    // Update permissions
    await role.setPermissions(permissions, { transaction: t });

    // Commit the transaction
    await t.commit();

    console.log("Updated role details successfully.");

    res.status(200).json({
      status: true,
      message: "Role details updated successfully.",
    });
  } catch (err) {
    if (t.finished !== "commit") {
      await t.rollback(); // Rollback transaction only if not committed
    }

    console.error("Error updating role details:", err);

    res.status(500).json({
      status: false,
      message: "An error occurred while updating role details.",
      error: err.message || err.toString(),
    });
  }
};

exports.deleteRole = async (req, res, next) => {
  const roleId = req.params.Id;
  try {
    // Find and delete the state
    const role = await Role.destroy({
      where: { id: roleId },
    });

    if (role === 0) {
      return res.status(404).json({ message: "Role not found" });
    }

    res.status(200).json({ message: "Role deleted successfully" });
  } catch (err) {
    console.error("Error deleting role:", err);

    res.status(500).json({
      status: false,
      message: "An error occurred while deleting a role",
      error: err.message,
    });
  }
};

//permission  data handling
exports.getPermissions = async (req, res, next) => {
  try {
    const { id } = req.query;
    console.log(id);

    let details;

    if (id) {
      // Fetch state details by ID
      const permission = await Permission.findOne({
        where: { id }, // Match the provided ID
      });
      if (!permission) {
        return res.status(404).json({
          status: false,
          message: "Permission not found.",
        });
      }
      // console.log("state********", states);
      details = {
        name: permission.name,
        createdAt: format(
          new Date(permission.createdAt),
          "dd-MM-yyyy HH:mm:ss"
        ),
        updatedAt: format(
          new Date(permission.updatedAt),
          "dd-MM-yyyy HH:mm:ss"
        ),
      };
    } else {
      // Fetch all depot details
      const permissions = await Permission.findAll();
      details = permissions.map((ele) => {
        const obj = {
          id: ele.id,
          name: ele.name,
          createdAt: format(new Date(ele.createdAt), "dd-MM-yyyy"),
        };

        return obj;
      });
      // console.log("00000000000000000", details);
    }

    res.status(200).json({
      status: true,
      permissionDetails: details,
      message: "Data Fetched Successfully",
    });
  } catch (err) {
    // Log and handle errors
    console.error("Error fetching permissions:", err);
    res.status(500).json({
      status: false,
      message: "An error occurred while fetching permission details.",
      error: err.message || err.toString(),
    });
  }
};

exports.addPermission = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    // console.log("*************add state form data********", req.body);
    const { permissionName } = req.body;

    if (
      !permissionName ||
      typeof permissionName !== "string" ||
      permissionName.trim() === ""
    ) {
      await t.rollback();
      return res.status(400).json({
        status: false,
        message: "Invalid permission name!",
      });
    }

    const data = await Permission.create(
      {
        name: permissionName.trim(),
      },
      { transaction: t }
    );

    await t.commit();

    console.log("permission created:", data);

    res.status(201).json({
      status: true,
      message: "Permission added successfully",
    });
  } catch (err) {
    await t.rollback();
    console.error("Error while adding permission:", err);
    res.status(500).json({
      status: false,
      message: "An error occurred while adding the permission.",
      error: err.message || err.toString(),
    });
  }
};

exports.updatePermissionDetails = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    console.log("Received edit permission form data:", req.body);

    const id = req.params.Id;
    const { permissionName } = req.body;

    // Validation for empty or missing `stateName`
    if (
      !permissionName ||
      typeof permissionName !== "string" ||
      permissionName.trim() === ""
    ) {
      await t.rollback();
      return res.status(400).json({
        status: false,
        message: "permission name cannot be empty or invalid.",
      });
    }

    const [updatedRows] = await Permission.update(
      { name: permissionName.trim() },
      {
        where: { id },
        transaction: t,
      }
    );

    // Check if the permission was found and updated
    if (updatedRows === 0) {
      await t.rollback();
      return res.status(404).json({
        status: false,
        message: "Permission not found or no changes made.",
      });
    }

    await t.commit();

    console.log("Updated Permission details:", updatedRows);

    res.status(200).json({
      status: true,
      message: "Permission details updated successfully.",
    });
  } catch (err) {
    await t.rollback(); // Rollback transaction on error

    console.error("Error updating permission details:", err);

    res.status(500).json({
      status: false,
      message: "An error occurred while updating permission details.",
      error: err.message || err.toString(),
    });
  }
};

exports.deletePermission = async (req, res, next) => {
  const permissionId = req.params.Id;
  try {
    // Find and delete the state
    const permission = await Permission.destroy({
      where: { id: permissionId },
    });

    if (permission === 0) {
      return res.status(404).json({ message: "Permission not found" });
    }

    res.status(200).json({ message: "Permission deleted successfully" });
  } catch (err) {
    console.error("Error deleting permission:", err);

    res.status(500).json({
      status: false,
      message: "An error occurred while deleting a permission",
      error: err.message,
    });
  }
};

//license  data handling
function numberInvalidity(number) {
  if (
    number === undefined ||
    number === null ||
    typeof number !== "number" ||
    isNaN(number) ||
    !Number.isInteger(number) ||
    number <= 0
  ) {
    return true;
  }
  return false;
}
exports.getLicenses = async (req, res, next) => {
  try {
    const { id } = req.query;
    console.log(id);

    let details;

    if (id) {
      // Fetch state details by ID
      const license = await License.findOne({
        where: { id }, // Match the provided ID
      });
      if (!license) {
        return res.status(404).json({
          status: false,
          message: "License not found.",
        });
      }
      // console.log("state********", states);
      details = {
        name: license.name,
        maxSubAdmin: license.maxSubAdmin,
        maxAccounts: license.maxAccounts,
        maxNormalUsers: license.maxNormalUsers,
        validDuration: license.validDuration,
        createdAt: format(new Date(license.createdAt), "dd-MM-yyyy HH:mm:ss"),
        updatedAt: format(new Date(license.updatedAt), "dd-MM-yyyy HH:mm:ss"),
      };
    } else {
      // Fetch all depot details
      const licenses = await License.findAll();
      details = licenses.map((ele) => {
        const obj = {
          id: ele.id,
          name: ele.name,
          createdAt: format(new Date(ele.createdAt), "dd-MM-yyyy"),
        };

        return obj;
      });
      // console.log("00000000000000000", details);
    }

    res.status(200).json({
      status: true,
      licenseDetails: details,
      message: "Data Fetched Successfully",
    });
  } catch (err) {
    // Log and handle errors
    console.error("Error fetching licenses:", err);
    res.status(500).json({
      status: false,
      message: "An error occurred while fetching license details.",
      error: err.message || err.toString(),
    });
  }
};

exports.addLicense = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    console.log("*************add license form data********", req.body);
    const { licenseName, subAdmin, accounts, nUsers, validDuration } = req.body;

    if (
      !licenseName ||
      typeof licenseName !== "string" ||
      licenseName.trim() === "" ||
      numberInvalidity(+subAdmin) ||
      numberInvalidity(+accounts) ||
      numberInvalidity(+nUsers) ||
      numberInvalidity(+validDuration)
    ) {
      await t.rollback();
      return res.status(400).json({
        status: false,
        message: "Invalid data entered by user !",
      });
    }

    const data = await License.create(
      {
        name: licenseName.trim(),
        maxSubAdmin: subAdmin,
        maxAccounts: accounts,
        maxNormalUsers: nUsers,
        validDuration: validDuration,
      },
      { transaction: t }
    );

    await t.commit();

    console.log("license created:", data);

    res.status(201).json({
      status: true,
      message: "License added successfully",
    });
  } catch (err) {
    await t.rollback();
    console.error("Error while adding license:", err);
    res.status(500).json({
      status: false,
      message: "An error occurred while adding the license.",
      error: err.message || err.toString(),
    });
  }
};

exports.updateLicenseDetails = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    console.log("Received edit license form data:", req.body);

    const id = req.params.Id;
    const { licenseName, subAdmin, accounts, nUsers, validDuration } = req.body;

    // Validation for empty or missing `stateName`
    if (
      !licenseName ||
      typeof licenseName !== "string" ||
      licenseName.trim() === "" ||
      numberInvalidity(+subAdmin) ||
      numberInvalidity(+accounts) ||
      numberInvalidity(+nUsers) ||
      numberInvalidity(+validDuration)
    ) {
      await t.rollback();
      return res.status(400).json({
        status: false,
        message: "Invalid data entered by user !",
      });
    }

    const [updatedRows] = await License.update(
      {
        name: licenseName.trim(),
        maxSubAdmin: subAdmin,
        maxAccounts: accounts,
        maxNormalUsers: nUsers,
        validDuration: validDuration,
      },
      {
        where: { id },
        transaction: t,
      }
    );

    // Check if the license was found and updated
    if (updatedRows === 0) {
      await t.rollback();
      return res.status(404).json({
        status: false,
        message: "License not found or no changes made.",
      });
    }

    await t.commit();

    console.log("Updated license details:", updatedRows);

    res.status(200).json({
      status: true,
      message: "License details updated successfully.",
    });
  } catch (err) {
    await t.rollback(); // Rollback transaction on error

    console.error("Error updating license details:", err);

    res.status(500).json({
      status: false,
      message: "An error occurred while updating license details.",
      error: err.message || err.toString(),
    });
  }
};

exports.deleteLicense = async (req, res, next) => {
  const licenseId = req.params.Id;
  try {
    // Find and delete the state
    const license = await License.destroy({
      where: { id: licenseId },
    });

    if (license === 0) {
      return res.status(404).json({ message: "License not found" });
    }

    res.status(200).json({ message: "License deleted successfully" });
  } catch (err) {
    console.error("Error deleting license:", err);

    res.status(500).json({
      status: false,
      message: "An error occurred while deleting a license",
      error: err.message,
    });
  }
};
