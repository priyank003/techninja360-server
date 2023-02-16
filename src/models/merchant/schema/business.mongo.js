const mongoose = require("mongoose");
const getSlug = require("speakingurl");

const Schema = mongoose.Schema;

const businessDetailsSchema = new Schema({
  business_name: String,
  website: String,
  contact: {
    toll_no: Number,
    work_number: Number,
  },
  exp_years: Number,
  emp_strength: Number,
  description: String,
});

const businessOtherSchema = new Schema({
  services: {
    remote_support: Boolean,
    inStore_service: Boolean,
    house_call: Boolean,
    pick_drop: Boolean,
    resident_service: Boolean,
    business_service: Boolean,
  },
  payment_method: {
    credit_debit: Boolean,
    paypal: Boolean,
    applePay: Boolean,
    googlePay: Boolean,
    cash: Boolean,
    crypto: Boolean,
  },
  plan_type: {
    one_time: Boolean,
    monthly: Boolean,
    yearly: Boolean,
  },
});

const businessSchema = new Schema({
  merchant_id: String,
  business_username: String,
  merchant_details: { type: Schema.Types.ObjectId, ref: "Contact" },
  business_logo: { type: Schema.Types.ObjectId, ref: "Logo" },
  business_details: businessDetailsSchema,

  certs_accrdts: {
    cert_show: String,
    cert_list: [
      {
        cert_id: String,
        cert_title: String,
        cert_url: String,
      },
    ],
  },
  business_location: { type: Schema.Types.ObjectId, ref: "Location" },
  business_hours: {
    time_zone: String,
    is_service_247: Boolean,
    // weekly_hours: [{ type: Schema.Types.ObjectId, ref: "Hour" }],
    weekly_hours: [
      {
        days: String,
        start_time: String,
        end_time: String,
        hour_id: String,
      },
    ],
  },

  business_others: businessOtherSchema,
  // business_services: [{ type: Schema.Types.ObjectId, ref: "Service" }],
  business_services: [
    {
      service_category: String,
      service_type: String,
      service_name: String,
      pricing_type: String,
      service_price: Number,
      custom_price: Boolean,
      service_desc: String,
    },
  ],
  business_logo: {
    primary_logo: String,
    secondary_logo: String,
  },
  business_rating: Number,
  merchant_slug: String,
});

businessSchema.methods.addCertificate = function (c) {
  this.certs_accrdts.cert_list.push(c);
  this.save();
};

businessSchema.methods.deleteCertificate = function (c) {
  const id = String(c).trim();
  const docId = mongoose.Types.ObjectId(id);

  this.certs_accrdts.cert_list.pull(docId);
  this.save();
};

businessSchema.methods.pushWeeklyHour = function (weekly_hour) {
  this.business_hours.weekly_hours.addToSet(weekly_hour);
  this.save();
};

businessSchema.methods.deleteWeeklyHour = function (c) {
  const id = String(c).trim();
  const docId = mongoose.Types.ObjectId(id);

  this.business_hours.weekly_hours.pull(docId);
  this.save();
};

businessSchema.methods.setShowCert = function (c) {
  this.certs_accrdts.cert_show = c;
  this.save();
};

// businessSchema.methods.createSlug = function (newSlug) {
//   // const slug = getSlug(
//   //   `${address.city} ${address.zip_code} ${this.business_username}`,
//   //   {
//   //     separator: "/",
//   //   }
//   // );
//   this.merchant_slug = slug;
//   this.save();
// };

module.exports = mongoose.model("Business_detail", businessSchema);
