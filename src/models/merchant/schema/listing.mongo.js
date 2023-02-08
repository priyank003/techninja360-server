const { default: mongoose } = require("mongoose");

const Schema = require("mongoose").Schema;

const ListingSchema = new Schema({
  merchant_id: String,
  business_name: String,
  business_rating: Number,
  rating_count: Number,
  exp_years: Number,
  emp_strength: Number,
  is_service_247: Boolean,
  // service_name: String,
  // service_category: String,
  // pricing_type: String,
  // service_desc: String,
  // service_id: String,
  // id: String,
  // service_type: String,
  // service_price: String,
  merchant_slug: String,
  primary_logo: String,
  secondary_logo: String,
  business_location: [Number],
  typesense_docs: [String],
});

// ListingSchema.pre("save", function (next) {
//   this.id = this._id;
//   next();
// });

module.exports = mongoose.model("Listing", ListingSchema);
