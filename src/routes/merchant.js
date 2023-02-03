const router = require("express").Router();
const checkAuth = require("../middleware/check-auth");
const passport = require("passport");
const catchAsync = require("../utils/catchAsync");
const { fileUpload } = require("../middleware/file-upload");
const {
  validateUser,
  validateSignin,
  validateContact,
  validateBusinessDetails,
  validateLocation,
  validateHours,
  validateOthers,
  validateServices,
  validateAlternateContact,
  // validateBusinessLogo,
} = require("../middleware/check-validation");

const {
  httpPostAlternateContact,
  httpPostPrimaryContact,
  httpPostBusinessDetails,
  httpPostCertsAccrdts,
  httpPostCertsAccrdtsCertShow,
  httpPostBusinessLocation,
  httpPostBusinessOthers,
  httpPostMerchantSignup,
  httpPostMerchantSignin,
  httpPostBusinessDetailsHours,
  httpPostBusinessLogo,
  httpGetLogo,
  httpPostBusinessServices,
  // httpCreateBusiness,
  httpPostTypesense,
  httpGetContacts,
  httpGetBusinessDetails,
  httpGetBusinessServices,
  httpDeleteCertificate,
  httpDeleteWeeklyHours,
} = require("../controllers/merchant.controller");

router.post("/signup", validateUser, catchAsync(httpPostMerchantSignup));

router.post(
  "/signin",
  validateSignin,
  (req, res, next) => {
    req.userData = { role: "merchant" };
    next();
  },
  passport.authenticate("merchant-local", {
    failureFlash: true,
  }),
  catchAsync(httpPostMerchantSignin)
);

router.use(checkAuth);

// router.post("/register/create-business",httpCreateBusiness);
router.post(
  "/register/primary-contact",
  validateContact,
  catchAsync(httpPostPrimaryContact)
);
router.post(
  "/register/alternate-contact",
  validateAlternateContact,
  catchAsync(httpPostAlternateContact)
);
router.post(
  "/register/business-details",
  validateBusinessDetails,
  catchAsync(httpPostBusinessDetails)
);
router.post(
  "/register/business-logo",
  fileUpload.array("image", 2),
  catchAsync(httpPostBusinessLogo)
);

router.post(
  "/register/certs-accrdts",
  fileUpload.single("cert_img"),
  catchAsync(httpPostCertsAccrdts)
);

router.post(
  "/register/certs-accrdts/show",
  catchAsync(httpPostCertsAccrdtsCertShow)
);

router.post(
  "/register/business-location",
  validateLocation,
  catchAsync(httpPostBusinessLocation)
);
router.post(
  "/register/business-others",
  validateOthers,
  catchAsync(httpPostBusinessOthers)
);
router.post(
  "/register/business-hours",
  validateHours,
  catchAsync(httpPostBusinessDetailsHours)
);
router.post(
  "/register/business-services",
  validateServices,
  catchAsync(httpPostBusinessServices)
);
router.post("/register/business/typesense", catchAsync(httpPostTypesense));

router.get("/fetch/contacts", catchAsync(httpGetContacts));
router.get("/fetch/business-details", catchAsync(httpGetBusinessDetails));
router.get("/fetch/business-services", catchAsync(httpGetBusinessServices));

router.delete("/delete/certs/:cert_title", catchAsync(httpDeleteCertificate));
router.delete("/delete/weekly-hours", catchAsync(httpDeleteWeeklyHours));

module.exports = router;
