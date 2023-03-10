const { ErrorHandler } = require("../utils/error");
const { randomBytes } = require("crypto");
const {
  postPrimaryContact,
  postAlternateContact,
  postBusinessDetails,
  postCertsAccrdts,
  postBusinessLocation,
  postBusinessOthers,
  postBusinessHours,
  postBusinessLogo,
  postBusinessServices,
  postCreateBusiness,
  postShowCertsAccrdts,
  postServiceToTypeSense,
  getContacts,
  getBusinessDetails,
  getBusinessServices,
  deleteCertificate,
  deleteWeeklyHour,
} = require("../models/merchant/merchant.model");
const jwt = require("jsonwebtoken");
const fs = require("fs");

const Merchant = require("../models/merchant/schema/merchant.mongo");
const BusinessDetails = require("../models/merchant/schema/business.mongo");
const Listing = require("../models/merchant/schema/listing.mongo");
const ListingService = require("../models/merchant/schema/ListingServices.mongo");
const BusinessHours = require("../models/merchant/schema/hours.mongo");

const Certificates = require("../models/merchant/schema/certs.mongo");
const Services = require("../models/merchant/schema/services.mongo");
const TypesenseClient = require("../typesense/client");
const { Pricing } = require("aws-sdk");

const httpPostMerchantSignup = async (req, res, next) => {
  const { first_name, last_name, phone_no, email, password } = req.body;

  const merchantUser = new Merchant({
    first_name,
    last_name,
    email,
    phone_no,
    user_id: `m-${randomBytes(8).toString("hex")}`,
  });

  const registerdMerchant = await Merchant.register(merchantUser, password);

  if (!registerdMerchant) {
    throw new ErrorHandler(500, "merchant cannot be registred");
  }

  req.login(registerdMerchant, (next, err) => {
    if (err) {
      const Error = new ErrorHandler(500, err.message);
      return next(Error);
    }
    console.log("welcome to techninja merchant");
  });

  const user_id = registerdMerchant.user_id;

  await postCreateBusiness(user_id);

  const token = jwt.sign(
    {
      user_id,
      email,
    },
    process.env.JWTSecretKey,
    {
      expiresIn: "1h",
    }
  );

  res.status(200).json({
    status: "ok",
    message: "successfully registerd merchant",
    merchant_data: {
      user_id,
      email,
      token,
      first_name,
      last_name,
      phone_no,
    },
  });
};

const httpPostMerchantSignin = async (req, res) => {
  // if (err) {
  //   console.log(err);
  //   return next(err);
  // }
  req.flash("success", "welcome back");
  const redirectUrl = req.session.returnTo || "/login";

  delete req.session.returnTo;

  const { user_id, email } = req.user;

  // req.flash("welcome to placement cell");

  const token = jwt.sign(
    {
      user_id,
      email,
    },
    process.env.JWTSecretKey,
    { expiresIn: "1h" }
  );

  if (!token) {
    throw new ErrorHandler(500, "merchant signin token cannot be generated");
  }

  res.status(200).json({
    status: "ok",
    msg: "welcome merchant",
    user_details: {
      user_id,
      email,
      token,
    },
  });
};
const httpPostPrimaryContact = async (req, res) => {
  const user_id = req.userData.user_id;

  const merchant_obj = {
    ...req.body,
    user_id: user_id,
  };

  await postPrimaryContact(merchant_obj);

  res.status(200).json({
    status: "ok",
    merchant_id: merchant_obj.user_id,
    msg: "registred primary contact",
  });
};

