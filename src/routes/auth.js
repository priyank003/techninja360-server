const router = require("express").Router();
const User = require("../models/user/user.mongo");
const catchAsync = require("../utils/catchAsync");
const { randomBytes } = require("crypto");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const {
  httpAuthLocalSignup,
  httpAuthLogin,
  httpAuthGoogleCallbackSignup,
  httpAuthLogout,
  httpLoginSuccess,
  httpAuthFacebookCallbackSignup,
} = require("../controllers/auth.controller");

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - first_name
 *         - last_name
 *         - phone_no
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the user
 *         first_name:
 *           type: string
 *           description: first name of user
 *         last_name:
 *           type: String
 *           description: last name of user
 *         email:
 *           type: string
 *           description: email id of user
 *         phone_no:
 *           type: Number
 *           description: user phone no
 *       example:
 *         id: d5fE_asz
 *         first_name: Priyank
 *         last_name: Patil
 *         email: priyankabc@gmail.com
 *         password: eqdnwjnjkw
 *         phone_no: 123456789
 *
 *
 *   requestBodies:
 *     UserLogin:
 *       description: User login object email and password
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *       properties:
 *         email:
 *           type: string
 *           description: email id of user
 *         password:
 *           type: string
 *           description: password of user
 *       example:
 *         email: priyankabc@gmail.com
 *         password: eqdnwjnjkw
 *
 */

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User authentication api
 */

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Signup function
 *     tags: [Auth]
 *     requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref:  '#/components/schemas/User'
 *
 *     responses:
 *       200:
 *         description: jwt token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               items:
 *                 $ref: '#/components/schemas/User'
 *
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login function
 *     tags: [Auth]
 *     requestBody:
 *       $ref: '#/components/requestBodies/UserLogin'
 *
 *     responses:
 *       200:
 *         description: jwt token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               items:
 *                 $ref: '#/components/schemas/User'
 * /api/auth/google:
 *   get:
 *     summary: Google Auth function
 *     tags: [Auth]
 *
 *     responses:
 *       200:
 *         description: jwt token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               items:
 *                 $ref: '#/components/schemas/User'
 *
 * /api/auth/login/success:
 *   get:
 *     summary: Auth login function
 *     tags: [Auth]
 *
 *     responses:
 *       200:
 *         description: jwt token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               items:
 *                 $ref: '#/components/schemas/User'
 *
 *
 * /api/auth/logout:
 *   get:
 *     summary: Auth logout function
 *     tags: [Auth]
 *
 *     responses:
 *       200:
 *         description: jwt token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               items:
 *                 $ref: '#/components/schemas/User'
 *
 */

router.post("/signup", catchAsync(httpAuthLocalSignup));

router.post(
  "/login",
  (req, res, next) => {
    req.userData = { role: "user" };
    next();
  },
  passport.authenticate("user-local", {
    failureFlash: true,
  }),
  httpAuthLogin
);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  httpAuthGoogleCallbackSignup
);

router.get("/facebook", passport.authenticate("facebook"));

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "/",
    failureRedirect: "/fail",
  }),
  httpAuthFacebookCallbackSignup
);

router.get("/login/success", catchAsync(httpLoginSuccess));

router.get("/logout", catchAsync(httpAuthLogout));

module.exports = router;
