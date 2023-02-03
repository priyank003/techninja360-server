const { default: mongoose } = require("mongoose");

const Schema = require("mongoose").Schema;


const LocationSchema = new Schema({
  merchant_id: String,
  address_type: String,
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    zip_code: Number,
  },
  //[latitude, longitude]
  coordinates: { lat: String, long: String },
  service_radius: {
    start: String,
    end: String,
  },
  zip_covered: [String],
});

module.exports = mongoose.model("Location", LocationSchema);
