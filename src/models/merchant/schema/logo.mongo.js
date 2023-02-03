const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LogoSchema = new Schema({
  merchant_id: String,
  primary_logo: {
    data: Buffer,
    content_type: String,
  },
  secondary_logo: {
    data: Buffer,
    content_type: String,
  },
});

module.exports = mongoose.model("Logo", LogoSchema);
