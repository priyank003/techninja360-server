const { check, validationResult } = require("express-validator");

exports.validateUser = [
  check("first_name")
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage("first name can not be empty!")
    .bail(),
  check("last_name")
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage("last name can not be empty!")
    .bail(),
  check("email")
    .trim()
    .not()
    .isEmpty()
    .withMessage("email cannot be empty!")
    .isEmail()
    .withMessage("Invalid email address")
    .normalizeEmail()
    .withMessage("Invalid email address!")
    .bail(),
  check("phone_no")
    .trim()
    .optional({ checkFalsy: true })
    .not()
    .isEmpty()
    .isMobilePhone(["en-US", "en-IN"])
    .withMessage("Invalid phone number, phone must from US or In")
    .bail(),
  check("password")
    .isString()
    .isLength({ min: 8 })
    .withMessage("password cannot be less than 8 characters")
    .bail()
    .not()
    .isLowercase()
    .withMessage("atleast 1 uppercase character must be present")
    .not()
    .isUppercase()
    .withMessage("atleast 1 lowercase character must be present")
    .not()
    .isNumeric()
    .withMessage("atleast 1 alphabet character must be present")
    .not()
    .isAlpha()
    .withMessage("atleast 1 number must be present ")
    .bail(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });
    next();
  },
];

exports.validateSignin = [
  check("email")
    .trim()
    .not()
    .isEmpty()
    .withMessage("email cannot be empty!")
    .isEmail()
    .withMessage("Invalid email address")
    .normalizeEmail()
    .withMessage("Invalid email address!")
    .bail(),
  check("password")
    .isString()
    .isLength({ min: 5 })
    .withMessage("password cannot be less than 8 characters"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });
    next();
  },
];

exports.validateContact = [
  check("title")
    .trim()
    .not()
    .isEmpty()
    .withMessage("title cannot be empty")
    .bail(),
  check("name.first_name")
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage("first name can not be empty!")
    .bail()
    .isLength({ min: 3 })
    .withMessage("Minimum 3 characters required!")
    .bail(),
  check("name.middle_name")
    .trim()
    .optional({ checkFalsy: true })
    .not()
    .isEmpty()
    .escape()
    .bail(),
  check("name.last_name")
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage("last name can not be empty!")
    .bail(),
  check("primary_email")
    .trim()
    .not()
    .isEmpty()
    .withMessage("email cannot be empty!")
    .bail()
    .isEmail()
    .withMessage("Invalid email address")
    .bail()
    .normalizeEmail()
    .withMessage("Invalid email address!")
    .bail(),
  check("phone_no.primary_ph")
    .trim()
    .not()
    .isEmpty()
    .withMessage("primary phone no cannot be empty")
    .bail()
    .isMobilePhone(["en-US", "en-IN"])
    .withMessage("Invalid phone number")
    .bail(),
  check("phone_no.alternate_ph")
    .trim()
    .optional({ checkFalsy: true })
    .not()
    .isEmpty()
    .withMessage("alternate phone no cannot be empty")
    .bail()
    .isMobilePhone(["en-US", "en-IN"])
    .withMessage("Invalid phone number")
    .bail(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });
    next();
  },
];

exports.validateAlternateContact = [
  check("title")
    .trim()
    .optional()
    .not()
    .isEmpty()
    .withMessage("title cannot be empty")
    .bail(),
  check("name.first_name")
    .trim()
    .optional({ checkFalsy: true })
    .escape()
    .not()
    .isEmpty()
    .withMessage("first name can not be empty!")
    .bail()
    .isLength({ min: 3 })
    .withMessage("Minimum 3 characters required!")
    .bail(),
  check("name.middle_name")
    .trim()
    .optional({ checkFalsy: true })
    .not()
    .isEmpty()
    .escape()
    .isLength({ min: 3 })
    .withMessage("Minimum 3 characters required!")
    .bail(),
  check("name.last_name")
    .trim()
    .optional({ checkFalsy: true })
    .escape()
    .not()
    .isEmpty()
    .withMessage("last name can not be empty!")
    .bail()
    .isLength({ min: 3 })
    .withMessage("Minimum 3 characters required!")
    .bail(),
  check("primary_email")
    .trim()
    .optional({ checkFalsy: true })
    .not()
    .isEmpty()
    .withMessage("email cannot be empty!")
    .bail()
    .isEmail()
    .withMessage("Invalid email address")
    .bail()
    .normalizeEmail()
    .withMessage("Invalid email address!")
    .bail(),
  check("phone_no.primary_ph")
    .trim()
    .optional({ checkFalsy: true })
    .not()
    .isEmpty()
    .withMessage("primary phone no cannot be empty")
    .bail()
    .isMobilePhone(["en-US", "en-IN"])
    .withMessage("Invalid phone number")
    .bail(),
  check("phone_no.alternate_ph")
    .trim()
    .optional({ checkFalsy: true })
    .not()
    .isEmpty()
    .withMessage("alternate phone no cannot be empty")
    .bail()
    .isMobilePhone(["en-US", "en-IN"])
    .withMessage("Invalid phone number")
    .bail(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });
    next();
  },
];

