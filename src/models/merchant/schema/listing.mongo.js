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
  remote_support: Boolean,
  inStore_service: Boolean,
  house_call: Boolean,
  pick_drop: Boolean,
  resident_service: Boolean,
  business_service: Boolean,
  credit_debit: Boolean,
  paypal: Boolean,
  applePay: Boolean,
  googlePay: Boolean,
  cash: Boolean,
  crypto: Boolean,
  one_time: Boolean,
  monthly: Boolean,
  yearly: Boolean,
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
