const fs = require("fs");
const path = require("path");
const { randomBytes } = require("crypto");
const { ErrorHandler } = require("../../utils/error");
const catchAsync = require("../../utils/catchAsync");
const getSlug = require("speakingurl");

const MerchantContacts = require("./schema/contact.mongo");
const Certificates = require("./schema/certs.mongo");
const BusinessDetails = require("./schema/business.mongo");
const Listing = require("../merchant/schema/listing.mongo");
const ListingService = require("../merchant/schema/ListingServices.mongo");
const BusinessHours = require("./schema/hours.mongo");
const BusinessLocation = require("./schema/location.mongo");
const LogoDetails = require("./schema/logo.mongo");
const ServicesDetails = require("./schema/services.mongo");
const TypesenseClient = require("../../typesense/client");
const { uploads } = require("../../../cloudinaryConfig");
const { findOne, create } = require("./schema/business.mongo");
const axios = require("axios");
// const cloudinary = require("../../../cloudinaryConfig");

const postCreateBusiness = async (user_id) => {
  try {
    await BusinessDetails.updateOne(
      { merchant_id: user_id },
      {
        merchant_id: user_id,
      },
      {
        upsert: true,
      }
    );
    await Listing.updateOne(
      { merchant_id: user_id },
      {
        merchant_id: user_id,
        business_rating: Math.floor(Math.random() * 5),
        rating_count: Math.floor(Math.random() * 100),
      },
      { upsert: true }
    );
  } catch (err) {
    console.log(`Could not create merchant profile`);
  }
};

const postPrimaryContact = async (merchant) => {
  const { user_id, ...contact_primary } = merchant;

  MerchantContacts.findOneAndUpdate(
    {
      merchant_id: user_id,
    },
    {
      merchant_id: user_id,
      primary_contact: contact_primary,
    },
    {
      new: true,
      upsert: true,
    },
    async (err, doc) => {
      await BusinessDetails.updateOne(
        { merchant_id: user_id },
        { merchant_details: doc._id },
        { upsert: true }
      );
    }
  );
};

const postAlternateContact = async (merchant) => {
  const { user_id, ...contact_alternate } = merchant;

  MerchantContacts.findOneAndUpdate(
    {
      merchant_id: user_id,
    },
    {
      merchant_id: user_id,
      alternate_contact: contact_alternate,
    },
    {
      upsert: true,
      new: true,
    },
    async (err, doc) => {
      await BusinessDetails.updateOne(
        { merchant_id: user_id },
        { merchant_details: doc._id },
        { upsert: true }
      );
    }
  );
};

const postBusinessDetails = async (business_details) => {
  const { user_id, ...b_details } = business_details;

  BusinessDetails.findOneAndUpdate(
    {
      merchant_id: user_id,
    },
    {
      business_username: b_details.business_username,
      business_details: {
        business_name: b_details.business_name,
        website: b_details.website,
        contact: {
          toll_no: b_details.contact.toll_no,
          work_number: b_details.contact.work_no,
        },
        exp_years: b_details.exp_years,
        emp_strength: b_details.emp_strength,
        description: b_details.description,
      },
    },
    {
      upsert: true,
      new: true,
    },
    async (err, doc) => {
      await Listing.updateOne(
        { merchant_id: user_id },
        {
          business_name: doc.business_details.business_name,
          exp_years: doc.business_details.exp_years,
          emp_strength: doc.business_details.emp_strength,
        },
        {
          upsert: true,
        }
      );
      const slug = doc.merchant_slug;
      if (slug) {
        const [city, zip, username] = String(slug).split("/");
        const newSlug = `${city}/${zip}/${b_details.business_username}`;
        doc.merchant_slug = newSlug;

        await Listing.updateOne(
          { merchant_id: user_id },
          {
            merchant_slug: newSlug,
          },
          {
            upsert: true,
          }
        );

        await doc.save();
      }
    }
  );
};

const postCertsAccrdts = async (user_id, cert_file, cert_body) => {
  const newCertUpload = await uploads(cert_file.path);
  fs.unlinkSync(cert_file.path);

  Certificates.findOneAndUpdate(
    {
      merchant_id: user_id,
      cert_id: cert_body.cert_id,
    },
    {
      ...cert_body,
      cert_img: newCertUpload.url,
    },
    { new: true, upsert: true },
    async (err, doc) => {
      if (err) {
        console.log(err);
      }
      const business = await BusinessDetails.findOne({ merchant_id: user_id });
      business.addCertificate(doc._id);
    }
  );
};

