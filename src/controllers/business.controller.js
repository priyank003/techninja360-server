const {
  getBusinessProfile,
  getBusinessAbout,
  getBusinessServices,
  getBusinessLocation,
  getBusinessCerts,
  getBusinessListing,
  getSearchBusinessListing,
} = require("../models/merchant/business.model");
const { ErrorHandler } = require("../utils/error");

const httpGetBusinessProfile = async (req, res) => {
  const { city, zip_code, merchant_name } = req.params;
  console.log(merchant_name);

  if (
    city === undefined ||
    zip_code === undefined ||
    merchant_name === undefined
  ) {
    throw new ErrorHandler(404, "Inavlid merchant profile url");
  }

  // console.log(city, zip_code, merchant_name)
  // console.log(slug);
  // const merchant_id = req.params.merchant_id;
  // if (!merchant_id) {
  //   throw new ErrorHandler(403, "invalid business id param");
  // }
  // console.log(slug)
  const result = await getBusinessProfile(city, zip_code, merchant_name);

  res.status(200).json({
    status: "ok",
    results: result,
  });
};

const httpGetBusinessAbout = async (req, res) => {
  const merchant_id = req.params.merchant_id;

  const result = await getBusinessAbout(merchant_id);

  res.status(200).json({
    status: "ok",
    result,
  });
};

const httpGetBusinessServices = async (req, res) => {
  const merchant_id = req.params.merchant_id;

  const result = await getBusinessServices(merchant_id);

  res.status(200).json({
    status: "ok",
    result,
  });
};

const httpGetBusinessLocation = async (req, res) => {
  const merchant_id = req.params.merchant_id;

  const result = await getBusinessLocation(merchant_id);

  res.status(200).json({
    status: "ok",
    result,
  });
};

const httpGetBusinessCerts = async (req, res) => {
  const merchant_id = req.params.merchant_id;

  const result = await getBusinessCerts(merchant_id);

  res.status(200).json({
    status: "ok",
    result,
  });
};

const httpGetBusinessListing = async (req, res) => {
  const query = req.query;
  const results = await getBusinessListing(query);

  res.status(200).json({
    status: "ok",
    results,
  });
};

const httpSearchBusinessListing = async (req, res) => {
  const queries = req.query;
  const results = await getSearchBusinessListing(queries);

  res.status(200).json({
    status: "ok",
    results,
  });
};

module.exports = {
  httpGetBusinessProfile,
  httpGetBusinessAbout,
  httpGetBusinessServices,
  httpGetBusinessLocation,
  httpGetBusinessCerts,
  httpGetBusinessListing,
  httpSearchBusinessListing,
};
