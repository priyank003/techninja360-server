const Schema = require("mongoose").Schema;
const mongoose = require("mongoose");
const certSchema = new Schema({
  merchant_id: String,
  cert_id: String,
  cert_title: String,
  cert_url: String,
  cert_img: String,
});

module.exports = mongoose.model("Certificates", certSchema);