const httpPostAlternateContact = async (req, res) => {
  const user_id = req.userData.user_id;
  const merchant_obj = {
    user_id,
    ...req.body,
  };

  await postAlternateContact(merchant_obj);

  res.status(200).json({
    status: "ok",
    merchant_id: user_id,
    msg: "registred alternate contact",
  });
};
const httpPostBusinessDetails = async (req, res) => {
  const user_id = req.userData.user_id;
  const business_details = {
    user_id,
    ...req.body,
  };

  const usernameExists = await BusinessDetails.exists({
    merchant_id: {
      $ne: user_id,
    },
    business_username: business_details.business_username,
  });

  if (usernameExists) {
    throw new ErrorHandler(
      409,
      `${business_details.business_username} username already taken`
    );
  }

  await postBusinessDetails(business_details);

  res.status(200).json({
    status: "ok",
    msg: "registred business details",
  });
};

const httpPostCertsAccrdts = async (req, res) => {
  const user_id = req.userData.user_id;

  const cert_body = req.body;

  const pastCertificate = await Certificates.exists({
    merchant_id: user_id,
    cert_title: cert_body.cert_title,
  });

  if (pastCertificate) {
    return res.status(403).json({
      msg: `${cert_body.cert_title} already exists`,
    });
  }
  if (!cert_body.cert_id) {
    cert_body["cert_id"] = `c-${randomBytes(8).toString("hex")}`;
  }

  await postCertsAccrdts(user_id, req.file, req.body);

  return res.status(200).json({
    status: "ok",
    cert_id: cert_body.cert_id,
    msg: "registred certificates and accredations",
  });
};

const httpPostCertsAccrdtsCertShow = async (req, res) => {
  const user_id = req.userData.user_id;

  const cert_show = req.body.show_cert;

  // const pastCertificate = await Certificates.findOne({
  //   merchant_id: user_id,
  //   cert_title: cert_show,
  // });

  // if (!pastCertificate) {
  //   return res.status(403).json({
  //     msg: `${cert_show} doesn't exist`,
  //   });
  // }

  // if (!pastCertificate.cert_id) {
  //   pastCertificate["cert_id"] = `c-${randomBytes(8).toString("hex")}`;
  //   pastCertificate.save();
  // }

  await postShowCertsAccrdts(user_id, cert_show);

  return res.status(200).json({
    status: "ok",
    // cert_id: pastCertificate.cert_id,
    msg: ` ${cert_show} will be shown in service listings`,
  });
};

const httpPostBusinessLocation = async (req, res) => {
  const location_obj = req.body;
  const user_id = req.userData.user_id;

  console.log(req.body);

  await postBusinessLocation(user_id, location_obj);

  res.status(200).json({
    status: "ok",
    msg: "registred business location",
  });
};

const httpPostBusinessOthers = async (req, res) => {
  const user_id = req.userData.user_id;

  const others_obj = { user_id, ...req.body };

  await postBusinessOthers(others_obj);

  res.status(200).json({
    status: "ok",
    msg: "registred business location",
  });
};

const httpPostBusinessDetailsHours = async (req, res) => {
  const user_id = req.userData.user_id;

  const { time_zone, is_service_247, weekly_hours } = req.body;

  const hoursWidId = await generateWeeklyHoursId(weekly_hours);
  // await BusinessHours.deleteMany({ merchant_id: user_id });

  const hoursData = { time_zone, is_service_247, weekly_hours: hoursWidId };

  console.log("id", hoursWidId);

  await postBusinessHours(user_id, hoursData);

  res.status(200).json({
    status: "ok",
    merchant_id: user_id,
    msg: "registred business hours",
  });
};

const httpPostBusinessLogo = async (req, res) => {
  if (req.files.length) {
    const user_id = req.userData.user_id;

    await postBusinessLogo(user_id, req.files);

    res.status(200).json({
      status: "ok",
      msg: "registred business logos",
    });
  }
};