// exports.validateBusinessLogo = [
//   "image".notEmpty().withMessage("image field is required"),
//   (req, res, next) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty())
//       return res.status(422).json({ errors: errors.array() });
//     next();
//   },
// ];

exports.validateBusinessDetails = [
  check("business_name")
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage("business name cannot be empty!")
    .bail()
    .isLength({ min: 3 })
    .withMessage("Minimum 3 characters required!")
    .bail(),
  check("website")
    .trim()
    .optional()
    .isURL()
    .withMessage("invalid website url!"),
  check("contact.toll_no").trim().optional(),
  check("contact.work_no")
    .trim()
    .optional()
    .not()
    .isEmpty()
    .withMessage("work phone no cannot be empty")
    .bail()
    .isMobilePhone(["en-US", "en-IN"])
    .withMessage("Invalid work number")
    .bail(),
  check("exp_years")
    .trim()
    .optional()
    .isNumeric()
    .withMessage("experience years must be number"),
  check("emp_strength").trim().optional(),
  check("description")
    .trim()
    .not()
    .isEmpty()
    .withMessage("description must not be empty !")
    .bail()
    .isLength({ min: 5 })
    .withMessage("Minimum 5 characters of description required!"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });
    next();
  },
];

exports.validateLocation = [
  check("address_type")
    .trim()
    .not()
    .isEmpty()
    .withMessage("address type must not be empty !")
    .bail(),
  check("address.street")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Minimum 3 characters required!"),
  check("address.city")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Minimum 3 characters required!")
    .isAlpha("en-US", { ignore: " " })
    .withMessage("City must be only alphabets"),
  check("address.state")
    .trim()
    .not()
    .isEmpty()
    .isAlpha("en-US", { ignore: " " })
    .withMessage("State must be only alphabets"),
  check("address.country")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Minimum 3 characters required!")
    .isAlpha("en-US", { ignore: " " })
    .withMessage("country must be only alphabets"),
  // check("address.zip_code")
  //   .trim()
  //   .isPostalCode("US")
  //   .withMessage("zip code must be from US"),
  check("coordinates")
    .not()
    .isEmpty()
    // .isLatLong()
    .withMessage("in valid coordinates"),
  // check("service_radius.start")
  //   .trim()
  //   .not()
  //   .isEmpty()
  //   .withMessage("value should be empty")
  //   .bail()
  //   .isNumeric()
  //   .withMessage("value should be number"),
  // check("service_radius.end")
  //   .trim()
  //   .not()
  //   .isEmpty()
  //   .withMessage("value should be empty")
  //   .bail()
  //   .isNumeric()
  //   .withMessage("value should be number"),
  // check("zip_covered")
  //   .trim()
  //   .not()
  //   .isEmpty()

  //   .withMessage("value should be empty"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });
    next();
  },
];

exports.validateHours = [
  // check("time_zone")
  //   .trim()
  //   .not()
  //   .isEmpty()
  //   .withMessage("timezone must not be empty")
  //   .bail(),
  // check("is_service_247")
  //   .trim()
  //   .isBoolean()
  //   .withMessage("value should be boolean"),
  // check("weekly_hours").trim().isBoolean().withMessage("value should be empty"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });
    next();
  },
];

exports.validateOthers = [
  check([
    "services.remote_support",
    "services.inStore_service",
    "services.house_call",
    "services.pick_drop",
    "services.resident_service",
    "services.business_service",
    "payment_method.credit_debit",
    "payment_method.paypal",
    "payment_method.applePay",
    "payment_method.googlePay",
    "payment_method.cash",
    "payment_method.crypto",
    "plan_type.one_time",
    "plan_type.monthly",
    "plan_type.yearly",
  ])
    .trim()
    .not()
    .isEmpty()
    .withMessage("values must not be empty")
    .bail()
    .isBoolean()
    .withMessage("values must be boolean"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });
    next();
  },
];

exports.validateServices = [
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });
    next();
  },
];

exports.validateServices = [
  check("services").not().isEmpty().withMessage("services cannot be empty"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });
    next();
  },
];


