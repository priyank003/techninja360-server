const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// const ServiceDetails = new Schema({
//   service_name: String,
//   fees: {
//     type: String,
//     price: Number,
//   },
//   desc: String,
// });

// const ServiceTypeSchema = new Schema({
//   type: Map,
//   of: [ServiceDetails],
// });

// const ServiceSchema = new Schema({
//   merchant_id: String,
//   service_domain: String,
//   service_type: Schema.Types.Mixed,
//   service_details: Schema.Types.Mixed,
// });

// module.exports = mongoose.model("Service", ServiceSchema);

const ServicesSchema = new Schema({
  merchant_id: String,
  // service_id: String,
  id: String,
  service_category: String,
  service_type: String,
  service_name: String,
  pricing_type: String,
  service_price: Schema.Types.Mixed,
  service_desc: String,
});

module.exports = mongoose.model("Service", ServicesSchema);
