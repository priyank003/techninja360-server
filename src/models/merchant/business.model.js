const MerchantContacts = require("./schema/contact.mongo");
const BusinessDetails = require("./schema/business.mongo");
const LogoDetails = require("./schema/logo.mongo");
const ServicesDetails = require("./schema/services.mongo");
const TypesenseClient = require("../../typesense/client");
const BusinessLocation = require("../merchant/schema/location.mongo");
const { ErrorHandler } = require("../../utils/error");

const getBusinessProfile = async (city, zip_code, merchant_name) => {
  const business_profile = await BusinessDetails.findOne(
    {
      business_username: merchant_name,
    },
    {
      business_hours: 1,
      business_location: 1,
      business_details: 1,
      merchant_id: 1,
    }
  )
    .populate("business_logo")
    .populate("business_location")
    .populate({
      path: "business_hours",
      populate: {
        path: "weekly_hours",
        model: "Hour",
      },
    });

  const profile_response = {
    merchant_id: business_profile.merchant_id,
    business_logo: business_profile.business_logo
      ? business_profile.business_logo
      : "",
    business_details: {
      business_name: business_profile.business_details.business_name,
      website: business_profile.business_details.web_address,
      contact: business_profile.business_details.contact,
      description: business_profile.business_details.description,
    },
    business_address: business_profile.business_location.address,
    business_hours: business_profile.business_hours,
  };

  return profile_response;
};

const getBusinessAbout = async (merchant_id) => {
  const business_about = await BusinessDetails.findOne(
    {
      merchant_id: merchant_id,
    },
    {
      business_details: { exp_years: 1, emp_strength: 1 },
      business_hours: 1,
      business_others: 1,
    }
  ).populate({
    path: "business_hours",
    populate: {
      path: "weekly_hours",
      model: "Hour",
    },
  });

  return business_about;
};

const getBusinessServices = async (merchant_id) => {
  const business_details = await BusinessDetails.findOne({
    merchant_id: merchant_id,
  });

  return business_details.business_services;
};

const getBusinessLocation = async (merchant_id) => {
  const business_location = await BusinessLocation.findOne({
    merchant_id: merchant_id,
  });

  return business_location;
};

const getBusinessCerts = async (business_id) => {
  const business_certs = await BusinessDetails.findOne(
    {
      business_id: business_id,
    },
    {
      certs_accreds: 1,
    }
  );

  return business_certs;
};

const getBusinessListing = async (query) => {
  const page = parseInt(query.page) - 1 || 0;
  const limit = parseInt(query.limit) || 10;
  let sort = query.sort || "business_rating";

  const business = await BusinessDetails.find(
    {},
    {
      business_id: 1,
      business_logo: 1,
      business_details: 1,
      certs_accreds: 1,
    }
  );

  return business;
};

const getSearchBusinessListing = async (query) => {
  const { q, ...rest } = query;

  // let filterString = Object.keys(filters)
  //   .map(function (k) {
  //     return `${k}:${filters[k]}`;
  //   })
  //   .join("&&");

  let searchParameters = {
    q: q,
    query_by:
      "service_name,business_name,service_desc,service_category,service_type",
    // filter_by: filter_by,
    // sort_by: sort_by,
    ...rest,
  };

  return await TypesenseClient.collections("listing")
    .documents()
    .search(searchParameters)
    .then(
      function (searchResults) {
        return searchResults;
      },
      (err) => {
        console.log(err);
      }
    );

  // console.log(results.hits);
  // const resultResponse = [];
  // results.hits.map((res) => {
  //   res.document.id[0] == "s" && resultResponse.push(res.document);
  // });

  // return {
  //   found: resultResponse.length,
  //   hits: resultResponse,
  // };
};

module.exports = {
  getBusinessProfile,
  getBusinessAbout,
  getBusinessServices,
  getBusinessLocation,
  getBusinessCerts,
  getBusinessListing,
  getSearchBusinessListing,
};
