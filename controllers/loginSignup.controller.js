const userModel = require("../models/user.model");
const studentModel = require("../models/student.model");
const logger = require("../loggingFunction");
const lineNumber = require("../lineNumberFunction");
const jwt = require("jsonwebtoken");
const secureData = require("../utils/secureData");
const { generateToken, createToken } = require("../utils/generateToken");

const { sendMail } = require("../utils/sendMail");
const { emailValidator, tokenValidator, roleSelected } = require("../validator");
const { seqValidator, checkPassword, checkEmail,validateEmail } = require("../validator");
const { body, param } = require("express-validator");
const { VERIFY_EMAIL, RESET_PASSWORD, EMAIL_VERIFIED, PASSWORD_CHANGED, RESET_PASSWORD_SUCCESS,GET_IN_TOUCH } = require("../constants");
const { v1 } = require("uuid");
const { response } = require("express");

module.exports = {
  verifyEmail: async function (req, res) {
    try {
      logger("info", req, "", lineNumber.__line);
      const errors = await seqValidator(req, [param("token").trim().exists().withMessage("Wrong credentials passed").custom(tokenValidator)]);
      if (!errors.isEmpty()) {
        logger(
          "error",
          req,
          {
            errors: errors.array(),
          },
          lineNumber.__line
        );
        return res.status(400).send({
          errors: errors.array(),
        });
      }
      const userObject = await userModel.findOne({ email: req.user.email });

      if (userObject) {
        userObject.isVerified = true;
        let data = {
          name: userObject.fullName,
        };
        await sendMail(userObject.fullName, userObject.email, EMAIL_VERIFIED, data);

        await userObject.save();
        // return res.status(201).send(`
        // <p>User verified, login with your credentials </p>
        // <a href="${process.env.BASE_URL}/emailVerified">
        // Click here to go to website
        // </a>

        // `);
        return res.redirect(`${process.env.CLIENT_URL}/emailVerified`);
      }

      return res.status(419).send("Invalid");
    } catch (err) {
      logger("error", req, err, lineNumber.__line);
      console.log(err, lineNumber.__line);
      res.status(500).send({
        errors: [
          {
            code: 500,
            message: "Internal Server Error",
            error: err,
          },
        ],
      });
    }
  },
  signupUser: async function (req, res) {
    // return console.log(process.env.BASE_URL)
    try {
      logger("info", req, "", lineNumber.__line);
      const errors = await seqValidator(req, [
        body("email").isEmail().withMessage("Invalid email address"),
        body("password").isLength({ min: 8 }).exists().withMessage("Password is mandatory"),
        body("fullName").exists().withMessage("full name is mandatory"),
      ]);
      if (!errors.isEmpty()) {
        logger(
          "error",
          req,
          {
            errors: errors.array(),
          },
          lineNumber.__line
        );
        return res.status(400).send({
          errors: errors.array(),
        });
      }

      var { email, password, fullName, role } = req.body;
      const roleModel = role;

      const userFound = await userModel.findOne({ email });
      console.log(123, 97);
      if (userFound) {
        if (!userFound.isVerified) {
          let exp = "3d";
          let obj = {
            email: userFound.email,
            id: userFound._id,
          };
          let token = await generateToken(obj, exp);
          let link = `${process.env.BASE_URL}/verify/${token}`;
          // console.log(link,"link");
          data = {
            name: fullName,
            link,
          };
          await sendMail(fullName, email, VERIFY_EMAIL, data);
        }

        return res.status(201).send({ status: false, message: "User Already Exists" });
      }

      password = secureData.encrypt(password);
      const user = new userModel({ email, password, fullName, role, roleModel });
      const userObject = await user.save();

      if (role === "Student") {
        const student = new studentModel({
          userId: userObject._id,
        });

        const studentData = await student.save();
        console.log(studentData, 128);
        await userModel.findByIdAndUpdate({ _id: userObject._id }, { onType: studentData._id });
        console.log("Student Created");
      }
      const exp = "3d";
      const obj = {
        email: userObject.email,
        id: userObject._id,
      };
      const token = await generateToken(obj, exp);
      const link = `${process.env.BASE_URL}/verify/${token}`;
      // console.log(link,"link");
      data = {
        name: fullName,
        link,
      };
      await sendMail(fullName, email, VERIFY_EMAIL, data);
      res.status(201).send({ status: true, message: "Sign up successfully" });
      logger("debug", req, userObject, lineNumber.__line);
    } catch (err) {
      logger("error", req, err, lineNumber.__line);
      console.log(err, lineNumber.__line);
      res.status(500).send({
        errors: [
          {
            code: 500,
            message: "Internal Server Error",
            error: err,
          },
        ],
      });
    }
  },
  login: async function (req, res) {
    try {
      logger("info", req, "", lineNumber.__line);
      const errors = await seqValidator(req, [
        body("email").isEmail().exists().withMessage("Mandatory field").custom(checkEmail),
        body("password").exists().withMessage("Mandatory field").custom(checkPassword),
      ]);
      if (!errors.isEmpty()) {
        logger(
          "error",
          req,
          {
            errors: errors.array(),
          },
          lineNumber.__line
        );
        return res.status(200).send({
          errors: errors.array(),
        });
      }
      const user = await userModel.findOne({
        email: req.body.email,
        isVerified: true,
      });

      if (user) {
        const token = await createToken(user);

        if (user.role === undefined) {
          return res.status(200).json({ ...user, token: token });
        } else {
          return res.status(201).send({ ...user, token: token });
        }
      } else {
        let customErrors = [];
        customErrors.push({ msg: "user is not verified please verify your email " });
        return res.status(200).json({ ...user, errors: customErrors });
      }
    } catch (err) {
      logger("error", req, err, lineNumber.__line);
      console.log(err, lineNumber.__line);
      res.status(500).send({
        errors: [
          {
            code: 500,
            message: "Internal Server Error",
            error: err,
          },
        ],
      });
    }
  },
  resetPassword: async function (req, res) {
    try {
      logger("info", req, "", lineNumber.__line);
      const errors = await seqValidator(req, [body("email").isEmail().exists().withMessage("Email required for password reset")]);
      if (!errors.isEmpty()) {
        logger("error", req, err, lineNumber.__line);
      }

      const token = Math.floor(100000 + Math.random() * 900000);
      // Save token in DB
      const userObj = await userModel.findOneAndUpdate({ email: req.body.email }, { token: token }, { upsert: true }); // console.log(userObject,"user");

      data = {
        name: userObj.fullName,
        token,
      };
      // return console.log(userObj);
      // Send Token in mail
      await sendMail(userObj.fullName, userObj.email, RESET_PASSWORD, data);
      return res.status(200).json({ status: 1, msg: "code has been sent to your email" });
    } catch (err) {
      logger("error", req, err, lineNumber.__line);
      console.log(err, lineNumber.__line);
      res.status(500).send({
        errors: [
          {
            code: 500,
            message: "Internal Server Error",
            error: err,
          },
        ],
      });
    }
  },
  handleReset: async function (req, res) {
    try {
      logger("info", req, "", lineNumber.__line);
      const errors = await seqValidator(req, [
        body("email").isEmail().exists().withMessage("Email required for password reset"),
        body("token").trim().exists().withMessage("Wrong credentials passed"),
        body("password").exists().withMessage("Password field missing"),
      ]);
      if (!errors.isEmpty()) {
        logger("error", req, errors, lineNumber.__line);
        return res.status(400).send(errors.array());
      }

      const userObject = await userModel.findOne({ email: req.body.email });

      if (!(userObject.token === req.body.token)) {
        return res.status(200).send("Invalid Token");
      }
      // console.log("V");
      userObject.password = secureData.encrypt(req.body.password);
      await userObject.save();

      data = {
        name: userObject.fullName,
      };

      // Send Token in mail
      await sendMail(userObject.fullName, userObject.email, RESET_PASSWORD_SUCCESS, data);
      return res.status(201).send("Your password has been changed");
    } catch (err) {
      logger("error", req, err, lineNumber.__line);
      console.log(err, lineNumber.__line);
      res.status(500).send({
        errors: [
          {
            code: 500,
            message: "Internal Server Error",
            error: err,
          },
        ],
      });
    }
  },
  socialRoleSelection: async function (req, res) {
    try {
      logger("info", req, "", lineNumber.__line);
      const errors = await seqValidator(req, [body("role").trim().exists().withMessage("Select a Role").custom(roleSelected)]);
      if (!errors.isEmpty()) {
        logger(
          "error",
          req,
          {
            errors: errors.array(),
          },
          lineNumber.__line
        );
        return res.status(400).send({
          errors: errors.array(),
        });
      }
      const update = {
        role: req.body.role,
        roleModel: req.body.role,
      };
      const updateRole = await userModel.findByIdAndUpdate(req.user.id, update, { new: true });
      logger("debug", req, updateRole, lineNumber.__line);
      console.log(updateRole);
      if (updateRole) {
        const token = await createToken(updateRole);
        if (updateRole.isVerified == true) {
          return res.status(201).send(token);
        } else {
          return res.status(200).send("Role is selected, Verify your email to login");
        }
      } else throw "Try again";
    } catch (err) {
      logger("error", req, err, lineNumber.__line);
      console.log(err, lineNumber.__line);
      res.status(500).send({
        errors: [
          {
            code: 500,
            message: "Internal Server Error",
            error: err,
          },
        ],
      });
    }
  },
  authDetail: async function (req, res) {
    try {
      const authDetailUser = await userModel.findOne({
        _id: req.user.id,
        isVerified: true,
      });
      if (authDetailUser) {
        const token = await createToken(authDetailUser);
        console.log("my", token);
        authDetailUser.role != undefined
          ? res.status(200).send({ msg: "Login", token: token, role: authDetailUser.role })
          : res.status(206).send({ msg: "Select Role" });
      } else {
        return res.status(403).send("Unforbidden");
      }
    } catch (err) {
      logger("error", req, err, lineNumber.__line);
      console.log(err, lineNumber.__line);
      res.status(500).send({
        errors: [
          {
            code: 500,
            message: "Internal Server Error",
            error: err,
          },
        ],
      });
    }
  },
  changePassword: async function (req, res) {
    try {
      let response = {
        status: false,
        message: "",
      };
      //       oldPassword
      // newPassword
      // confirmNewPassword
      if (req.body.oldPassword === "") {
        response.message = "Please enter old password";
        return res.status(200).send(response);
      }
      if (req.body.newPassword && req.body.newPassword.lenth < 8) {
        response.message = "Atleast 8 letters required";
        return res.status(200).send(response);
      }
      if (req.body.newPassword !== req.body.confirmNewPassword) {
        response.message = "New passwords and confirm new password don't match";
        return res.status(200).send(response);
      }

      userModel.findById({ _id: req.user.id }).then(async (chk) => {
        const password = await secureData.decrypt(chk.password);
        if (password != req.body.oldPassword) {
          response.message = "Incorrect password";
          return res.status(200).send(response);
        } else {
          // chk.password = secureData.encrypt(password);
          const userObject = await userModel.findByIdAndUpdate(
            { _id: req.user.id },
            { $set: { password: secureData.encrypt(req.body.newPassword) } }
          );

          let data = {};
          // console.log(chk.email);
          await sendMail(chk.fullName, chk.email, PASSWORD_CHANGED, data);

          response.status = true;
          response.message = "Password changed successfully";
          return res.status(200).send(response);
        }
      });
    } catch (e) {
      console.log(e);
      response.message = "Server Error";
      response.errMessage = e;
      res.status(500).send(response);
    }
  },

  getInTouch: async function (req, res) {
    try {
      let response = {
        status: false,
        message: "",
      };

      if (req.body.name === "" || !req.body.name) {
        response.message = "Please Enter Name";
        return res.status(200).send(response);
      }

      if (req.body.email === "" || !req.body.email) {
        response.message = "Please Enter Email";
        return res.status(200).send(response);
      }

      if(!validateEmail(req.body.email)){
        response.message = "Please Enter a Valid Email";
        return res.status(200).send(response);
      }

      if (req.body.message === "" || !req.body.message) {
        response.message = "Please Enter Message";
        return res.status(200).send(response);
      }

      // console.log(req.body, "G");
      data = {
        name:req.body.name,
        email:req.body.email,
        message:req.body.message,
        time:req.body.time,
      };

      await sendMail(`Query From ${data.name}`, "support@neurolingua.in", GET_IN_TOUCH, data);

      response.status = true;
      response.message = "Message Sent Successfully";
      return res.status(200).send(response);

    } catch (e) {
      console.log(e);
      response.message = "Server Error";
      response.errMessage = e;
      res.status(500).send(response);
    }
  },
};
