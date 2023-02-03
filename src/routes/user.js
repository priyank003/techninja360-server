const router = require("express").Router();
const catchAsync = require("../utils/catchAsync");

const {
  httpUpdateProfile,
  httpChangePassword,
  httpGetProfileDetails,
} = require("../controllers/user.controller");
const checkAuth = require("../middleware/check-auth");

router.use(checkAuth);

/**
 * @swagger
 * components:
 *   schemas:
 *     UserProfile:
 *       type: object
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
 *         description:
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
 *         description: Nice guy
 *         phone_no: 123456789
 *
 *
 *   requestBodies:
 *     changePassword:
 *       description: old and new password object
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - old_password
 *               - new_password
 *       properties:
 *         old_password:
 *           type: string
 *           description: old password of user
 *         new_password:
 *           type: string
 *           description: new password of user
 *       example:
 *         old_password: pkdjkcjskd
 *         new_password: eqdnwjnjkw
 *
 */

/**
 * @swagger
 * tags:
 *   name: User Profile
 *   description: User Profile api
 */

/**
 * @swagger
 * /api/user/profile/update:
 *   post:
 *     summary: Profile Update function
 *     tags: [User Profile]
 *     requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref:  '#/components/schemas/UserProfile'
 *
 *     responses:
 *       200:
 *         description: successfully updated profile response
 *
 * /api/user/password/change:
 *   post:
 *     summary: Change Password function
 *     tags: [User Profile]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *
 *     responses:
 *       200:
 *         description: successfully changed password response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               items:
 *                 $ref: '#/components/schemas/User'
 *
 * /api/user/profile/details:
 *   get:
 *     summary: Get user details
 *     tags: [User Profile]
 *
 *     responses:
 *       200:
 *         description: User profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               items:
 *                 $ref: '#/components/schemas/UserProfile'
 *
 */

router.post("/profile/update", httpUpdateProfile);
router.post("/password/change", httpChangePassword);
router.get("/profile/details", httpGetProfileDetails);

module.exports = router;
