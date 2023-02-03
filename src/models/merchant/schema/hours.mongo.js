const { default: mongoose } = require("mongoose");

const Schema = require("mongoose").Schema;

const hoursSchema = new Schema({
  merchant_id: String,
  hour_id: String,
  days: String,
  start_time: String,
  end_time: String,
});

module.exports = mongoose.model("Hour", hoursSchema);
