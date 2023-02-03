const router = require("express").Router();
const checkAuth = require("../middleware/check-auth");
const catchAsync = require("../utils/catchAsync");

// const {
//   httpGetBusinessListing,
// } = require("../controllers/business.controller");
const {
  httpGetBusinessProfile,
  httpGetBusinessAbout,
  httpGetBusinessServices,
  httpGetBusinessLocation,
  httpGetBusinessCerts,
  httpGetBusinessListing,
  httpSearchBusinessListing,
} = require("../controllers/business.controller");

// router.use(checkAuth);

router.get("/profile/:city/:zip_code/:merchant_name", catchAsync(httpGetBusinessProfile));

router.get("/profile/about/:merchant_id", catchAsync(httpGetBusinessAbout));

router.get(
  "/profile/services/:merchant_id",
  catchAsync(httpGetBusinessServices)
);

router.get(
  "/profile/location/:merchant_id",
  catchAsync(httpGetBusinessLocation)
);

router.get("/profile/certs/:merchant_id", catchAsync(httpGetBusinessCerts));

router.get("/listings", catchAsync(httpGetBusinessListing));

router.get("/search/listings", catchAsync(httpSearchBusinessListing));

module.exports = router;
