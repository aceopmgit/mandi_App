const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const { createTransport } = require("nodemailer");

const uuid = require("uuid");
const Joi = require("joi");

require("dotenv").config();

// model imports
const sequelize = require("../util/database.js");
const User = require("../models/User.js");
const Company = require("../models/Company.js");
const License = require("../models/License.js");
const Role = require("../models/Role.js");
const fPassword = require("../models/ForgotPassword.js");

// error handler imports
const CustomError = require("../util/customError");
const asyncErrorHandler = require("../util/asyncErrorHandler.js");

const { isStringInvalid } = require("../util/stringValidation.js");
const { generateAccessToken } = require("../util/userToken.js");

// function generateRefreshAccessToken(id, name) {
//   return jwt.sign({ userId: id, name: name }, process.env.TOKEN_SECRET, {
//     expiresIn: process.env.REFRESH_TOKEN_SECRET_EXPIRE,
//   });
// }

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
});

exports.addUser = asyncErrorHandler(async (req, res, next) => {
  const t = await sequelize.transaction();

  // Validate input using Joi
  const { error } = userValidationSchema.validate(req.body, {
    abortEarly: true,
  });

  if (error) {
    // Return all validation errors
    const errors = error.details.map((err) => err.message);
    return res.status(400).json({
      status: false,
      message: "Validation Failed",
      errors: errors,
    });
  }

  const { Name, Email, Phone, Password } = req.body;

  const existingEmail = await User.findOne({ where: { email: Email } });
  if (existingEmail) {
    return res.status(400).json({
      status: false,
      message: "Email already exists",
      errors: ["Email already exists"],
    });
  }

  // Check if the phone number already exists
  const existingPhone = await User.findOne({ where: { phone: Phone } });
  if (existingPhone) {
    return res.status(400).json({
      status: false,
      message: "Phone number already exists",
      errors: ["Phone number already exists"],
    });
  }

  // Hash the password using bcrypt with async/await
  const hash = await bcrypt.hash(Password, 10);

  // Fetch the Free-trial license and Admin role
  const license = await License.findOne({ where: { name: "Free-trial" } });
  const role = await Role.findOne({ where: { name: "Admin" } });

  if (!license || !role) {
    throw new Error("License or Role not found");
  }

  // Calculate the license expiry date
  const licenseDurationInDays = license.validDuration;
  const licenseStartDate = new Date();
  const licenseExpiryDate = new Date(
    licenseStartDate.setDate(licenseStartDate.getDate() + licenseDurationInDays)
  );

  // Create a new company
  const company = await Company.create({
    name: Name,
    email: Email,
    licenseId: license.id, // Free-trial license ID
    licenseStartDate: new Date(), // Current date
    licenseExpiryDate: licenseExpiryDate, // Calculated expiry date
    isActive: true, // Assuming new companies are active by default
  });

  // Create a new user within the transaction
  const user = await User.create(
    {
      name: Name,
      email: Email,
      phone: Phone,
      password: hash,
      roleId: role.id,
      companyId: company.id,
      isActive: true,
    },
    { transaction: t }
  );

  // Commit the transaction
  await t.commit();

  // Send success response
  res.status(201).json({
    status: true,
    message: "User Signed Up Successfully",
  });
});

exports.loginCheck = asyncErrorHandler(async (req, res, next) => {
  const email = validator.trim(req.body.Email);
  const password = validator.trim(req.body.Password);

  if (isStringInvalid(email) || isStringInvalid(password)) {
    return next(new CustomError("Bad Parameter. Invalid Data!", 400));
  }

  if (!validator.isEmail(email)) {
    return next(new CustomError("Invalid email format", 400));
  }

  const loginDetail = await User.findOne({
    where: { email: email },
  });

  if (!loginDetail) {
    return next(new CustomError("User not found", 404));
  }

  const match = await bcrypt.compare(password, loginDetail.password);
  if (!match) {
    return next(new CustomError("Incorrect password", 400));
  }

  const accessToken = generateAccessToken(loginDetail.id);
  res.status(200).json({
    success: true,
    message: "User Logged in Successfully!",
    token: accessToken,
  });
});

exports.logout = async (req, res, next) => {
  res
    .status(200)
    .clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    })
    .json({ message: "Logged out successfully" });
};

exports.refreshAccessToken = async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: "No refresh token provided" });
  }

  try {
    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    // You can also verify if the user still exists in the database if needed
    const user = await User.findByPk(decoded.userId);
    if (!user) {
      return res.status(403).json({ message: "User not found" });
    }

    // Generate a new access token
    const accessToken = generateAccessToken(user.id, user.name);

    res.status(200).json({
      success: true,
      message: "Access Token Refreshedy",
      token: accessToken,
    });
  } catch (err) {
    console.error(err);
    return res.status(403).json({ message: "Invalid refresh token" });
  }
};

exports.forgotpassword = async (req, res, next) => {
  res.sendFile(
    path.join(__dirname, "..", "views", "user", "forgotPassword.html")
  );
};

exports.resetEmail = asyncErrorHandler(async (req, res, next) => {
  const t = await sequelize.transaction();

  const user = await User.findOne({
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
                  <a href="${process.env.WEBSITE}/user/password/reset-password/${id}">Reset password</a>`,
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
});

exports.resetpassword = asyncErrorHandler(async (req, res, next) => {
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
                      <img src="/images/newLogo.png" alt="logo" />
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
                      "/admin/password/update-password/${id}",
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
});

exports.updatepassword = asyncErrorHandler(async (req, res, next) => {
  const t = await sequelize.transaction();

  const { newpassword } = req.body;

  const { resetPasswordId } = req.params;

  const reset = await fPassword.findOne({ where: { id: resetPasswordId } });

  const user = await User.findOne({ where: { id: reset.userId } });
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
});