const postShowCertsAccrdts = async (user_id, cert_show) => {
  const business = await BusinessDetails.findOne({ merchant_id: user_id });

  business.setShowCert(cert_show);

  // return await BusinessDetails.updateOne(
  //   { merchant_id: user_id },
  //   {
  //     $set: {
  //       certs_accrdts$cert_show: cert_show,
  //     },
  //   },
  //   {
  //     upsert: true,
  //   }
  // );
};

const postBusinessLocation = async (user_id, location_obj) => {
  const { zip_covered, coordinates, ...location_details } = location_obj;

  BusinessLocation.findOneAndUpdate(
    {
      merchant_id: user_id,
    },
    {
      ...location_details,
      coordinates: { lat: coordinates.lat, long: coordinates.long },
      zip_covered: zip_covered ? [...zip_covered] : "",
    },
    {
      new: true,
      upsert: true,
    },
    async (err, doc) => {
      const business = await BusinessDetails.findOne({ merchant_id: user_id });
      const citySlug = getSlug(doc.address.city, { separator: "-" });

      const newSlug = getSlug(
        `${citySlug} ${doc.address.zip_code} ${business.business_username}`,
        {
          separator: "/",
        }
      );

      business.business_location = doc._id;
      business.merchant_slug = newSlug;
      business.save();

      // business.createSlug(newSlug);

      await Listing.updateOne(
        { merchant_id: user_id },
        {
          business_location: [
            parseFloat(Number(coordinates.lat)),
            parseFloat(Number(coordinates.long)),
          ],
          merchant_slug: newSlug,
        },
        { upsert: true }
      );
    }
  );
};

const postBusinessOthers = async (others_obj) => {
  const { user_id, ...others_details } = others_obj;

  return await BusinessDetails.updateOne(
    {
      merchant_id: user_id,
    },
    {
      business_others: others_details,
    },
    {
      upsert: true,
    }
  );
};

const postBusinessHours = async (user_id, business_hours) => {
  // console.log(business_hours);

  // const { time_zone, is_service_247, weekly_hours } = business_hours;

  const businessDetails = await BusinessDetails.findOne({
    merchant_id: user_id,
  });

  businessDetails.business_hours = business_hours;
  await businessDetails.save();

  // BusinessDetails.findOneAndUpdate(
  //   { merchant_id: user_id },
  //   {
  //     business_hours: {
  //       time_zone: time_zone,
  //       is_service_247: is_service_247,
  //     },
  //   },
  //   { upsert: true, new: true }
  // );

  // weekly_hours.map((hour) => {
  //   BusinessHours.findOneAndUpdate(
  //     {
  //       merchant_id: user_id,
  //       hour_id: hour.hour_id,
  //     },
  //     {
  //       hour_id: hour.hour_id,
  //       days: hour.days,
  //       start_time: hour.start_time,
  //       end_time: hour.end_time,
  //     },
  //     {
  //       upsert: true,
  //       new: true,
  //     },
  //     async (err, doc) => {
  //       if (err) {
  //         throw new ErrorHandler(
  //           500,
  //           `Could not reference week hour ${doc._id}`
  //         );
  //       }
  //       const business = await BusinessDetails.findOne({
  //         merchant_id: user_id,
  //       });

  //       business.business_hours.time_zone = time_zone;
  //       business.business_hours.is_service_247 = is_service_247;

  //       business.pushWeeklyHour(doc._id);

  //       await Listing.updateMany(
  //         { merchant_id: user_id },
  //         {
  //           is_service_247: is_service_247,
  //         },
  //         { upsert: true }
  //       );
  //     }
  //   );
  // });
};

