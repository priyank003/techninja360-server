const User = require("../models/user/user.mongo");
const { ErrorHandler } = require("../utils/error");
const { randomBytes } = require("crypto");
const jwt = require("jsonwebtoken");
const passport = require("passport");

const httpAuthLocalSignup = async (req, res, next) => {
  const { first_name, last_name, email, phone_no, password } = req.body;

  const user = new User({
    user_id: `u-${randomBytes(8).toString("hex")}`,
    first_name,
    last_name,
    email,
    phone_no,
  });

  const registeredUser = await User.register(user, password);

  req.login(registeredUser, (err) => {
    if (err) {
      const Error = new ErrorHandler(500, err.message);
      next(Error);
    }
    console.log(`welcome to techninja ${registeredUser.first_name}`);
  });

  const user_id = registeredUser.user_id;

  const token = jwt.sign(
    {
      user_id,
      email,
    },
    process.env.JWTSecretKey,
    {
      expiresIn: "1d",
    }
  );

  if (!token) {
    throw new ErrorHandler(500, "Jwt token could not be genreated");
  }

  res.status(200).json({
    status: "ok",
    message: "successfully registerd",
    user_data: {
      user_id,
      email,
      token,
      first_name,
      last_name,
      phone_no,
    },
  });
};

const httpAuthLogin = (req, res, next) => {
  try {
    // if (err) {
    //   next(new ErrorHandler(500, err.message));
    //   // console.log(babu);
    //   // throw new ErrorHandler(500, err.message);
    // }
    req.flash("success", "welcome back");
    const redirectUrl = req.session.returnTo || "/login";

    delete req.session.returnTo;

    const { user_id, email } = req.user;

    // req.flash("welcome to placement cell");

    let token;

    token = jwt.sign(
      {
        user_id,
        email,
      },
      process.env.JWTSecretKey,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      status: "ok",
      user_details: {
        user_id,
        email,
        token,
      },
    });
  } catch (err) {
    const Error = new ErrorHandler(500, err);
    next(Error);
  }
};

const httpAuthGoogleSignup = () => {};

const httpAuthGoogleCallbackSignup = (req, res) => {
  console.log("in google callback ");
  console.log("google msg", req.user.msg);
  var token = req.user.token;
  // Successful authentication, redirect home.
  console.log("user profile");
  console.log(req.user);
  console.log("google account succesfully logged in");
  res.redirect(`${process.env.client_url}/merchantProfile?token=` + token);
  // res.redirect("/");
};

const httpAuthFacebookCallbackSignup = (req, res) => {
  console.log("in facebook callback ", req.user);

  // console.log("google msg", req.user.msg);
  // var token = req.user.token;
  // // Successful authentication, redirect home.
  // console.log("user profile");
  // console.log(req.user);
  console.log("facebook account succesfully logged in");
  // res.redirect("http://localhost:3000/UserProfile?token=" + token);
};

const httpAuthLogout = (req, res) => {
  req.logout();
};

const httpLoginSuccess = (req, res) => {
  if (!req.user) {
    throw new ErrorHandler(403, "user session timed out");
  }
  res.status(200).json({
    success: true,
    message: "successfull",
    user: req.user,
  });
};

module.exports = {
  httpAuthLocalSignup,
  httpAuthLogin,
  httpAuthGoogleCallbackSignup,
  httpAuthLogout,
  httpLoginSuccess,
  httpAuthFacebookCallbackSignup,
};
