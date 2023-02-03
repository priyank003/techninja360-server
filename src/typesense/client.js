const Typesense = require("typesense");
const BusinessDetails = require("../models/merchant/schema/business.mongo");
const Listing = require("../models/merchant/schema/listing.mongo");
const ListingService = require("../models/merchant/schema/ListingServices.mongo");
const catchAsync = require("../utils/catchAsync");

const {
  TYPESENSE_IP,
  TYPESENSE_PORT,
  TYPESENSE_KEY,
} = require("../../config/config");

// const client = new Typesense.Client({
//   nodes: [
//     {
//       host: "j5mfiklp0qsrn3o2p-1.a1.typesense.net",
//       port: "443",
//       protocol: "https",
//     },
//   ],
//   apiKey: "Vm44no2pJCNGVYPZTrRSB9nxJHoPp0wx",
//   connectionTimeoutSeconds: 5,
// });

const client = new Typesense.Client({
  nodes: [
    {
      host: TYPESENSE_IP, // For Typesense Cloud use xxx.a1.typesense.net
      port: TYPESENSE_PORT, // For Typesense Cloud use 443
      protocol: "http", // For Typesense Cloud use https
    },
  ],
  apiKey: TYPESENSE_KEY,
  connectionTimeoutSeconds: 1000,
});

// BusinessDetails.watch().on("change", async (next) => {
//   console.log(next);
//   // if (next.operationType == "delete") {
//   //   await typesense
//   //     .collections("listing")
//   //     .documents(next.documentKey._id)
//   //     .delete();
//   //   console.log(next.documentKey._id);
//   // } else if (next.operationType == "update") {
//   //   let data = JSON.stringify(next.updateDescription.updatedFields);
//   //   await typesense
//   //     .collections("books")
//   //     .documents(next.documentKey._id)
//   //     .update(data);
//   //   console.log(data);
//   // } else {
//   //   next.fullDocument.id = next.fullDocument["_id"];
//   //   delete next.fullDocument._id;
//   //   let data = JSON.stringify(next.fullDocument);
//   //   await typesense.collections("books").documents().upsert(data);
//   //   console.log(data);
//   // }
// });

Listing.watch().on("change", async (next) => {
  console.log(next);
  // client.collections('listing').documents().import(documents, {action: 'create'})
  await ListingService.updateMany(
    { listing_id: next.documentKey._id },
    {
      ...next.updateDescription.updatedFields,
    },
    {
      upsert: true,
    }
  );
});

ListingService.watch().on("change", async (next) => {
  try {
    if (next.operationType == "delete") {
      console.log(next);
      await client
        .collections("listing")
        .documents(next.documentKey._id)
        .delete();
    } else if (next.operationType == "update") {
      let data = JSON.stringify(next.updateDescription.updatedFields);
      if (data.id) {
        await client
          .collections("listing")
          .documents(next.documentKey._id)
          .update(data);
      }
    } else if (next.operationType == "insert") {
      console.log("creating new listing document insert", next);
      next.fullDocument.id = next.fullDocument["_id"];

      let data = JSON.stringify(next.fullDocument);
      if (data.id) {
        await client.collections("listing").documents().create(data);
      }
    }
  } catch (err) {
    console.log(err.message);
  }
});

module.exports = client;
