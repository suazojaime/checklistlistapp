// ---------------------------------------------------
// CONTROLLER SETUP - User
// ---------------------------------------------------

// 1) Importing External Libraries
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { ObjectId } = mongoose.Types; // Destructuring assignment to get ObjectId

// 2) Importing Model
const UserModel = require("../models/user.model");

// 3) Exporting Controller functions
module.exports = {
  // I) REGISTER
  register: (req, res) => {
    // i) Create a User instance with info passed in request
    // (this triggers our virtual field creation)
    const newUser = new UserModel(req.body);
    // ii) Save to the database newUser instance
    newUser
      .save()
      .then((newUser) => {
        res
          .status(201)
          .json({ message: "User successfully created", user: newUser });
      })
      .catch((err) => {
        if (err.name === "ValidationError") {
          return res
            .status(400)
            .json({ message: "Validation Errors", errors: err });
        }
        res.status(500).json({ message: "Something went wrong", errors: err });
      });
  },

  // II) LOGIN
  login: (req, res) => {
    // find the user that matches the email entered by the user
    UserModel.findOne({ email: req.body.email })
      .then((user) => {
        if (user === null) {
          // ERROR 1: email address is not in DB
          res.status(400).json({ message: "Login Error" });
        } else {
          // If a valid user with an email address is found, then verify password
          bcrypt
            .compare(req.body.password, user.password)
            .then((isPasswordValid) => {
              // If password is valid, then create a token and send it to the client by a cookie
              if (isPasswordValid) {
                // i) Create a token to store info using JWTs
                const userInfo = {
                  _id: user._id,
                  email: user.email,
                };
                console.log("userInfo: ", userInfo);
                const userToken = jwt.sign(userInfo, process.env.JWT_SECRET);

                // ii) Create cookie in HTTP response and attach signed token to it
                const cookieOptions = {
                  httpOnly: true, // this will make it so that JS on the client cannot access the cookie
                  expires: new Date(Date.now() + 900000000), // time until they have to log in again
                };

                res
                  .cookie("usertoken", userToken, cookieOptions)
                  .status(200)
                  .json({ message: "Successfully logged in", user: userInfo });
              } else {
                // ERROR 2: password does not match
                res.status(400).json({ message: "Login Error" });
              }
            })
            .catch((err) => {
              // ERROR 3: bcrypt.compare() failed (problem with promise)
              res.status(400).json({ message: "Login Error" });
            });
        }
      })
      .catch((err) => {
        // ERROR 4: findOne() failed (problem with promise)
        res.status(400).json({ message: "Login Error" });
      });
  },

  // III) LOGOUT
  logout: (req, res) => {
    // clear the cookie from the response
    res.clearCookie("usertoken");
    res.status(200).json({
      message: "You have successfully logged out of our system",
    });
  },
  // IV) READ ALL
  findAllUsers: (req, res) => {
    UserModel.find({})
      .then((allUsers) => res.status(200).json(allUsers))
      .catch((err) =>
        res.status(500).json({ message: "Something went wrong", error: err })
      );
  },

  // V) DELETE ALL
  deleteAllUsers: (req, res) => {
    UserModel.deleteMany({})
      .then((result) => res.status(200).json({ result: result }))
      .catch((err) =>
        res.status(500).json({ message: "Something went wrong", error: err })
      );
  },
};