const postBusinessLogo = async (user_id, files) => {
  // if (!files.length) {
  //   throw new ErrorHandler(500, "logo should not be empty");
  // }

  const uploadData = [];
  await Promise.all(
    files.map(async (file) => {
      const newUpload = await uploads(file.path);
      uploadData.push(newUpload);
      fs.unlinkSync(file.path);
    })
  );

  const logoDetails = {};
  uploadData.map((img) => {
    img.size > 40000
      ? (logoDetails["secondary_logo"] = img.url)
      : (logoDetails["primary_logo"] = img.url);
  });

  await BusinessDetails.updateOne(
    {
      merchant_id: user_id,
    },
    {
      business_logo: {
        primary_logo: logoDetails.primary_logo ? logoDetails.primary_logo : "",
        secondary_logo: logoDetails.secondary_logo
          ? logoDetails.secondary_logo
          : "",
      },
    }
  );

  await Listing.updateOne(
    { merchant_id: user_id },
    {
      primary_logo: logoDetails.primary_logo ? logoDetails.primary_logo : "",
      secondary_logo: logoDetails.secondary_logo
        ? logoDetails.secondary_logo
        : "",
    },
    { upsert: true }
  );
};

const postBusinessServices = async (user_id, services_arr) => {
  const business_details = await BusinessDetails.findOne({
    merchant_id: user_id,
  });

  business_details.business_services = services_arr;
  await business_details.save();

  // services_arr.map(async (service) => {
  //   ListingService.findOneAndUpdate(
  //     { merchant_id: user_id, service_name: service.service_name },
  //     {
  //       ...service,
  //       listing_id: _doc._id,
  //       ...restDoc,
  //     },
  //     {
  //       upsert: true,
  //       new: true,
  //     },
  //     async (err, doc) => {
  //       doc.id = doc._id;
  //       await doc.save();
  //     }
  //   );
  // });
};

const postServiceToTypeSense = async (user_id, service_data) => {
  const listingMerchData = await Listing.findOne(
    { merchant_id: user_id },
    { __v: 0 }
  );

  const { _doc } = listingMerchData;
  const { _id, ...rest } = _doc;

  const servicesForTypesense = [];

  service_data.map((service) => {
    servicesForTypesense.push({ ...service, ...rest });
  });

  const createdDocs = await TypesenseClient.collections("listing")
    .documents()
    .import(servicesForTypesense, { action: "create", return_id: true });

  const typesense_docs = [];
  createdDocs.map((doc) => {
    typesense_docs.push(doc.id);
  });

  listingMerchData.typsense_docs = typesense_docs;
  await listingMerchData.save();
};

const getContacts = async (user_id) => {
  const contactResponse = await MerchantContacts.findOne({
    merchant_id: user_id,
  });
  return contactResponse;
};

const getBusinessDetails = async (user_id) => {
  const BusinessDetailsResponse = await BusinessDetails.findOne({
    merchant_id: user_id,
  })
    .populate("business_location business_logo")
    .populate({
      path: "business_hours",
      populate: {
        path: "weekly_hours",
        model: "Hour",
      },
    })
    .populate({
      path: "certs_accrdts",
      populate: {
        path: "cert_list",
        model: "Certificates",
      },
    });

  return BusinessDetailsResponse;
};

const getBusinessServices = async (user_id) => {
  const business_details = await BusinessDetails.findOne({
    merchant_id: user_id,
  });
  return business_details.business_services;
};

const deleteCertificate = async (user_id, cert_title) => {
  const cert = await Certificates.findOne({
    merchant_id: user_id,
    cert_title: cert_title,
  });

  if (!cert) {
    throw new ErrorHandler(404, `${cert_title} Certficate not found`);
  }
  const business = await BusinessDetails.findOne({ merchant_id: user_id });
  business.deleteCertificate(cert._id);
  const cert_img = cert.cert_img;

  cert.deleteOne();
  fs.unlink(cert_img, (err) => {
    if (err) {
      throw new ErrorHandler(500, err.message);
    }
    console.log(
      cert_img,
      `Delete ${cert_title} certificate File successfully.`
    );
  });
};

const deleteWeeklyHour = async (user_id, hourObjectId, hourData) => {
  console.log("Object id", hourObjectId);
  console.log("hour data", hourData);

  await BusinessHours.deleteOne({ _id: hourObjectId });

  const business = await BusinessDetails.findOne({ merchant_id: user_id });
  business.deleteWeeklyHour(hourObjectId);
};

module.exports = {
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
};
