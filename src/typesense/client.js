const Typesense = require("typesense");
const Listing = require("../models/merchant/schema/listing.mongo");

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
      host: process.env.NODE_ENV === "development" ? "localhost" : TYPESENSE_IP, // For Typesense Cloud use xxx.a1.typesense.net
      port: process.env.NODE_ENV === "development" ? 8108 : TYPESENSE_PORT, // For Typesense Cloud use 443
      protocol: "http", // For Typesense Cloud use https
    },
  ],
  apiKey: TYPESENSE_KEY,
  connectionTimeoutSeconds: 1000,
});

// const filter = [
//   { $match: { operationType: "update" } },
//   {
//     $project: {
//       "fullDocument.merchant_id": 1,
//     },
//   },
// ];

Listing.watch([], { fullDocument: "updateLookup" }).on(
  "change",
  async (next) => {
    if (next.operationType == "update") {
      const typesense_docs = next.fullDocument.typesense_docs;

      const updatedData = JSON.stringify(next.updateDescription.updatedFields);

      typesense_docs.map(async (id) => {
        await client.collections("listing").documents(id).update(updatedData);
      });
    }
  }
);

module.exports = client;