const httpPostBusinessServices = async (req, res) => {
  const user_id = req.userData.user_id;

  const services = req.body;

  await TypesenseClient.collections("listing")
    .documents()
    .delete({ filter_by: `merchant_id:${user_id}` });

  await BusinessDetails.updateOne(
    { merchant_id: user_id },
    { business_services: [] },
    { upsert: true }
  );

  const services_modified = getServices(services);

  await postBusinessServices(user_id, services_modified.services);

  await postServiceToTypeSense(user_id, services_modified.services);

  return res.status(200).json({
    status: "ok",
    merchant_id: user_id,
    services: services_modified,
    msg: "registred business services",
  });
};

const httpPostTypesense = async (req, res) => {
  const user_id = req.userData.user_id;

  await postToTypesense(user_id);

  res.status(200).json({
    status: "ok",
    msg: "registered to typesense",
  });
};

const httpGetContacts = async (req, res) => {
  const user_id = req.userData.user_id;

  const results = await getContacts(user_id);

  res.status(200).json({
    status: "ok",
    results,
  });
};

const httpGetBusinessDetails = async (req, res) => {
  const user_id = req.userData.user_id;

  const results = await getBusinessDetails(user_id);

  res.status(200).json({
    status: "ok",
    results,
  });
};

const httpGetBusinessServices = async (req, res) => {
  const user_id = req.userData.user_id;

  const results = await getBusinessServices(user_id);

  res.status(200).json({
    status: "ok",
    results,
  });
};

const httpDeleteCertificate = async (req, res) => {
  const user_id = req.userData.user_id;
  const cert_title = req.params.cert_title;

  await deleteCertificate(user_id, cert_title);

  res.status(200).json({
    status: "ok",
    cert_title,
    msg: "certificate succesfully deleted",
  });
};

const httpDeleteWeeklyHours = async (req, res) => {
  const user_id = req.userData.user_id;
  const hourData = req.body;
  if (!hourData.hour_id) {
    hourData["hour_id"] = `${String(hourData.days).trim()}${String(
      hourData.start_time
    ).trim()}${String(hourData.end_time).trim()}`;
  }

  const hourExists = await BusinessHours.findOne({
    merchant_id: user_id,
    hour_id: hourData.hour_id,
  });

  if (!hourExists) {
    console.log(`${hourData.hour_id} weekly hour doesn't exists in database`);
    return res.status(404).json({
      status: "ok",
      hour_id: hourData.hour_id,
      msg: `${hourData.hour_id} weekly hour doesn't exists in database`,
    });

    // throw new ErrorHandler(
    //   201,
    //   `${hourData.hour_id} weekly hour doesn't exists in database`
    // );
  }

  await deleteWeeklyHour(user_id, hourExists._id, hourData);

  return res.status(200).json({
    status: "ok",
    hour_id: hourData.hour_id,
    msg: "weekly hour succesfully deleted",
  });
};
const getServices = (services_data) => {
  services_data.services.map((service) => {
    if (service.service_price === -1) {
      delete service.service_price;
      service.pricing_type = "call";
    } else {
      service.service_price = Number(service.service_price);
    }
  });

  return services_data;
};

const generateWeeklyHoursId = async (weeklyHours) => {
  weeklyHours.map((timing) => {
    const timing_id = `${String(timing.days).trim()}${String(
      timing.start_time
    ).trim()}${String(timing.end_time).trim()}`;
    timing["hour_id"] = String(timing_id).trim();
  });

  return weeklyHours;
};

module.exports = {
  httpPostPrimaryContact,
  httpPostAlternateContact,
  httpPostBusinessDetails,
  httpPostCertsAccrdts,
  httpPostCertsAccrdtsCertShow,
  httpPostBusinessLocation,
  httpPostBusinessOthers,
  httpPostMerchantSignup,
  httpPostMerchantSignin,
  httpPostBusinessDetailsHours,
  httpPostBusinessLogo,
  httpPostBusinessServices,
  // httpCreateBusiness,
  httpPostTypesense,
  httpGetContacts,
  httpGetBusinessDetails,
  httpGetBusinessServices,
  httpDeleteCertificate,
  httpDeleteWeeklyHours,
};
